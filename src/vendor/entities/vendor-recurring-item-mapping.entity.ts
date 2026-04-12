import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { dbSchemaName } from '../../shared/constants';
import { BaseEntity } from '../../shared/entities/base.entity';
import { EntityList, IVendorRecurringItemMapping } from 'service_reminder_common';

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
