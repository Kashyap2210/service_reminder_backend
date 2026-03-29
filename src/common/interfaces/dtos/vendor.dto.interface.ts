import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface IVendorEntityDtoInclude {
  recurringItemIds: number[];
}

export interface IVendorEntityCreateDto extends IEntityCreateDto<
  EntityType<EntityList.VENDOR>
> {}

export interface IVendorCreateDto
  extends IVendorEntityCreateDto, IVendorEntityDtoInclude {}

export interface IVendorEntityUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.VENDOR>
> {}

export interface IVendorUpdateDto
  extends IVendorEntityUpdateDto, IVendorEntityDtoInclude {}

export interface IVendorSearchDto extends IEntityFilterData<
  EntityType<EntityList.VENDOR>
> {}
