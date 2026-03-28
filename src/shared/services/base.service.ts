import { BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { DataSource, EntityManager } from 'typeorm';
import { RegistryService } from './registry.service';
import { EntityManagerBaseService } from '../repositories/entity.base.manager';

export abstract class BaseService<
  T extends EntityList,
> implements OnModuleInit {
  constructor(protected readonly entityName: T) {}

  @Inject()
  registryService: RegistryService;

  @Inject(DataSource)
  private dataSource: DataSource;

  onModuleInit() {
    this.registryService.set(this.entityName, this);
  }

  abstract getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<T>;

  getEntityManager(entityManager?: EntityManager) {
    return entityManager ?? this.dataSource.manager;
  }

  getServicesFromRegistry<K extends EntityList>(entities: K[]) {
    const response: Map<K, BaseService<K>> = new Map();
    for (const entity of entities) {
      const service = this.registryService.get(entity);
      response.set(entity, service);
    }

    return response;
  }

  async getInstanceBase(
    currentUser: IUserEntity,
    data: IEntityCreateDto<EntityType<T>>,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>> {
    const instance = await this.getRepository(entityManager).getInstance(data);
    instance.createdBy = instance.updatedBy = currentUser.id;
    return instance;
  }

  async createBase(
    entity: EntityType<T>,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>> {
    return this.getRepository(entityManager).create(entity);
  }

  async updateByIdBase(
    id: number,
    dto: IEntityUpdateDto<EntityType<T>> & { updatedBy: number },
    entityManager?: EntityManager,
  ) {
    return this.getRepository(entityManager).updateById(id, dto, entityManager);
  }

  async deleteByIdsBase(
    currentUser: IUserEntity,
    ids: number[],
    entityManager?: EntityManager,
  ) {
    if (!currentUser) {
      throw new BadRequestException({
        key: 'currentUser',
        message: 'User is required',
      });
    }
    await this.getRepository(entityManager).validatePresence(
      'id',
      ids,
      'id',
      entityManager,
    );
    return this.getRepository(entityManager).deleteMany(ids, entityManager);
  }

  async search(
    filter: IEntityFilterData<EntityType<T>>,
    currentUser?: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    return this.getRepository(entityManager).getByFilter(filter, entityManager);
  }
}
