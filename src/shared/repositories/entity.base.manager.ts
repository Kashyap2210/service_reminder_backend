import { BadRequestException, Injectable } from '@nestjs/common';
import {
  EntityList,
  EntityType,
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
  OrderByDirection,
} from 'service_reminder_common';
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
    console.log('filter from entity-base-manager for getByFilter', filter);

    const { columnKeys, entities, orderBy, limit, ...rest } = filter;
    // console.log('orderBy', orderBy);

    const repository = this.getRepository(entityManager);
    const tableName = repository.metadata.tableName;

    let query = repository.createQueryBuilder(tableName);

    for (const [property, value] of Object.entries(rest)) {
      if (value === undefined || value === null) continue;
      const normalizedValue = Array.isArray(value) ? value : [value];
      if (normalizedValue.length === 0) continue;

      query = query.andWhere(`${tableName}.${property} IN (:...${property})`, {
        [property]: normalizedValue,
      });
    }

    if (columnKeys && columnKeys.length > 0) {
      query = query.select(
        columnKeys.map(
          (col: keyof EntityType<T>) => `${tableName}.${String(col)}`,
        ),
      );
    }

    if (orderBy && Object.keys(orderBy).length > 0) {
      let isFirst = true;
      for (const [column, direction] of Object.entries(orderBy)) {
        if (isFirst) {
          query = query.orderBy(
            `${tableName}.${column}`,
            direction as OrderByDirection,
          );
          isFirst = false;
        } else {
          query = query.addOrderBy(
            `${tableName}.${column}`,
            direction as OrderByDirection,
          );
        }
      }
    }

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    // console.log('final SQL:', query.getSql());
    const result = await query.getMany();
    // console.log('result', result);

    return result;
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

  // Create many entities
  async createBulk(
    entities: EntityType<T>[],
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    return this.getRepository(entityManager).save(entities);
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

  async updateBulk(
    entities: (IEntityUpdateDto<EntityType<T>> & {
      id: number;
      updatedBy?: number;
    })[],
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    if (!entities.length) {
      return [];
    }

    const repository = this.getRepository(entityManager);

    const primaryColumn = repository.metadata.primaryColumns[0];

    if (!primaryColumn) {
      throw new BadRequestException({
        key: 'primaryColumn',
        message: 'Primary column not found',
      });
    }

    const primaryPropertyName = primaryColumn.propertyName;

    const primaryDatabaseName = primaryColumn.databaseName;

    // validate ids
    const ids = entities.map(
      (entity) => entity[primaryPropertyName],
    ) as number[];

    // valid columns from metadata
    const validColumns = new Set(
      repository.metadata.columns.map((column) => column.propertyName),
    );

    // collect update columns
    const updateColumns = new Set<string>();

    for (const entity of entities) {
      for (const key of Object.keys(entity)) {
        if (key !== primaryPropertyName && validColumns.has(key)) {
          updateColumns.add(key);
        }
      }
    }

    if (!updateColumns.size) {
      return [];
    }

    const updatePayload: Record<string, () => string> = {};

    for (const column of updateColumns) {
      const columnMetadata = repository.metadata.columns.find(
        (c) => c.propertyName === column,
      );

      if (!columnMetadata) continue;

      const dbColumnName = columnMetadata.databaseName;

      const cases: string[] = [];

      for (const entity of entities) {
        const value = entity[column as keyof typeof entity];

        if (value === undefined) continue;

        let formattedValue: string;

        if (value === null) {
          formattedValue = 'NULL';
        } else if (typeof value === 'number') {
          formattedValue = `${value}`;
        } else if (typeof value === 'boolean') {
          formattedValue = value ? '1' : '0';
        } else if (value instanceof Date) {
          formattedValue = `'${value
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'`;
        } else {
          formattedValue = `'${String(value).replace(/'/g, "''")}'`;
        }

        const entityId = entity[primaryPropertyName as keyof typeof entity];

        cases.push(`
        WHEN ${primaryDatabaseName} = ${entityId}
        THEN ${formattedValue}
      `);
      }

      if (!cases.length) continue;

      updatePayload[column] = () => `
      CASE
        ${cases.join('\n')}
        ELSE \`${dbColumnName}\`
      END
    `;
    }

    await repository
      .createQueryBuilder()
      .update(this.getEntityClass())
      .set(updatePayload)
      .where(`\`${primaryDatabaseName}\` IN (:...ids)`, { ids })
      .execute();

    return this.getByFilter(
      {
        [primaryPropertyName]: ids,
      } as IEntityFilterData<EntityType<T>>,
      entityManager,
    );
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
