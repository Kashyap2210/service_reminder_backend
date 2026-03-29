import { Inject, Injectable } from '@nestjs/common';
import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { IVendorRecurringItemMappingCreateDto } from 'src/common/interfaces/dtos/vendor-recurring-item-mapping.dto.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { VendorHistoryService } from '../services/vendor-history.service';
import { VendorRecurringItemMappingService } from '../services/vendor-recurring-item-mapping.service';
import { VendorService } from '../services/vendor.service';
import {
  IVendorCreateTransactionInputData,
  IVendorCreateTransactionOutputData,
} from './interfaces/vendor-create-transaction.interface';

@Injectable()
export class VendorCreateTransaction extends BaseTransaction<
  IVendorCreateTransactionInputData,
  IVendorCreateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get vendorService(): VendorService {
    return this.registryService.get(EntityList.VENDOR) as VendorService;
  }

  get vendorRecurringItemMappingService(): VendorRecurringItemMappingService {
    return this.registryService.get(
      EntityList.VENDOR_RECURRING_ITEM_MAPPING,
    ) as VendorRecurringItemMappingService;
  }

  get vendorHistoryService(): VendorHistoryService {
    return this.registryService.get(
      EntityList.VENDOR_HISTORY,
    ) as VendorHistoryService;
  }

  protected async execute(
    data: IVendorCreateTransactionInputData,
    manager: EntityManager,
  ): Promise<IVendorCreateTransactionOutputData> {
    const { dto, currentUser } = data;

    const instance = await this.vendorService.getInstanceBase(
      currentUser,
      dto.toCreateDto(),
      manager,
    );

    const created = await this.vendorService.createBase(instance, manager);

    //  here we also update the vendor-recurringitem-mapping-entity
    const mappingEntityDtos: IVendorRecurringItemMappingCreateDto[] = [];
    for (const id of dto.recurringItemIds) {
      mappingEntityDtos.push({
        vendorId: created.id,
        recurringItemId: id,
      });
    }
    await this.vendorService.createVendorRecurringItemMappingEntities(
      currentUser,
      mappingEntityDtos,
      manager,
    );

    await this.vendorHistoryService.createHistoryEntity(
      currentUser,
      created,
      EntityHistoryOperation.CREATE,
      undefined,
      manager,
    );

    return created;
  }
}
