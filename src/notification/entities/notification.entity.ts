import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { EntityList, INotificationEntity, INotificationPayload, NotificationStatus, NotificationType, Nullable } from 'service_reminder_common';

@Entity({ name: EntityList.NOTIFICATION, schema: dbSchemaName })
export class NotificationEntity
  extends BaseEntity
  implements INotificationEntity
{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  recurringItemId: number;

  @Column({ type: 'int', nullable: true })
  appointmentId: Nullable<number>;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'bigint' })
  scheduledFor: number;

  @Column({ type: 'bigint', nullable: true })
  sentAt: Nullable<number>;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'varchar', nullable: true })
  lastError: Nullable<string>;

  @Column({ type: 'jsonb' })
  payload: INotificationPayload;
}
