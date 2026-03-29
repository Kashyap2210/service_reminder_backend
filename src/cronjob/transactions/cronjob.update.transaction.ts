import { Inject, Injectable } from '@nestjs/common';
import { EntityList } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { CronJobService } from '../services/cronjob.service';
import {
  ICronJobUpdateTransactionInputData,
  ICronJobUpdateTransactionOutputData,
} from './interfaces/cronjob-update-transaction.interface';

@Injectable()
export class CronJobUpdateTransaction extends BaseTransaction<
  ICronJobUpdateTransactionInputData,
  ICronJobUpdateTransactionOutputData
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
    data: ICronJobUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<ICronJobUpdateTransactionOutputData> {
    const { id, dto, currentUser } = data;

    return this.cronJobService.updateByIdBase(
      id,
      { ...dto, updatedBy: currentUser.id },
      manager,
    );
  }
}
