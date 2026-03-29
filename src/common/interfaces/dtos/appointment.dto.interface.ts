import {
  IEntityCreateDto,
  IEntityFilterData,
  IEntityUpdateDto,
} from 'src/common/types/generic.dto.types';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';

export interface IAppointmentCreateDto extends IEntityCreateDto<
  EntityType<EntityList.APPOINTMENT>
> {}

export interface IAppointmentUpdateDto extends IEntityUpdateDto<
  EntityType<EntityList.APPOINTMENT>
> {}

export interface IAppointmentSearchDto extends IEntityFilterData<
  EntityType<EntityList.APPOINTMENT>
> {}
