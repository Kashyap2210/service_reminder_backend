import { AppointmentAction } from 'src/common/enums/appointment-action.enum';
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
> {
  action?: AppointmentAction;
}

export interface IAppointmentSearchDto extends IEntityFilterData<
  EntityType<EntityList.APPOINTMENT>
> {}
