import { Injectable } from '@nestjs/common';
import { IVendorRecurringItemMapping } from 'src/common/interfaces/entities/vendor-recurring-item-mapping.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { VendorRecurringItemMappingEntity } from '../entities/vendor-recurring-item-mapping.entity';

@Injectable()
export class VendorRecurringItemMappingRepository extends EntityManagerBaseService<EntityList.VENDOR_RECURRING_ITEM_MAPPING> {
  getEntityClass(): new () => IVendorRecurringItemMapping {
    return VendorRecurringItemMappingEntity;
  }
}