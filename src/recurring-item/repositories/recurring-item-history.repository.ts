import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { RecurringItemHistoryEntity } from '../entities/recurring-item-history.entity';
import { EntityList, IRecurringItemHistoryEntity } from 'service_reminder_common';

@Injectable()
export class RecurringItemHistoryRepository extends EntityManagerBaseService<EntityList.RECURRING_ITEM_HISTORY> {
  getEntityClass(): new () => IRecurringItemHistoryEntity {
    return RecurringItemHistoryEntity;
  }
}
