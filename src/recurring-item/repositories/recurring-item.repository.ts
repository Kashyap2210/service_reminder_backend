import { Injectable } from '@nestjs/common';
import { IRecurringItemEntity } from 'src/common/interfaces/entities/recurring-item.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { RecurringItemEntity } from '../entities/recurring-item.entity';

@Injectable()
export class RecurringItemRepository extends EntityManagerBaseService<EntityList.RECURRING_ITEM> {
  getEntityClass(): new () => IRecurringItemEntity {
    return RecurringItemEntity;
  }
}
