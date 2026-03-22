import { CronJobStatus } from 'src/common/enums/cronjob-status.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface ICronJobEntity extends IAuditColumnEntity {
  id: number;
  name: string;
  cronExpression: string;
  scheduledAt: number;
  startedAt: Nullable<number>;
  completedAt: Nullable<number>;
  status: CronJobStatus;
  error: Record<string, any> | null;
}
