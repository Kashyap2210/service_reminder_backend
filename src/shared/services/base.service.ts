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

export type IEntityRelationConfig<
  TSource,
  K extends EntityList = EntityList,
> = {
  mappingProperty: keyof TSource;
  searchProperty: keyof EntityType<K>;
};

export type IEntityConfig<T> = {
  [K in EntityList]?: IEntityRelationConfig<T, K>;
};

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

  abstract getEntityConfig(): IEntityConfig<EntityType<T>>;

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
    return this.getRepository(entityManager).create(entity, entityManager);
  }

  async createBulkBase(
    currentUser: IUserEntity,
    entities: EntityType<T>[],
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    return this.getRepository(entityManager).createBulk(
      entities,
      entityManager,
    );
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
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<ISearchV2Response> {
    console.log('filter from searchV2', filter);
    const {
      include = {},
      entities,
      relations,
      columnKeys,
      orderBy,
      limit,
      ...rest
    } = filter;
    // console.log('relations', relations);
    const mainResponse = {} as ISearchV2Response;
    const mainResults = await this.getRepository(entityManager).getByFilter(
      {
        include,
        ...rest,
        ...(columnKeys?.length ? { columnKeys } : undefined),
        ...(orderBy ? { orderBy } : undefined),
        ...(limit ? { limit } : undefined),
      } as IEntityFilterData<EntityType<T>>,
      entityManager,
    );
    mainResponse[this.entityName] = mainResults as ISearchV2Response[T];

    if (entities?.length) {
      await Promise.all(
        entities.map(
          async ({
            name,
            include: entityFilter,
            columnKeys,
            orderBy,
            limit,
            relations,
          }) => {
            const cleanEntityFilter = entityFilter
              ? Object.fromEntries(
                  Object.entries(entityFilter).filter(
                    ([_, v]) => v !== undefined && v !== null,
                  ),
                )
              : {};
            const results = await this.registryService.get(name).searchV2(
              {
                include: cleanEntityFilter,
                ...(columnKeys?.length ? { columnKeys } : undefined),
                ...(orderBy ? { orderBy } : undefined),
                ...(limit ? { limit } : undefined),
                ...(relations ? { relations } : undefined),
              },
              currentUser,
              entityManager,
            );

            // @ts-ignore — runtime type is correct, TS can't narrow through Map<EntityList, BaseService<EntityList>>
            for (const [key, value] of Object.entries(results)) {
              // @ts-ignore
              mainResponse[key as EntityList] = value;
            }
          },
        ),
      );
    }

    if (relations?.length) {
      const config = this.getEntityConfig();
      // console.log('config', config);

      for (const {
        name,
        columnKeys,
        orderBy,
        limit,
        relations: nestedRelations,
      } of relations) {
        const relationConfig = config[name];
        if (!relationConfig || !mainResults.length) continue;
        const { mappingProperty, searchProperty } = relationConfig;
        const fkValues = [
          ...new Set(
            mainResults
              .map(
                (r) =>
                  (r as unknown as Record<string, unknown>)[
                    mappingProperty as string
                  ],
              )
              .filter((v) => v != null),
          ),
        ];
        if (!fkValues.length) continue;

        const nestedResponse = await this.registryService.get(name).searchV2(
          {
            include: {
              [searchProperty as string]: fkValues,
            },
            ...(columnKeys?.length ? { columnKeys } : undefined),
            ...(orderBy ? { orderBy } : undefined),
            ...(limit ? { limit } : undefined),
            ...(nestedRelations?.length
              ? { relations: nestedRelations }
              : undefined),
          },
          currentUser,
          entityManager,
        );

        // console.log("nestedResponse", nestedResponse)

        // always merge — never assign directly
        for (const [key, value] of Object.entries(nestedResponse)) {
          // @ts-ignore
          mainResponse[key as EntityList] = value;
        }
      }
    }

    return mainResponse;
  }

  async updateBulkBase(
    entities: (IEntityUpdateDto<EntityType<T>> & {
      id: number;
      updatedBy?: number;
    })[],
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    return this.getRepository(entityManager).updateBulk(
      entities,
      entityManager,
    );
  }
}
