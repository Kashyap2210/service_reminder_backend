import { IServiceCreateDto, IServiceEntity, IUserEntity } from "service_reminder_common";

export interface IServiceCreateTransactionInputData {
  dto: IServiceCreateDto;
  currentUser: IUserEntity;
}

export interface IServiceCreateTransactionOutputData extends IServiceEntity {}
