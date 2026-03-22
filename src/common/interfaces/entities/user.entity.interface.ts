import { UserRole } from 'src/common/enums/user.role.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';

export interface IUserEntity extends IAuditColumnEntity {
  id: string;
  name: string;
  contactNo: string;
  email: string;
  password: string;
  role: UserRole;
}
