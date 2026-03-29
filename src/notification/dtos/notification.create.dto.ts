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
import { INotificationCreateDto } from 'src/common/interfaces/dtos/notification.dto.interface';
import {
  INotificationPayload,
} from 'src/common/interfaces/entities/notification.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
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

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.NOTIFICATION>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;

    const userValidationResult = await this.validateUserId(currentUser);
    if (userValidationResult) errors.push(...userValidationResult);

    const recurringValidationResult =
      await this.validateRecurringItemId(currentUser);
    if (recurringValidationResult)
      errors.push(...recurringValidationResult);

    const appointmentValidationResult =
      await this.validateAppointmentIfPresent(currentUser);
    if (appointmentValidationResult)
      errors.push(...appointmentValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateUserId(currentUser: IUserEntity) {
    const errors: IDtoValidationError[] = [];

    const users = await this.registryService
      .get(EntityList.USER)
      .search({ id: [this.userid] }, currentUser);

    if (!users || users.length === 0) {
      errors.push({
        key: 'userid',
        message: `User with id: ${this.userid} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateRecurringItemId(currentUser: IUserEntity) {
    const errors: IDtoValidationError[] = [];

    const items = await this.registryService
      .get(EntityList.RECURRING_ITEM)
      .search({ id: [this.recurringItemid] }, currentUser);

    if (!items || items.length === 0) {
      errors.push({
        key: 'recurringItemid',
        message: `Recurring item with id: ${this.recurringItemid} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateAppointmentIfPresent(currentUser: IUserEntity) {
    if (this.appointmentId == null) {
      return null;
    }

    const errors: IDtoValidationError[] = [];

    const appointments = await this.registryService
      .get(EntityList.APPOINTMENT)
      .search({ id: [this.appointmentId] }, currentUser);

    if (!appointments || appointments.length === 0) {
      errors.push({
        key: 'appointmentId',
        message: `Appointment with id: ${this.appointmentId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
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
