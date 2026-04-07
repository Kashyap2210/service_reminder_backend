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
import { EntityFilterDataHelper } from 'src/common/helpers/entity-filter-data.helper';
import {
  IServiceCreateDto,
  IServiceSearchDto,
} from 'src/common/interfaces/dtos/service.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { IEntityFilterIncludeData } from 'src/common/types/generic.dto.types';
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
  recurringItemId: number;

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
  userId: number;

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

  validationData: EntityFilterDataHelper;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.SERVICE>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;
    this.validationData = await this.fetchDataForCombineValidation(currentUser);

    const userValidationResult = await this.validateUserId();
    if (userValidationResult) errors.push(...userValidationResult);

    const recurringValidationResult = await this.validateRecurringItemId();
    if (recurringValidationResult) errors.push(...recurringValidationResult);

    const appointmentValidationResult =
      await this.validateAppointmentId();
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
        key: 'recurringItemid',
        message: `Recurring item with id: ${this.recurringItemId} does not exist. Please verify the id & try again`,
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
    const userEntityIncludeData: IEntityFilterIncludeData<EntityList.USER> = {
      name: EntityList.USER,
      include: {
        id: [this.userId],
      },
    };

    const recurringItemEntityIncludeData: IEntityFilterIncludeData<EntityList.RECURRING_ITEM> =
      {
        name: EntityList.RECURRING_ITEM,
        include: { id: [this.recurringItemId], userId: [this.userId] },
      };

    const filter: IServiceSearchDto = {
      entities: [userEntityIncludeData, recurringItemEntityIncludeData],
    };

    if (this.appointmentId != null) {
      const appointmentEntityIncludeData: IEntityFilterIncludeData<EntityList.APPOINTMENT> =
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
        .get(EntityList.SERVICE)
        .searchV2(filter, currentUser),
    );
  }

  toCreateDto(): IServiceCreateDto {
    return {
      serviceDate: this.serviceDate,
      recurringItemId: this.recurringItemId,
      appointmentId: this.appointmentId,
      userId: this.userId,
      serviceType: this.serviceType,
      serviceStatus: this.serviceStatus,
      vendorId: this.vendorId,
      serviceEstimate: this.serviceEstimate,
      serviceAmount: this.serviceAmount,
      invoiceDocument: this.invoiceDocument,
    };
  }
}
