import { Inject, Injectable } from '@nestjs/common';
import { EntityList } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { NotificationService } from '../services/notification.service';
import {
  INotificationCreateTransactionInputData,
  INotificationCreateTransactionOutputData,
} from './interfaces/notification-create-transaction.interface';

@Injectable()
export class NotificationCreateTransaction extends BaseTransaction<
  INotificationCreateTransactionInputData,
  INotificationCreateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get notificationService(): NotificationService {
    return this.registryService.get(
      EntityList.NOTIFICATION,
    ) as NotificationService;
  }

  protected async execute(
    data: INotificationCreateTransactionInputData,
    manager: EntityManager,
  ): Promise<INotificationCreateTransactionOutputData> {
    const { dto, currentUser } = data;

    const instance = await this.notificationService.getInstanceBase(
      currentUser,
      dto,
      manager,
    );

    return this.notificationService.createBase(instance, manager);
  }
}
