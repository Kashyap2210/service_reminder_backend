import { BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import {
  EntityList,
  EntityType,
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
  ISearchV2Response,
  IUserEntity,
} from 'service_reminder_common';
import { DataSource, EntityManager } from 'typeorm';
import { EntityManagerBaseService } from '../repositories/entity.base.manager';
import { RegistryService } from './registry.service';

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
    return await this.getRepository(entityManager).getByFilter(
      filter,
      entityManager,
    );
  }

  async searchV2(
    filter: IEntityFilterData<EntityType<T>>,
    currentUser?: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<ISearchV2Response> {
    const { entities, ...rest } = filter;
    const mainResponse = {} as ISearchV2Response;
    const response = await this.getRepository(entityManager).getByFilter(
      rest as IEntityFilterData<EntityType<T>>,
      entityManager,
    );
    mainResponse[this.entityName] = response as ISearchV2Response[T];

    if (entities?.length && this.registryService) {
      await Promise.all(
        entities.map(async ({ name, include: entityFilter }) => {
          const cleanEntityFilter = entityFilter
            ? Object.fromEntries(
                Object.entries(entityFilter).filter(
                  ([_, v]) => v !== undefined && v !== null,
                ),
              )
            : {};
          const results = await this.registryService
            .get(name)
            .search(cleanEntityFilter, currentUser, entityManager);

          // @ts-ignore — runtime type is correct, TS can't narrow through Map<EntityList, BaseService<EntityList>>
          mainResponse[name] = results;
        }),
      );
    }

    return mainResponse;
  }
}
