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
  IVendorUpdateTransactionInputData,
  IVendorUpdateTransactionOutputData,
} from './interfaces/vendor-update-transaction.interface';

@Injectable()
export class VendorUpdateTransaction extends BaseTransaction<
  IVendorUpdateTransactionInputData,
  IVendorUpdateTransactionOutputData
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
    data: IVendorUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<IVendorUpdateTransactionOutputData> {
    const {
      id,
      dto,
      currentUser,
      existingEntity,
      mappingsToCreate,
      mappingsToDelete,
    } = data;

    const updated = await this.vendorService.updateByIdBase(
      id,
      { ...dto.toUpdateDto(), updatedBy: currentUser.id },
      manager,
    );

    if (mappingsToCreate && mappingsToCreate.length > 0) {
      const vendorRecurringItemMappingsToCreate: IVendorRecurringItemMappingCreateDto[] =
        [];
      for (const mapping of mappingsToCreate) {
        vendorRecurringItemMappingsToCreate.push({
          vendorId: updated.id,
          recurringItemId: mapping,
        });
      }
      await this.vendorService.createVendorRecurringItemMappingEntities(
        currentUser,
        vendorRecurringItemMappingsToCreate,
        manager,
      );
    }

    if (mappingsToDelete && mappingsToDelete.length > 0) {
      await this.vendorService.deleteVendorRecurringItemMappingEntities(
        currentUser,
        mappingsToDelete,
        manager,
      );
    }

    await this.vendorHistoryService.createHistoryEntity(
      currentUser,
      existingEntity,
      EntityHistoryOperation.UPDATE,
      { ...updated },
      manager,
    );

    return updated;
  }
}
