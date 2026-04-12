import { Injectable } from '@nestjs/common';
import { EntityList, IServiceHistoryEntity } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { ServiceHistoryEntity } from '../entities/service-history.entity';

@Injectable()
export class ServiceHistoryRepository extends EntityManagerBaseService<EntityList.SERVICE_HISTORY> {
  getEntityClass(): new () => IServiceHistoryEntity {
    return ServiceHistoryEntity;
  }
}
