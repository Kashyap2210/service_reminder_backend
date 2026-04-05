import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { IAppointmentSearchDto } from 'src/common/interfaces/dtos/appointment.dto.interface';
import { IAppointmentEntity } from 'src/common/interfaces/entities/appointment.entity.interface';
import { IBaseHistoryEntity } from 'src/common/interfaces/entities/base-history.entity.interface';
import { ICronJobEntity } from 'src/common/interfaces/entities/cronjob.entity.interface';
import { INotificationEntity } from 'src/common/interfaces/entities/notification.entity.interface';
import { IRecurringItemEntity } from 'src/common/interfaces/entities/recurring-item.entity.interface';
import { IServiceEntity } from 'src/common/interfaces/entities/service.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IVendorRecurringItemMapping } from 'src/common/interfaces/entities/vendor-recurring-item-mapping.entity.interface';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { IEntityFilterData } from 'src/common/types/generic.dto.types';
import { EntityList } from 'src/common/utils/entity.utils';

export class AppointmentSearchDto implements IAppointmentSearchDto {
  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'ID of the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1700000000000],
    description: 'Appointment date(s) as epoch timestamp (bigint)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  appointmentDate?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'ID(s) of the recurring item linked to the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  recurringItemId?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'ID(s) of the user who owns the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  userId?: number[];

  @ApiPropertyOptional({
    enum: AppointmentType,
    isArray: true,
    example: [AppointmentType.SERVICE],
    description: 'Type(s) of the appointment',
  })
  @IsOptional()
  @IsEnum(AppointmentType, { each: true })
  appointmentType?: AppointmentType[];

  @ApiPropertyOptional({
    type: [Number],
    example: [2],
    description: 'ID(s) of the vendor associated with the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  vendorId?: number[];

  @ApiPropertyOptional({
    enum: AppointmentStatus,
    isArray: true,
    example: [AppointmentStatus.BOOKED],
    description: 'Status(es) of the appointment',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, { each: true })
  appointmentStatus?: AppointmentStatus[];

  @ApiPropertyOptional({
    type: [Number],
    example: [
      {
        name: EntityList.VENDOR,
        id: [10],
      },
    ],
  })
  @IsOptional()
  entities?:
    | (
        | { name: EntityList.USER; filter: IEntityFilterData<IUserEntity> }
        | {
            name: EntityList.USER_HISTORY;
            filter: IEntityFilterData<IBaseHistoryEntity>;
          }
        | {
            name: EntityList.RECURRING_ITEM;
            filter: IEntityFilterData<IRecurringItemEntity>;
          }
        | {
            name: EntityList.RECURRING_ITEM_HISTORY;
            filter: IEntityFilterData<IBaseHistoryEntity>;
          }
        | { name: EntityList.VENDOR; filter: IEntityFilterData<IVendorEntity> }
        | {
            name: EntityList.VENDOR_HISTORY;
            filter: IEntityFilterData<IBaseHistoryEntity>;
          }
        | {
            name: EntityList.APPOINTMENT;
            filter: IEntityFilterData<IAppointmentEntity>;
          }
        | {
            name: EntityList.APPOINTMENT_HISTORY;
            filter: IEntityFilterData<IBaseHistoryEntity>;
          }
        | {
            name: EntityList.SERVICE;
            filter: IEntityFilterData<IServiceEntity>;
          }
        | {
            name: EntityList.SERVICE_HISTORY;
            filter: IEntityFilterData<IBaseHistoryEntity>;
          }
        | {
            name: EntityList.NOTIFICATION;
            filter: IEntityFilterData<INotificationEntity>;
          }
        | {
            name: EntityList.CRONJOB;
            filter: IEntityFilterData<ICronJobEntity>;
          }
        | {
            name: EntityList.VENDOR_RECURRING_ITEM_MAPPING;
            filter: IEntityFilterData<IVendorRecurringItemMapping>;
          }
      )[]
    | undefined;
}
