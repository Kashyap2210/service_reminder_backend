import {
  INotificationEntity,
  INotificationUpdateDto,
  IUserEntity,
} from 'service_reminder_common';

export interface INotificationUpdateTransactionInputData {
  id: number;
  dto: INotificationUpdateDto;
  currentUser: IUserEntity;
  existingEntity: INotificationEntity;
}

export interface INotificationUpdateTransactionOutputData extends INotificationEntity {}
