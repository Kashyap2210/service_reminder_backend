import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { UserHistoryEntity } from '../entities/user-history.entity';
import { EntityList, IUserHistoryEntity } from 'service_reminder_common';

@Injectable()
export class UserHistoryRepository extends EntityManagerBaseService<EntityList.USER_HISTORY> {
  getEntityClass(): new () => IUserHistoryEntity {
    return UserHistoryEntity;
  }
}
