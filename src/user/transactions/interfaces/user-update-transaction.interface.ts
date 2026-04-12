import { IUserEntity, IUserUpdateDto } from "service_reminder_common";

export interface IUserUpdateTransactionInputData {
  id: number;
  dto: IUserUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IUserEntity;
}

export interface IUserUpdateTransactionOutputData extends IUserEntity {}
