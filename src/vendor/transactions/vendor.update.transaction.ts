import { Inject, Injectable } from '@nestjs/common';
import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { EntityList } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { VendorHistoryService } from '../services/vendor-history.service';
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

  get vendorHistoryService(): VendorHistoryService {
    return this.registryService.get(
      EntityList.VENDOR_HISTORY,
    ) as VendorHistoryService;
  }

  protected async execute(
    data: IVendorUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<IVendorUpdateTransactionOutputData> {
    const { id, dto, currentUser, existingEntity } = data;

    const updated = await this.vendorService.updateByIdBase(
      id,
      { ...dto, updatedBy: currentUser.id },
      manager,
    );

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
