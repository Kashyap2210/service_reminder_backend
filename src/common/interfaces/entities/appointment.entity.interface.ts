import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface IAppointmentEntity extends IAuditColumnEntity {
  id: number;
  appointmentDate: number;
  recurringItemid: number;
  userid: number;
  appointmentType: Nullable<string>;
  vendorId: Nullable<string>;
  appointmentStatus: AppointmentStatus;
  checkPoints: Record<string, boolean>[] | null;
}
