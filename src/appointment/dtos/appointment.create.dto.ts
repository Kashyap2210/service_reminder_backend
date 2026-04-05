import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { IAppointmentCreateDto } from 'src/common/interfaces/dtos/appointment.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { Nullable } from 'src/common/types/types.generic';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { IsValidDateCode } from 'src/shared/validators/dateCode.validator';

export class AppointmentCreateDto implements IAppointmentCreateDto {
  @ApiProperty({
    type: Number,
    example: 1700000000000,
    description: 'Appointment date as epoch timestamp (bigint)',
  })
  @IsPositive()
  @IsValidDateCode()
  appointmentDate: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'ID of the recurring item linked to this appointment',
  })
  @IsPositive()
  recurringItemId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'ID of the user who owns this appointment',
  })
  @IsPositive()
  userId: number;

  @ApiProperty({
    example: AppointmentType.SERVICE,
    description: 'Type of the appointment',
    enum: AppointmentType,
    required: true,
  })
  @IsEnum(AppointmentType)
  appointmentType: AppointmentType;

  @ApiProperty({
    type: Number,
    example: 2,
    description: 'ID of the vendor associated with this appointment (optional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsPositive()
  vendorId: Nullable<number>;

  @ApiProperty({
    example: AppointmentStatus.BOOKED,
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    required: true,
  })
  @IsEnum(AppointmentStatus)
  appointmentStatus: AppointmentStatus;

  @ApiProperty({
    type: String,
    example: 'Oil change, Tyre rotation',
    description: 'Comma-separated checkpoints for this appointment (optional)',
    required: false,
    nullable: true,
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  checkPoints: Nullable<string>;

  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.APPOINTMENT>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;

    const appointmentDateValidationResult = await this.validateAppointmentDate(
      currentUser,
      existingEntity,
    );
    if (appointmentDateValidationResult)
      errors.push(...appointmentDateValidationResult);

    const userIdValidationResult = await this.validateUserId(currentUser);
    if (userIdValidationResult) errors.push(...userIdValidationResult);

    const vendorIdValidationResult = await this.validateVendorId(currentUser);
    if (vendorIdValidationResult) errors.push(...vendorIdValidationResult);

    const recurringItemIdValidationResult =
      await this.validateRecurringItemId(currentUser);
    if (recurringItemIdValidationResult)
      errors.push(...recurringItemIdValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateAppointmentDate(
    currentUser: IUserEntity,
    existingEntity?: EntityType<EntityList.APPOINTMENT>,
  ) {
    const errors: IDtoValidationError[] = [];

    const existingAppointment = await this.registryService
      .get(EntityList.APPOINTMENT)
      .search(
        {
          recurringItemId: [this.recurringItemId],
          appointmentDate: [this.appointmentDate],
        },
        currentUser,
      );

    if (existingAppointment && existingAppointment.length > 0) {
      // Only error if the found appointment is a DIFFERENT entity
      if (!existingEntity || existingEntity.id !== existingAppointment[0].id) {
        errors.push({
          key: 'appointmentDate',
          message: `An appointment for recurring item ID: ${this.recurringItemId} on date: ${this.appointmentDate} already exists. Please verify the details & try again`,
        });
      }
    }

    return errors.length > 0 ? errors : null;
  }

  async validateUserId(currentUser: IUserEntity) {
    const errors: IDtoValidationError[] = [];

    const existingUserId = await this.registryService
      .get(EntityList.USER)
      .search(
        {
          id: [this.userId],
        },
        currentUser,
      );
    if (existingUserId.length === 0) {
      errors.push({
        key: 'userId',
        message: `User with id: ${this.userId} does not exist. Please try with a valid user id`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateVendorId(currentUser: IUserEntity) {
    const errors: IDtoValidationError[] = [];

    if (this.vendorId) {
      const existingVendorId = await this.registryService
        .get(EntityList.VENDOR)
        .search(
          {
            id: [this.vendorId],
            userId: [this.userId],
          },
          currentUser,
        );
      if (existingVendorId.length === 0) {
        errors.push({
          key: 'vendorId',
          message: `Vendor with id: ${this.vendorId} does not exist for current user. Please try with a valid vendor id.`,
        });
      }
    }

    return errors.length > 0 ? errors : null;
  }

  async validateRecurringItemId(currentUser: IUserEntity) {
    const errors: IDtoValidationError[] = [];

    const existingRecurringItemId = await this.registryService
      .get(EntityList.RECURRING_ITEM)
      .search(
        {
          id: [this.recurringItemId],
          userId: [this.userId],
        },
        currentUser,
      );
    if (existingRecurringItemId.length === 0) {
      errors.push({
        key: 'recurringItemId',
        message: `Recurring Item with id: ${this.recurringItemId} does not exists for current user. Please try with a valid recurring item id`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  toCreateDto(): IAppointmentCreateDto {
    return {
      appointmentDate: this.appointmentDate,
      recurringItemId: this.recurringItemId,
      userId: this.userId,
      appointmentType: this.appointmentType,
      vendorId: this.vendorId,
      appointmentStatus: this.appointmentStatus,
      checkPoints: this.checkPoints,
    };
  }
}
