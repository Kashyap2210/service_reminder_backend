import { ICronJobCreateDto, ICronJobEntity, IUserEntity } from "service_reminder_common";

export interface ICronJobCreateTransactionInputData {
  dto: ICronJobCreateDto;
  currentUser: IUserEntity;
}

export interface ICronJobCreateTransactionOutputData extends ICronJobEntity {}
