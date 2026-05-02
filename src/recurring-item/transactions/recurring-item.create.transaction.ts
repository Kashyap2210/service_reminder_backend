import { Inject, Injectable } from '@nestjs/common';
import { EntityHistoryOperation, EntityList } from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { RecurringItemHistoryService } from '../services/recurring-item-history.service';
import { RecurringItemService } from '../services/recurring-item.service';
import {
  IRecurringItemCreateTransactionInputData,
  IRecurringItemCreateTransactionOutputData,
} from './interfaces/recurring-item-create-transaction.interface';

@Injectable()
export class RecurringItemCreateTransaction extends BaseTransaction<
  IRecurringItemCreateTransactionInputData,
  IRecurringItemCreateTransactionOutputData
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
    data: IRecurringItemCreateTransactionInputData,
    manager: EntityManager,
  ): Promise<IRecurringItemCreateTransactionOutputData> {
    const { dto, currentUser } = data;

    const instance = await this.recurringItemService.getInstanceBase(
      currentUser,
      dto,
      manager,
    );

    const created = await this.recurringItemService.createBase(
      instance,
      manager,
    );

    await this.recurringItemHistoryService.createHistoryEntity(
      currentUser,
      created,
      EntityHistoryOperation.CREATE,
      undefined,
      manager,
    );

    await this.recurringItemService.sendRecurringItemCreatedNotification(
      currentUser,
      created,
      manager,
    );

    return created;
  }
}
