// interfaces/appointment-create-transaction.interface.ts

import { IAppointmentCreateDto, IAppointmentEntity, IUserEntity } from "service_reminder_common";

export interface IAppointmentCreateTransactionInputData {
  dto: IAppointmentCreateDto;
  currentUser: IUserEntity;
}

export interface IAppointmentCreateTransactionOutputData extends IAppointmentEntity {}
