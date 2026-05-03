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
import {
  EntityFilterDataHelper,
  EntityList,
  EntityType,
  IDtoValidationError,
  IEntityFilterSearchData,
  INotificationCreateDto,
  INotificationPayload,
  INotificationSearchDto,
  IUserEntity,
  NotificationStatus,
  NotificationType,
  Nullable,
} from 'service_reminder_common';
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
  userId: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  recurringItemId: number;

  @ApiPropertyOptional({ type: Number, example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  appointmentId: Nullable<number>;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.EMAIL_SERVICE_REMINDER,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    enum: NotificationStatus,
    example: NotificationStatus.PENDING,
  })
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
    if (recurringValidationResult) errors.push(...recurringValidationResult);

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
        message: `User with id: ${this.userId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateRecurringItemId() {
    const errors: IDtoValidationError[] = [];

    const items = this.validationData.getEntityFromList(
      EntityList.RECURRING_ITEM,
    );

    if (items.length === 0) {
      errors.push({
        key: 'recurringItemId',
        message: `Recurring item does not exist or does not belong to the user.`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateAppointmentId() {
    if (this.appointmentId == null) {
      return null;
    }

    const errors: IDtoValidationError[] = [];

    const appointments = this.validationData.getEntityFromList(
      EntityList.APPOINTMENT,
    );

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
    const userEntityIncludeData: IEntityFilterSearchData<EntityList.USER> = {
      name: EntityList.USER,
      include: {
        id: [this.userId],
      },
    };

    const recurringItemEntityIncludeData: IEntityFilterSearchData<EntityList.RECURRING_ITEM> =
      {
        name: EntityList.RECURRING_ITEM,
        include: { id: [this.recurringItemId], userId: [this.userId] },
      };

    const filter: INotificationSearchDto = {
      entities: [userEntityIncludeData, recurringItemEntityIncludeData],
    };

    if (this.appointmentId != null) {
      const appointmentEntityIncludeData: IEntityFilterSearchData<EntityList.APPOINTMENT> =
        {
          name: EntityList.APPOINTMENT,
          include: {
            id: [this.appointmentId],
            userId: [this.userId],
            recurringItemId: [this.recurringItemId],
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
      userId: this.userId,
      recurringItemId: this.recurringItemId,
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
