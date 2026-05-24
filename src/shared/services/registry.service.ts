import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityList } from 'service_reminder_common';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { BaseService } from './base.service';

export type EntityListServiceMapping = {
  [EntityList.USER]: UserService;
};

export type EntityListEntityMapping = {
  [EntityList.USER]: UserEntity;
};

@Injectable()
export class RegistryService {
  serviceRegistry = new Map<EntityList, BaseService<EntityList>>();

  set<T extends EntityList>(entityName: T, service: BaseService<T>) {
    if (!this.serviceRegistry.get(entityName)) {
      this.serviceRegistry.set(entityName, service);
      console.log(`Registering service for ${entityName}.`);
    } else {
      throw new BadRequestException({
        key: 'entityName',
        message: `${entityName}'s service already exists in the service registry.`,
      });
    }
  }

  get<T extends EntityList>(entityName: T): BaseService<T> {
    const service = this.serviceRegistry.get(entityName);
    if (!service) {
      throw new BadRequestException({
        key: 'entityName',
        message: `Service for ${entityName} not found.`,
      });
    }
    return service as BaseService<T>;
  }
}
