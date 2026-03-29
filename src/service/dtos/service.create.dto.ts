import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { ServiceStatus } from 'src/common/enums/service-status.enum';
import { IServiceCreateDto } from 'src/common/interfaces/dtos/service.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { Nullable } from 'src/common/types/types.generic';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';

export class ServiceCreateDto implements IServiceCreateDto {
  @ApiProperty({
    type: Number,
    example: 1700000000000,
    description: 'Service date as epoch timestamp (bigint)',
  })
  @IsNumber()
  serviceDate: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Linked recurring item id',
  })
  @IsNumber()
  recurringItemid: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Linked appointment id (optional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  appointmentId: Nullable<number>;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Owning user id',
  })
  @IsNumber()
  userid: number;

  @ApiProperty({
    example: AppointmentType.SERVICE,
    enum: AppointmentType,
    description: 'Type of service',
  })
  @IsEnum(AppointmentType)
  serviceType: AppointmentType;

  @ApiProperty({
    example: ServiceStatus.SERVICE_COMMENCED,
    enum: ServiceStatus,
    description: 'Service status',
  })
  @IsEnum(ServiceStatus)
  serviceStatus: ServiceStatus;

  @ApiProperty({
    type: Number,
    example: 2,
    description: 'Vendor id (optional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  vendorId: Nullable<number>;

  @ApiProperty({
    type: Number,
    example: 199.99,
    description: 'Estimated cost (optional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  serviceEstimate: Nullable<number>;

  @ApiProperty({
    type: Number,
    example: 189.5,
    description: 'Actual amount (optional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  serviceAmount: Nullable<number>;

  @ApiProperty({
    type: String,
    example: 'https://example.com/invoice.pdf',
    description: 'Invoice document reference or URL (optional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  invoiceDocument: Nullable<string>;

  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.SERVICE>,
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

  toCreateDto(): IServiceCreateDto {
    return {
      serviceDate: this.serviceDate,
      recurringItemid: this.recurringItemid,
      appointmentId: this.appointmentId,
      userid: this.userid,
      serviceType: this.serviceType,
      serviceStatus: this.serviceStatus,
      vendorId: this.vendorId,
      serviceEstimate: this.serviceEstimate,
      serviceAmount: this.serviceAmount,
      invoiceDocument: this.invoiceDocument,
    };
  }
}
