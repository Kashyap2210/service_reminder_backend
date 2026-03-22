import { ServicePeriodUnit } from 'src/common/enums/service-period-unit.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface IRecurringItemEntity extends IAuditColumnEntity {
  id: number;
  name: string;
  type: string;
  companyName: Nullable<string>;
  vendorId: Nullable<string>;
  servicePeriod: number;
  servicePeriodUnit: ServicePeriodUnit;
  servicePlaceAddress: Nullable<string>;
  userid: number;
}
