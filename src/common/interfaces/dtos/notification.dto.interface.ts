import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface INotificationCreateDto extends IEntityCreateDto<
  EntityType<EntityList.NOTIFICATION>
> {}

export interface INotificationUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.NOTIFICATION>
> {}

export interface INotificationSearchDto extends IEntityFilterData<
  EntityType<EntityList.NOTIFICATION>
> {}
