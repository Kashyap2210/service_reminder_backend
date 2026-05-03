import { Injectable } from '@nestjs/common';
import { EntityList, EntityType } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { IEntityConfig } from 'src/shared/services/base.service';
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

  getEntityConfig(): IEntityConfig<EntityType<EntityList.USER_HISTORY>> {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
    };
  }
}
