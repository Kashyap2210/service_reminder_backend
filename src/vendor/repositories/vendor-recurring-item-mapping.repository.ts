import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { VendorRecurringItemMappingEntity } from '../entities/vendor-recurring-item-mapping.entity';
import { EntityList, IVendorRecurringItemMapping } from 'service_reminder_common';

@Injectable()
export class VendorRecurringItemMappingRepository extends EntityManagerBaseService<EntityList.VENDOR_RECURRING_ITEM_MAPPING> {
  getEntityClass(): new () => IVendorRecurringItemMapping {
    return VendorRecurringItemMappingEntity;
  }
}