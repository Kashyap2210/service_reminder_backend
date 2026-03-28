import { Injectable } from '@nestjs/common';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends EntityManagerBaseService<EntityList.USER> {
  getEntityClass(): new () => IUserEntity {
    return UserEntity;
  }
}
