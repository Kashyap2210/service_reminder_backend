import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';

export interface IVendorRecurringItemMapping extends IAuditColumnEntity {
  id: number;
  vendorId: number;
  recurringItemId: number;
}
