import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { dbSchemaName } from '../shared/constants';
import { EntityList } from '../common/utils/entity.utils';
import { IVendorEntity } from '../common/interfaces/entities/vendor.entity.interface';
import { Nullable } from '../common/types/types.generic';

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

  @Column({ type: 'int' })
  recurringItemId: number;

  @Column({ type: 'int' })
  userId: number;
}