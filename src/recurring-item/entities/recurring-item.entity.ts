import {
  EntityList,
  IRecurringItemEntity,
  Nullable,
  ServicePeriodUnit,
} from 'service_reminder_common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: EntityList.RECURRING_ITEM, schema: dbSchemaName })
export class RecurringItemEntity
  extends BaseEntity
  implements IRecurringItemEntity
{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'varchar', length: 100 })
  type: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  companyName: Nullable<string>;
  // @Column({ type: 'int', nullable: true })
  // vendorId: Nullable<number>;
  @Column({ type: 'int' })
  servicePeriod: number;
  @Column({
    type: 'enum',
    enum: ServicePeriodUnit,
  })
  servicePeriodUnit: ServicePeriodUnit;
  @Column({ type: 'varchar', length: 255, nullable: true })
  servicePlaceAddress: Nullable<string>;
  @Column({ type: 'int' })
  userId: number;
}
