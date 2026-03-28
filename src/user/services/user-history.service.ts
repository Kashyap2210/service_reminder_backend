import { Injectable } from '@nestjs/common';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { EntityManager } from 'typeorm';
import { UserHistoryRepository } from '../repositories/user-history.repository';

@Injectable()
export class UserHistoryService extends BaseHistoryService<
  EntityList.USER_HISTORY,
  EntityList.USER
> {
  constructor(private readonly userHistoryRepository: UserHistoryRepository) {
    super(EntityList.USER_HISTORY);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.USER_HISTORY> {
    return this.userHistoryRepository;
  }
}
