import { IRecurringItemCreateDto, IRecurringItemEntity, IUserEntity } from "service_reminder_common";

export interface IRecurringItemCreateTransactionInputData {
  dto: IRecurringItemCreateDto;
  currentUser: IUserEntity;
}

export interface IRecurringItemCreateTransactionOutputData
  extends IRecurringItemEntity {}
