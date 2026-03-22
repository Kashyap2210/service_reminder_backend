import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { IAuditColumnEntity } from 'src/common/helpers/audit-column.entity.interface';

export interface IBaseHistoryEntity extends IAuditColumnEntity {
  id: number;
  entityId: number;
  data: string;
  operation: EntityHistoryOperation;
}
