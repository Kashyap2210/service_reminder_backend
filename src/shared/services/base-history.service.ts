import {
  EntityHistoryOperation,
  EntityList,
  EntityType,
  getObjectDiffingKeys,
  IEntityCreateDto,
  IUserEntity,
} from 'service_reminder_common';
import { EntityManager } from 'typeorm';
import { BaseService } from './base.service';

export abstract class BaseHistoryService<
  T extends EntityList, // T will be the history entity class
  K extends EntityList, // K will be the entity whose history is created class
> extends BaseService<T> {
  constructor(entityName: T) {
    super(entityName);
  }

  // abstract getEntityConfig(): IEntityConfig<EntityType<T>>;

  async createHistoryEntity(
    currentUser: IUserEntity,
    oldEntity: EntityType<K>,
    operation: EntityHistoryOperation,
    newEntity?: EntityType<K>,
    entityManager?: EntityManager,
  ): Promise<EntityType<T>> {
    let data: Partial<EntityType<K>> = this.getHistoryEntityData(
      oldEntity,
      newEntity,
    );

    const createDto = this.getHistoryEntityCreateDto(
      oldEntity,
      data,
      operation,
    );

    const historyEntityInstance = await this.getInstanceBase(
      currentUser,
      createDto,
      entityManager,
    );

    return this.createBase(historyEntityInstance, entityManager);
  }

  private getHistoryEntityCreateDto(
    oldEntity: EntityType<K>,
    data: Partial<EntityType<K>>,
    operation: EntityHistoryOperation,
  ) {
    return {
      entityId: oldEntity.id,
      data: JSON.stringify(data),
      operation: operation,
    } as unknown as IEntityCreateDto<EntityType<T>>;
  }

  private getHistoryEntityData(
    oldEntity: EntityType<K>,
    newEntity?: EntityType<K>,
  ): Partial<EntityType<K>> {
    let data: Partial<EntityType<K>> = oldEntity;
    if (newEntity) {
      data = getObjectDiffingKeys(oldEntity, newEntity);
    }
    return data;
  }

  async createBulkHistory(
    currentUser: IUserEntity,
    existingEntities: EntityType<K>[],
    operation: EntityHistoryOperation,
    updatedEntities?: EntityType<K>[],
    entityManager?: EntityManager,
  ): Promise<EntityType<T>[]> {
    if (!existingEntities.length) {
      return [];
    }

    const updatedEntityMap = new Map<number, EntityType<K>>();

    if (updatedEntities?.length) {
      for (const entity of updatedEntities) {
        updatedEntityMap.set(entity.id, entity);
      }
    }

    const historyInstances: EntityType<T>[] = [];

    for (const existingEntity of existingEntities) {
      const updatedEntity = updatedEntityMap.get(existingEntity.id);

      const data = this.getHistoryEntityData(existingEntity, updatedEntity);

      // Skip empty diffs
      if (
        operation === EntityHistoryOperation.UPDATE &&
        (!data || Object.keys(data).length === 0)
      ) {
        continue;
      }

      const createDto = this.getHistoryEntityCreateDto(
        existingEntity,
        data,
        operation,
      );

      const historyInstance = await this.getInstanceBase(
        currentUser,
        createDto,
        entityManager,
      );

      historyInstances.push(historyInstance);
    }

    if (!historyInstances.length) {
      return [];
    }

    return this.createBulkBase(currentUser, historyInstances, entityManager);
  }
}
