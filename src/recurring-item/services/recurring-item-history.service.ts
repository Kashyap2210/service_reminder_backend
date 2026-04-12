import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { EntityManager } from 'typeorm';
import { RecurringItemHistoryRepository } from '../repositories/recurring-item-history.repository';
import { EntityList } from 'service_reminder_common';

@Injectable()
export class RecurringItemHistoryService extends BaseHistoryService<
  EntityList.RECURRING_ITEM_HISTORY,
  EntityList.RECURRING_ITEM
> {
  constructor(
    private readonly recurringItemHistoryRepository: RecurringItemHistoryRepository,
  ) {
    super(EntityList.RECURRING_ITEM_HISTORY);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.RECURRING_ITEM_HISTORY> {
    return this.recurringItemHistoryRepository;
  }
}
