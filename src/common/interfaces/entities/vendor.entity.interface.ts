import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface IVendorEntity extends IAuditColumnEntity {
  id: string;
  name: string;
  contactNo: string;
  email: Nullable<string>;
  specialization: Nullable<string>;
  userId: string;
}
