import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentType } from '../../common/enums/appointment-type.enum';
import { ServiceStatus } from '../../common/enums/service-status.enum';
import { IServiceEntity } from '../../common/interfaces/entities/service.entity.interface';
import { Nullable } from '../../common/types/types.generic';
import { EntityList } from '../../common/utils/entity.utils';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';

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
    default: ServiceStatus.SERVICE_COMMENCED,
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
