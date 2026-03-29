import { Injectable } from '@nestjs/common';
import { IRecurringItemHistoryEntity } from 'src/common/interfaces/entities/recurring-item-history.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { RecurringItemHistoryEntity } from '../entities/recurring-item-history.entity';

@Injectable()
export class RecurringItemHistoryRepository extends EntityManagerBaseService<EntityList.RECURRING_ITEM_HISTORY> {
  getEntityClass(): new () => IRecurringItemHistoryEntity {
    return RecurringItemHistoryEntity;
  }
}
