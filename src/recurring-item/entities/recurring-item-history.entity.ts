import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { EntityHistoryOperation, EntityList, IRecurringItemHistoryEntity } from 'service_reminder_common';

@Entity({ name: EntityList.RECURRING_ITEM_HISTORY, schema: dbSchemaName })
export class RecurringItemHistoryEntity
  extends BaseEntity
  implements IRecurringItemHistoryEntity
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
