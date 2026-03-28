import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IEntityCreateDto } from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { getObjectDiffingKeys } from 'src/common/utils/helper.fns';
import { EntityManager } from 'typeorm';
import { EntityManagerBaseService } from '../repositories/entity.base.manager';
import { BaseService } from './base.service';

export abstract class BaseHistoryService<
  T extends EntityList, // T will be the history entity class
  K extends EntityList, // K will be the entity whose history is created class
> extends BaseService<T> {
  constructor(entityName: T) {
    super(entityName);
  }

  abstract getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<T>;

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
}
