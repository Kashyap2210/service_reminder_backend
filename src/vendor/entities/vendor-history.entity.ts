import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHistoryOperation } from '../../common/enums/entity-history-operation.enum';
import { IVendorHistoryEntity } from '../../common/interfaces/entities/vendor-history.entity.interface';
import { EntityList } from '../../common/utils/entity.utils';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: EntityList.VENDOR_HISTORY, schema: dbSchemaName })
export class VendorHistoryEntity
  extends BaseEntity
  implements IVendorHistoryEntity
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
