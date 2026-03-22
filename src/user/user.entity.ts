import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../common/enums/user.role.enum';
import { IUserEntity } from '../common/interfaces/entities/user.entity.interface';
import { EntityList } from '../common/utils/entity.utils';
import { dbSchemaName } from '../shared/constants';
import { BaseEntity } from '../shared/entities/base.entity';

@Entity({ name: EntityList.USER, schema: dbSchemaName })
export class UserEntity extends BaseEntity implements IUserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 15 })
  contactNo: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
