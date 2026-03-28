import { BadRequestException, Injectable } from '@nestjs/common';
import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import {
  DeepPartial,
  EntityManager,
  QueryDeepPartialEntity,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export abstract class EntityManagerBaseService<T extends EntityList> {
  protected readonly globalEntityManager: EntityManager;

  constructor(globalEntityManager: EntityManager) {
    this.globalEntityManager = globalEntityManager;
  }

  // Returns global or transaction entity manager
  getEntityManager(entityManager?: EntityManager): EntityManager {
    return entityManager ?? this.globalEntityManager;
  }

  // Every service must tell us which entity class it manages
  abstract getEntityClass(): new () => EntityType<T>;

  // Get repository from entity manager
  getRepository(entityManager?: EntityManager): Repository<EntityType<T>> {
    return this.getEntityManager(entityManager).getRepository(
      this.getEntityClass(),
    );
  }

  // Get query builder
  getQueryBuilder(
    entityManager?: EntityManager,
  ): SelectQueryBuilder<EntityType<T>> {
    const repository = this.getRepository(entityManager);
    return repository.createQueryBuilder(repository.metadata.tableName);
  }

  // Validate that records exist by a property
  async validatePresence<P>(
    propertyName: string,
    propertyValues: P[],
    key?: string,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    const repository = this.getRepository(entityManager);
    const tableName = repository.metadata.tableName;

    const entities = await repository
      .createQueryBuilder(tableName)
      .andWhere(`${tableName}.${propertyName} IN (:...propertyValues)`, {
        propertyValues,
      })
      .getMany();

    const existingValues = entities.map((entity) => entity[propertyName]);
    const missingValues = propertyValues.filter(
      (value) => !existingValues.includes(value),
    );

    if (missingValues.length > 0) {
      throw new BadRequestException({
        key: key || propertyName,
        message: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} with ${propertyName} ${missingValues.join(', ')} not found.`,
      });
    }

    return entities;
  }

  // Get by dynamic filters
  async getByFilter(
    filter: IEntityFilterData<EntityType<T>>,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    const repository = this.getRepository(entityManager);
    const tableName = repository.metadata.tableName;

    let query = repository.createQueryBuilder(tableName);

    for (const [property, value] of Object.entries(filter)) {
      if (value === undefined || value === null) continue;
      const normalizedValue = Array.isArray(value) ? value : [value];
      if (normalizedValue.length === 0) continue;

      query = query.andWhere(`${tableName}.${property} IN (:...${property})`, {
        [property]: normalizedValue,
      });
    }

    return query.getMany();
  }

  // Create instance without saving
  async getInstance(
    data: IEntityCreateDto<EntityType<T>>,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>> {
    return this.getRepository(entityManager).create(
      data as DeepPartial<EntityType<T>>,
    );
  }

  // Save entity
  async create(
    entity: EntityType<T>,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>> {
    return this.getRepository(entityManager).save(entity);
  }

  // Update by id
  async updateById(
    id: number,
    entity: IEntityUpdateDto<EntityType<T>> & { updatedBy: number },
    entityManager?: EntityManager,
  ): Promise<EntityType<T>> {
    await this.getRepository(entityManager).update(
      id,
      entity as QueryDeepPartialEntity<EntityType<T>>,
    );
    const updated = await this.getByFilter(
      { id: [id] } as IEntityFilterData<EntityType<T>>,
      entityManager,
    );
    return updated[0];
  }

  // Delete by id
  async deleteById(
    id: number,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    const repository = this.getRepository(entityManager);
    const tableName = repository.metadata.tableName;
    const result = await repository.delete(id);

    if (result.affected === 0) {
      throw new BadRequestException({
        key: id,
        message: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} with id ${id} not found`,
      });
    }
    return true;
  }

  // Delete many by ids
  async deleteMany(
    ids: number[],
    entityManager?: EntityManager,
  ): Promise<boolean> {
    const repository = this.getRepository(entityManager);
    const tableName = repository.metadata.tableName;
    const result = await repository.delete(ids);

    if (result.affected === 0) {
      throw new BadRequestException({
        key: ids,
        message: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} with ids ${ids.join(', ')} not found`,
      });
    }
    return true;
  }
}
