import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { ServiceStatus } from 'src/common/enums/service-status.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface IServiceEntity extends IAuditColumnEntity {
  id: number;
  serviceDate: number;
  recurringItemId: number;
  appointmentId: Nullable<number>;
  userId: number;
  serviceType: AppointmentType;
  serviceStatus: ServiceStatus;
  vendorId: number;
  serviceEstimate: Nullable<number>;
  serviceAmount: Nullable<number>;
  invoiceDocument: Nullable<string>;
}
