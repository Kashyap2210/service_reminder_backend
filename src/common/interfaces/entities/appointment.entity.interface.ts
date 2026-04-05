import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface IAppointmentEntity extends IAuditColumnEntity {
  id: number;
  appointmentDate: number;
  recurringItemId: number;
  userId: number;
  appointmentType: AppointmentType;
  vendorId: Nullable<number>;
  appointmentStatus: AppointmentStatus;
  checkPoints: Nullable<string>;
}
