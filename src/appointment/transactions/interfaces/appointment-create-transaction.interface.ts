// interfaces/appointment-create-transaction.interface.ts
import { IAppointmentCreateDto } from 'src/common/interfaces/dtos/appointment.dto.interface';
import { IAppointmentEntity } from 'src/common/interfaces/entities/appointment.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IAppointmentCreateTransactionInputData {
  dto: IAppointmentCreateDto;
  currentUser: IUserEntity;
}

export interface IAppointmentCreateTransactionOutputData extends IAppointmentEntity {}
