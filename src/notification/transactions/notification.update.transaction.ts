import { Inject, Injectable } from '@nestjs/common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { NotificationService } from '../services/notification.service';
import {
  INotificationUpdateTransactionInputData,
  INotificationUpdateTransactionOutputData,
} from './interfaces/notification-update-transaction.interface';
import { EntityList } from 'service_reminder_common';

@Injectable()
export class NotificationUpdateTransaction extends BaseTransaction<
  INotificationUpdateTransactionInputData,
  INotificationUpdateTransactionOutputData
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
    data: INotificationUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<INotificationUpdateTransactionOutputData> {
    const { id, dto, currentUser } = data;

    return this.notificationService.updateByIdBase(
      id,
      { ...dto, updatedBy: currentUser.id },
      manager,
    );
  }
}
