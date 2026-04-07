import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';
import { Nullable } from 'src/common/types/types.generic';

export interface INotificationPayload {
  subject: string;
  body: string;
  recipientEmail: string;
  recipientName: string;
}

export interface INotificationEntity extends IAuditColumnEntity {
  id: number;
  userId: number;
  recurringItemId: number;
  appointmentId: Nullable<number>;
  type: NotificationType;
  status: NotificationStatus;
  scheduledFor: number;
  sentAt: Nullable<number>;
  retryCount: number;
  lastError: Nullable<string>;
  payload: INotificationPayload;
}
