import { ServiceStatus } from 'src/common/enums/service-status.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface IServiceEntity extends IAuditColumnEntity {
  id: number;
  serviceDate: number;
  recurringItemid: number;
  appointmentId: Nullable<string>;
  userid: number;
  serviceType: Nullable<string>;
  serviceStatus: ServiceStatus;
  vendorId: Nullable<string>;
  serviceEstimate: Nullable<number>;
  serviceAmount: Nullable<number>;
  invoiceDocument: Nullable<string>;
}
