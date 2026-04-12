import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { EntityList, IUserEntity, UserRole } from 'service_reminder_common';

@Entity({ name: EntityList.USER, schema: dbSchemaName })
export class UserEntity extends BaseEntity implements IUserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 256 })
  name: string;

  @Column({ type: 'varchar', length: 32 })
  contactNo: string;

  @Column({ type: 'varchar', unique: true, length: 128 })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
