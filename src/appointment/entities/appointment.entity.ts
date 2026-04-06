import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
import { AppointmentType } from '../../common/enums/appointment-type.enum';
import { IAppointmentEntity } from '../../common/interfaces/entities/appointment.entity.interface';
import { Nullable } from '../../common/types/types.generic';
import { EntityList } from '../../common/utils/entity.utils';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';

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

  @Column({ type: 'int', nullable: true })
  vendorId: Nullable<number>;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  appointmentStatus: AppointmentStatus;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  checkPoints: Nullable<string>;
}
