import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { CronJobStatus, EntityList, ICronJobEntity, Nullable } from 'service_reminder_common';

@Entity({ name: EntityList.CRONJOB, schema: dbSchemaName })
export class CronJobEntity extends BaseEntity implements ICronJobEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  cronExpression: string;

  @Column({ type: 'bigint' })
  scheduledAt: number;

  @Column({ type: 'bigint', nullable: true })
  startedAt: Nullable<number>;

  @Column({ type: 'bigint', nullable: true })
  completedAt: Nullable<number>;

  @Column({
    type: 'enum',
    enum: CronJobStatus,
    default: CronJobStatus.SCHEDULED,
  })
  status: CronJobStatus;

  @Column({ type: 'jsonb', nullable: true })
  error: Nullable<Record<string, any>>;
}
