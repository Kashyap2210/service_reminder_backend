import { IUserEntity } from 'service_reminder_common';

export interface IUserDeleteTransactionInputData {
  id: number;
  currentUser: IUserEntity;
}

export type IUserDeleteTransactionOutputData = boolean;
