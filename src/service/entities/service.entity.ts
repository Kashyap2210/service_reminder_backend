import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { AppointmentType, EntityList, IServiceEntity, Nullable, ServiceStatus } from 'service_reminder_common';

@Entity({ name: EntityList.SERVICE, schema: dbSchemaName })
export class ServiceEntity extends BaseEntity implements IServiceEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bigint' })
  serviceDate: number;

  @Column({ type: 'int' })
  recurringItemId: number;

  @Column({ type: 'int', nullable: true })
  appointmentId: Nullable<number>;

  @Column({ type: 'int' })
  userId: number;

  @Column({
    type: 'enum',
    enum: AppointmentType,
  })
  serviceType: AppointmentType;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.SERVICE_STARTED,
  })
  serviceStatus: ServiceStatus;

  @Column({ type: 'int' })
  vendorId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  serviceEstimate: Nullable<number>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  serviceAmount: Nullable<number>;

  @Column({ type: 'varchar', nullable: true })
  invoiceDocument: Nullable<string>;
}
