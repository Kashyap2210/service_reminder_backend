// src/appointments/entities/appointment-history.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHistoryOperation } from '../common/enums/entity-history-operation.enum';
import { IBaseHistoryEntity } from '../common/interfaces/entities/base-history.entity.interface';
import { EntityList } from '../common/utils/entity.utils';
import { dbSchemaName } from '../shared/constants';
import { BaseEntity } from '../shared/entities/base.entity';

@Entity({ name: EntityList.APPOINTMENT_HISTORY, schema: dbSchemaName })
export class AppointmentHistoryEntity
  extends BaseEntity
  implements IBaseHistoryEntity
{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  entityId: number;

  @Column({ type: 'text' })
  data: string;

  @Column({
    type: 'enum',
    enum: EntityHistoryOperation,
    enumName: 'history_operation_enum',
  })
  operation: EntityHistoryOperation;
}
