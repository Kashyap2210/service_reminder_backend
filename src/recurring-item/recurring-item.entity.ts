import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { dbSchemaName } from '../shared/constants';
import { EntityList } from '../common/utils/entity.utils';
import { IRecurringItemEntity } from '../common/interfaces/entities/recurring-item.entity.interface';
import { ServicePeriodUnit } from '../common/enums/service-period-unit.enum';
import { Nullable } from '../common/types/types.generic';

@Entity({ name: EntityList.RECURRING_ITEM, schema: dbSchemaName })
export class RecurringItemEntity extends BaseEntity implements IRecurringItemEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  companyName: Nullable<string>;

  @Column({ type: 'int', nullable: true })
  vendorId: Nullable<number>;

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