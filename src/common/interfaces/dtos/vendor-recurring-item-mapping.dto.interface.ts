import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface IVendorRecurringItemMappingCreateDto extends IEntityCreateDto<
  EntityType<EntityList.VENDOR_RECURRING_ITEM_MAPPING>
> {}

export interface IVendorRecurringItemMappingUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.VENDOR_RECURRING_ITEM_MAPPING>
> {}

export interface IVendorRecurringItemMappingSearchDto extends IEntityFilterData<
  EntityType<EntityList.VENDOR_RECURRING_ITEM_MAPPING>
> {}
