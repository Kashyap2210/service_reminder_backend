import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { AppointmentStatus, AppointmentType, EntityList, IAppointmentEntity, Nullable } from 'service_reminder_common';

@Entity({ name: EntityList.APPOINTMENT, schema: dbSchemaName })
export class AppointmentEntity
  extends BaseEntity
  implements IAppointmentEntity
{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bigint' })
  appointmentDate: number;

  @Column({ type: 'int' })
  recurringItemId: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({
    type: 'enum',
    enum: AppointmentType,
  })
  appointmentType: AppointmentType;

  @Column({ type: 'int', nullable: false })
  vendorId: number;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  appointmentStatus: AppointmentStatus;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  checkPoints: Nullable<string>;
}
