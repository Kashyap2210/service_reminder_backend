import { Inject, Injectable } from '@nestjs/common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { RecurringItemHistoryService } from '../services/recurring-item-history.service';
import { RecurringItemService } from '../services/recurring-item.service';
import {
  IRecurringItemUpdateTransactionInputData,
  IRecurringItemUpdateTransactionOutputData,
} from './interfaces/recurring-item-update-transaction.interface';
import { EntityHistoryOperation, EntityList } from 'service_reminder_common';

@Injectable()
export class RecurringItemUpdateTransaction extends BaseTransaction<
  IRecurringItemUpdateTransactionInputData,
  IRecurringItemUpdateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get recurringItemService(): RecurringItemService {
    return this.registryService.get(
      EntityList.RECURRING_ITEM,
    ) as RecurringItemService;
  }

  get recurringItemHistoryService(): RecurringItemHistoryService {
    return this.registryService.get(
      EntityList.RECURRING_ITEM_HISTORY,
    ) as RecurringItemHistoryService;
  }

  protected async execute(
    data: IRecurringItemUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<IRecurringItemUpdateTransactionOutputData> {
    const { id, dto, currentUser, existingEntity } = data;

    const updated = await this.recurringItemService.updateByIdBase(
      id,
      { ...dto, updatedBy: currentUser.id },
      manager,
    );

    await this.recurringItemHistoryService.createHistoryEntity(
      currentUser,
      existingEntity,
      EntityHistoryOperation.UPDATE,
      { ...updated },
      manager,
    );

    return updated;
  }
}
