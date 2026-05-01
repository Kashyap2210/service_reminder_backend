import { EntityList, IVendorEntity, Nullable } from 'service_reminder_common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: EntityList.VENDOR, schema: dbSchemaName })
export class VendorEntity extends BaseEntity implements IVendorEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'varchar', length: 15 })
  contactNo: string;
  @Column({ type: 'varchar', nullable: true })
  email: Nullable<string>;
  // @Column({ type: 'int' })
  // recurringItemId: number;
  @Column({ type: 'int' })
  userId: number;
}
