import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface IRecurringItemCreateDto extends IEntityCreateDto<
  EntityType<EntityList.RECURRING_ITEM>
> {}

export interface IRecurringItemUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.RECURRING_ITEM>
> {}

export interface IRecurringItemSearchDto extends IEntityFilterData<
  EntityType<EntityList.RECURRING_ITEM>
> {}
