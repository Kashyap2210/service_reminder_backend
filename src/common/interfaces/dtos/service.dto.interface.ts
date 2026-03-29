import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface IServiceCreateDto extends IEntityCreateDto<
  EntityType<EntityList.SERVICE>
> {}

export interface IServiceUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.SERVICE>
> {}

export interface IServiceSearchDto extends IEntityFilterData<
  EntityType<EntityList.SERVICE>
> {}
