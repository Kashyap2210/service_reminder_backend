import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface ICronJobCreateDto extends IEntityCreateDto<
  EntityType<EntityList.CRONJOB>
> {}

export interface ICronJobUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.CRONJOB>
> {}

export interface ICronJobSearchDto extends IEntityFilterData<
  EntityType<EntityList.CRONJOB>
> {}
