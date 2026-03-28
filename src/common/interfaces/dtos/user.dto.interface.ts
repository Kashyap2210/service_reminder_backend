import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface IUserCreateDto extends IEntityCreateDto<
  EntityType<EntityList.USER>
> {}

export interface IUserUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.USER>
> {}

export interface IUserSearchDto extends IEntityFilterData<
  EntityType<EntityList.USER>
> {}
