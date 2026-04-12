import { IAppointmentEntity, IAppointmentUpdateDto, IUserEntity } from "service_reminder_common";

export interface IAppointmentUpdateTransactionInputData {
  id: number;
  dto: IAppointmentUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IAppointmentEntity;
}

export interface IAppointmentUpdateTransactionOutputData extends IAppointmentEntity {}
