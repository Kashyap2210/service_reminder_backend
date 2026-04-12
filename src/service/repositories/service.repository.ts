import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { ServiceEntity } from '../entities/service.entity';
import { EntityList, IServiceEntity } from 'service_reminder_common';

@Injectable()
export class ServiceRepository extends EntityManagerBaseService<EntityList.SERVICE> {
  getEntityClass(): new () => IServiceEntity {
    return ServiceEntity;
  }
}
