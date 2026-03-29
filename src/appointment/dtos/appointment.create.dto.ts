import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { AppointmentStatus } from "src/common/enums/appointment-status.enum";
import { AppointmentType } from "src/common/enums/appointment-type.enum";
import { IAppointmentCreateDto } from "src/common/interfaces/dtos/appointment.dto.interface";
import { IUserEntity } from "src/common/interfaces/entities/user.entity.interface";
import { IDtoValidationError } from "src/common/types/dto-validation-error.interface";
import { Nullable } from "src/common/types/types.generic";
import { EntityList, EntityType } from "src/common/utils/entity.utils";
import { RegistryService } from "src/shared/services/registry.service";

export class AppointmentCreateDto implements IAppointmentCreateDto   {
  @ApiProperty({
    type: Number,
    example: 1700000000000,
    description: 'Appointment date as epoch timestamp (bigint)',
  })
  @IsNumber()
  appointmentDate: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'ID of the recurring item linked to this appointment',
  })
  @IsNumber()
  recurringItemId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'ID of the user who owns this appointment',
  })
  @IsNumber()
  userid: number;

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
  @IsNumber()
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

    const appointmentDateValidationResult =
      await this.validateAppointmentDate(currentUser, existingEntity);
    if (appointmentDateValidationResult)
      errors.push(...appointmentDateValidationResult);

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

  toCreateDto(): IAppointmentCreateDto {
    return {
      appointmentDate: this.appointmentDate,
      recurringItemId: this.recurringItemId,
      userid: this.userid,
      appointmentType: this.appointmentType,
      vendorId: this.vendorId,
      appointmentStatus: this.appointmentStatus,
      checkPoints: this.checkPoints,
    };
  }
}