import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IVendorRecurringItemMapping } from '../../common/interfaces/entities/vendor-recurring-item-mapping.entity.interface';
import { EntityList } from '../../common/utils/entity.utils';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({
  name: EntityList.VENDOR_RECURRING_ITEM_MAPPING,
  schema: dbSchemaName,
})
export class VendorRecurringItemMappingEntity
  extends BaseEntity
  implements IVendorRecurringItemMapping
{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  vendorId: number;

  @Column({ type: 'int' })
  recurringItemId: number;
}
