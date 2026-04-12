import { IUserCreateDto, IUserEntity } from "service_reminder_common";

export interface IUserCreateTransactionInputData {
  dto: IUserCreateDto;
  currentUser: IUserEntity;
}

export interface IUserCreateTransactionOutputData extends IUserEntity {}
