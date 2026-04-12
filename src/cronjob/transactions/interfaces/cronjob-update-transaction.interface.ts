import { ICronJobEntity, ICronJobUpdateDto, IUserEntity } from "service_reminder_common";

export interface ICronJobUpdateTransactionInputData {
  id: number;
  dto: ICronJobUpdateDto;
  currentUser: IUserEntity;
  existingEntity: ICronJobEntity;
}

export interface ICronJobUpdateTransactionOutputData extends ICronJobEntity {}
