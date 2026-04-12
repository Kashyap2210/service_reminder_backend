import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { UserEntity } from '../entities/user.entity';
import { EntityList, IUserEntity } from 'service_reminder_common';

@Injectable()
export class UserRepository extends EntityManagerBaseService<EntityList.USER> {
  getEntityClass(): new () => IUserEntity {
    return UserEntity;
  }
}
