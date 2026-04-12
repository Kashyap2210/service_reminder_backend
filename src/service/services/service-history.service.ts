import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { EntityManager } from 'typeorm';
import { ServiceHistoryRepository } from '../repositories/service-history.repository';
import { EntityList } from 'service_reminder_common';

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
}
