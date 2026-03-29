import { Injectable } from '@nestjs/common';
import { IServiceHistoryEntity } from 'src/common/interfaces/entities/service-history.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { ServiceHistoryEntity } from '../entities/service-history.entity';

@Injectable()
export class ServiceHistoryRepository extends EntityManagerBaseService<EntityList.SERVICE_HISTORY> {
  getEntityClass(): new () => IServiceHistoryEntity {
    return ServiceHistoryEntity;
  }
}
