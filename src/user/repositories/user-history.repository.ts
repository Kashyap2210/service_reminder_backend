import { Injectable } from '@nestjs/common';
import { IUserHistoryEntity } from 'src/common/interfaces/entities/user.history.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { UserHistoryEntity } from '../entities/user-history.entity';

@Injectable()
export class UserHistoryRepository extends EntityManagerBaseService<EntityList.USER_HISTORY> {
  getEntityClass(): new () => IUserHistoryEntity {
    return UserHistoryEntity;
  }
}
