import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { dbSchemaName } from '../shared/constants';
import { EntityList } from '../common/utils/entity.utils';
import { INotificationEntity, INotificationPayload } from '../common/interfaces/entities/notification.entity.interface';
import { NotificationStatus } from '../common/enums/notification-status.enum';
import { NotificationType } from '../common/enums/notification-type.enum';
import { Nullable } from '../common/types/types.generic';

@Entity({ name: EntityList.NOTIFICATION, schema: dbSchemaName })
export class NotificationEntity extends BaseEntity implements INotificationEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  userid: number;

  @Column({ type: 'int' })
  recurringItemid: number;

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