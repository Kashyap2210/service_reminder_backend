import { IRecurringItemEntity, IRecurringItemUpdateDto, IUserEntity } from "service_reminder_common";

export interface IRecurringItemUpdateTransactionInputData {
  id: number;
  dto: IRecurringItemUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IRecurringItemEntity;
}

export interface IRecurringItemUpdateTransactionOutputData
  extends IRecurringItemEntity {}
