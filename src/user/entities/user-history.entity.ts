import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { EntityHistoryOperation, EntityList, IBaseHistoryEntity } from 'service_reminder_common';

@Entity({ name: EntityList.USER_HISTORY, schema: dbSchemaName })
export class UserHistoryEntity
  extends BaseEntity
  implements IBaseHistoryEntity
{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  entityId: number;

  @Column({ type: 'varchar', length: 1024 })
  data: string;

  @Column({
    type: 'enum',
    enum: EntityHistoryOperation,
    enumName: 'history_operation_enum',
  })
  operation: EntityHistoryOperation;
}
