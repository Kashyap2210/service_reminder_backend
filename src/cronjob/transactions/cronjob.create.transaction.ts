import { Inject, Injectable } from '@nestjs/common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { CronJobService } from '../services/cronjob.service';
import {
  ICronJobCreateTransactionInputData,
  ICronJobCreateTransactionOutputData,
} from './interfaces/cronjob-create-transaction.interface';
import { EntityList } from 'service_reminder_common';

@Injectable()
export class CronJobCreateTransaction extends BaseTransaction<
  ICronJobCreateTransactionInputData,
  ICronJobCreateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get cronJobService(): CronJobService {
    return this.registryService.get(EntityList.CRONJOB) as CronJobService;
  }

  protected async execute(
    data: ICronJobCreateTransactionInputData,
    manager: EntityManager,
  ): Promise<ICronJobCreateTransactionOutputData> {
    const { dto, currentUser } = data;

    const instance = await this.cronJobService.getInstanceBase(
      currentUser,
      dto,
      manager,
    );

    return this.cronJobService.createBase(instance, manager);
  }
}
