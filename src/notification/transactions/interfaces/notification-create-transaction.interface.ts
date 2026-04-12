import { INotificationCreateDto, INotificationEntity, IUserEntity } from "service_reminder_common";

export interface INotificationCreateTransactionInputData {
  dto: INotificationCreateDto;
  currentUser: IUserEntity;
}

export interface INotificationCreateTransactionOutputData
  extends INotificationEntity {}
