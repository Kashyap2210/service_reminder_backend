import { IAppointmentUpdateDto } from 'src/common/interfaces/dtos/appointment.dto.interface';
import { IAppointmentEntity } from 'src/common/interfaces/entities/appointment.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IAppointmentUpdateTransactionInputData {
  id: number;
  dto: IAppointmentUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IAppointmentEntity;
}

export interface IAppointmentUpdateTransactionOutputData extends IAppointmentEntity {}
