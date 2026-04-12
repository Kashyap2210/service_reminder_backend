import { IServiceEntity, IServiceUpdateDto, IUserEntity } from "service_reminder_common";

export interface IServiceUpdateTransactionInputData {
  id: number;
  dto: IServiceUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IServiceEntity;
}

export interface IServiceUpdateTransactionOutputData extends IServiceEntity {}
