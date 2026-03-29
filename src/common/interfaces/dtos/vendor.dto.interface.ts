import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface IVendorCreateDto extends IEntityCreateDto<
  EntityType<EntityList.VENDOR>
> {}

export interface IVendorUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.VENDOR>
> {}

export interface IVendorSearchDto extends IEntityFilterData<
  EntityType<EntityList.VENDOR>
> {}
