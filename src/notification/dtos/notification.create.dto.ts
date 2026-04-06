import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { EntityFilterDataHelper } from 'src/common/helpers/entity-filter-data.helper';
import {
  INotificationCreateDto,
  INotificationSearchDto,
} from 'src/common/interfaces/dtos/notification.dto.interface';
import {
  INotificationPayload,
} from 'src/common/interfaces/entities/notification.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { IEntityFilterIncludeData } from 'src/common/types/generic.dto.types';
import { Nullable } from 'src/common/types/types.generic';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';

export class NotificationPayloadDto implements INotificationPayload {
  @ApiProperty({ example: 'Service reminder' })
  @IsString()
  @MaxLength(512)
  subject: string;

  @ApiProperty({ example: 'Your vehicle service is due soon.' })
  @IsString()
  @MaxLength(8192)
  body: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(256)
  recipientEmail: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MaxLength(256)
  recipientName: string;
}

export class NotificationCreateDto implements INotificationCreateDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  userid: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  recurringItemid: number;

  @ApiPropertyOptional({ type: Number, example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  appointmentId: Nullable<number>;

  @ApiProperty({ enum: NotificationType, example: NotificationType.EMAIL_SERVICE_REMINDER })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ enum: NotificationStatus, example: NotificationStatus.PENDING })
  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @ApiProperty({ type: Number, example: 1700000000000 })
  @IsNumber()
  scheduledFor: number;

  @ApiPropertyOptional({ type: Number, example: 1700000001000, nullable: true })
  @IsOptional()
  @IsNumber()
  sentAt: Nullable<number>;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumber()
  retryCount: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  lastError: Nullable<string>;

  @ApiProperty({ type: NotificationPayloadDto })
  @ValidateNested()
  @Type(() => NotificationPayloadDto)
  payload: INotificationPayload;

  registryService: RegistryService;

  validationData: EntityFilterDataHelper;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.NOTIFICATION>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;
    this.validationData = await this.fetchDataForCombineValidation(currentUser);

    const userValidationResult = await this.validateUserId();
    if (userValidationResult) errors.push(...userValidationResult);

    const recurringValidationResult = await this.validateRecurringItemId();
    if (recurringValidationResult)
      errors.push(...recurringValidationResult);

    const appointmentValidationResult = await this.validateAppointmentId();
    if (appointmentValidationResult)
      errors.push(...appointmentValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateUserId() {
    const errors: IDtoValidationError[] = [];

    const users = this.validationData.getEntityFromList(EntityList.USER);

    if (users.length === 0) {
      errors.push({
        key: 'userid',
        message: `User with id: ${this.userid} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateRecurringItemId() {
    const errors: IDtoValidationError[] = [];

    const items = this.validationData.getEntityFromList(EntityList.RECURRING_ITEM);

    if (items.length === 0) {
      errors.push({
        key: 'recurringItemid',
        message: `Recurring item with id: ${this.recurringItemid} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateAppointmentId() {
    if (this.appointmentId == null) {
      return null;
    }

    const errors: IDtoValidationError[] = [];

    const appointments = this.validationData.getEntityFromList(EntityList.APPOINTMENT);

    if (appointments.length === 0) {
      errors.push({
        key: 'appointmentId',
        message: `Appointment with id: ${this.appointmentId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async fetchDataForCombineValidation(
    currentUser: IUserEntity,
  ): Promise<EntityFilterDataHelper> {
    const userEntityIncludeData: IEntityFilterIncludeData<EntityList.USER> = {
      name: EntityList.USER,
      include: {
        id: [this.userid],
      },
    };

    const recurringItemEntityIncludeData: IEntityFilterIncludeData<EntityList.RECURRING_ITEM> =
      {
        name: EntityList.RECURRING_ITEM,
        include: { id: [this.recurringItemid], userId: [this.userid] },
      };

    const filter: INotificationSearchDto = {
      entities: [userEntityIncludeData, recurringItemEntityIncludeData],
    };

    if (this.appointmentId != null) {
      const appointmentEntityIncludeData: IEntityFilterIncludeData<EntityList.APPOINTMENT> =
        {
          name: EntityList.APPOINTMENT,
          include: {
            id: [this.appointmentId],
            userId: [this.userid],
            recurringItemId: [this.recurringItemid],
          },
        };

      filter.entities = [
        ...(filter.entities ?? []),
        appointmentEntityIncludeData,
      ];
    }

    return new EntityFilterDataHelper(
      await this.registryService
        .get(EntityList.NOTIFICATION)
        .searchV2(filter, currentUser),
    );
  }

  toCreateDto(): INotificationCreateDto {
    return {
      userid: this.userid,
      recurringItemid: this.recurringItemid,
      appointmentId: this.appointmentId,
      type: this.type,
      status: this.status,
      scheduledFor: this.scheduledFor,
      sentAt: this.sentAt,
      retryCount: this.retryCount,
      lastError: this.lastError,
      payload: this.payload,
    };
  }
}
