import {
  EntityList,
  EntityType,
  IAppointmentUpdateDto,
  IUserEntity,
} from 'service_reminder_common';

export interface IAppointmentUpdateTransactionInputData {
  id: number;
  dto: IAppointmentUpdateDto;
  currentUser: IUserEntity;
  existingEntity: EntityType<EntityList.APPOINTMENT>;
}

export interface IAppointmentUpdateTransactionOutputData extends EntityType<EntityList.APPOINTMENT> {}

export interface IAppointmentBulkUpdateTransactionInputData {
  existingEntities: EntityType<EntityList.APPOINTMENT>[];
  currentUser: IUserEntity;
}

export type IAppointmentBulkUpdateTransactionOutputData =
  EntityType<EntityList.APPOINTMENT>[];
