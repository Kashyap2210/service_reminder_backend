import { BadRequestException, Injectable } from '@nestjs/common';
import {
  EntityList,
  EntityType,
  ICronJobEntity,
  IUserEntity,
} from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService, IEntityConfig } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { CronJobCreateDto } from '../dtos/cronjob.create.dto';
import { CronJobUpdateDto } from '../dtos/cronjob.update.dto';
import { CronJobRepository } from '../repositories/cronjob.repository';
import { CronJobCreateTransaction } from '../transactions/cronjob.create.transaction';
import { CronJobUpdateTransaction } from '../transactions/cronjob.update.transaction';
import { ICronJobCreateTransactionInputData } from '../transactions/interfaces/cronjob-create-transaction.interface';
import { ICronJobUpdateTransactionInputData } from '../transactions/interfaces/cronjob-update-transaction.interface';

@Injectable()
export class CronJobService extends BaseService<EntityList.CRONJOB> {
  constructor(
    private readonly cronJobRepository: CronJobRepository,
    private readonly cronJobCreateTransaction: CronJobCreateTransaction,
    private readonly cronJobUpdateTransaction: CronJobUpdateTransaction,
  ) {
    super(EntityList.CRONJOB);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.CRONJOB> {
    return this.cronJobRepository;
  }

  getEntityConfig(): IEntityConfig<EntityType<EntityList.CRONJOB>> {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
    };
  }

  async createCronJob(
    currentUser: IUserEntity,
    dto: CronJobCreateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.CRONJOB>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: ICronJobCreateTransactionInputData = {
      dto: dto.toCreateDto(),
      currentUser,
    };

    return this.cronJobCreateTransaction.run(data);
  }

  async updateCronJob(
    id: number,
    currentUser: IUserEntity,
    dto: CronJobUpdateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.CRONJOB>> {
    let existing: ICronJobEntity | null = null;
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
      id,
    );
    if (validationResult) {
      if (Array.isArray(validationResult)) {
        const errors = validationResult;
        throw new BadRequestException(errors[0]);
      } else if (typeof validationResult === 'object') {
        existing = validationResult;
      }
    }

    const data: ICronJobUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(),
      currentUser,
      existingEntity: existing!,
    };

    return this.cronJobUpdateTransaction.run(data);
  }

  async deleteCronJob(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.cronJobRepository.deleteById(id, entityManager);
  }
}
