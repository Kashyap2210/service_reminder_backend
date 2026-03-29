import { Injectable } from '@nestjs/common';
import { IServiceEntity } from 'src/common/interfaces/entities/service.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { ServiceEntity } from '../entities/service.entity';

@Injectable()
export class ServiceRepository extends EntityManagerBaseService<EntityList.SERVICE> {
  getEntityClass(): new () => IServiceEntity {
    return ServiceEntity;
  }
}
