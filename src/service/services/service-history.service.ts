import { Injectable } from '@nestjs/common';
import { EntityList, EntityType } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { IEntityConfig } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { ServiceHistoryRepository } from '../repositories/service-history.repository';

@Injectable()
export class ServiceHistoryService extends BaseHistoryService<
  EntityList.SERVICE_HISTORY,
  EntityList.SERVICE
> {
  constructor(
    private readonly serviceHistoryRepository: ServiceHistoryRepository,
  ) {
    super(EntityList.SERVICE_HISTORY);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.SERVICE_HISTORY> {
    return this.serviceHistoryRepository;
  }

  getEntityConfig(): IEntityConfig<EntityType<EntityList.SERVICE_HISTORY>> {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
    };
  }
}
