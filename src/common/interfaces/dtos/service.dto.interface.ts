import { ServiceAction } from 'src/common/enums/service-action.enum';
import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export type IServiceCreateDtoExclude = "serviceStatus"
export interface IServiceCreateDto extends Omit<IEntityCreateDto<
  EntityType<EntityList.SERVICE>
>, IServiceCreateDtoExclude> {}

export interface IServiceUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.SERVICE>
> {
  action?: ServiceAction;
}

export interface IServiceSearchDto extends IEntityFilterData<
  EntityType<EntityList.SERVICE>
> {}
