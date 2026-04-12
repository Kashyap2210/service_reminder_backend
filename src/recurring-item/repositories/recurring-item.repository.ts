import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { RecurringItemEntity } from '../entities/recurring-item.entity';
import { EntityList, IRecurringItemEntity } from 'service_reminder_common';

@Injectable()
export class RecurringItemRepository extends EntityManagerBaseService<EntityList.RECURRING_ITEM> {
  getEntityClass(): new () => IRecurringItemEntity {
    return RecurringItemEntity;
  }
}
