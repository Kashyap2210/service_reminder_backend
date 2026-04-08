import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { EntityFilterDataHelper } from 'src/common/helpers/entity-filter-data.helper';
import {
  IAppointmentCreateDto,
  IAppointmentSearchDto,
} from 'src/common/interfaces/dtos/appointment.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { IEntityFilterIncludeData } from 'src/common/types/generic.dto.types';
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
    required: true,
    nullable: true,
  })
  @IsPositive()
  vendorId: number;

  // @ApiProperty({
  //   example: AppointmentStatus.BOOKED,
  //   description: 'Status of the appointment',
  //   enum: AppointmentStatus,
  //   required: true,
  // })
  // @IsEnum(AppointmentStatus)
  // appointmentStatus: AppointmentStatus;

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

  validationData: EntityFilterDataHelper;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.APPOINTMENT>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;

    this.validationData = await this.fetchDataForCombineValidation(currentUser);

    const appointmentDateValidationResult =
      await this.validateAppointmentDate(existingEntity);
    if (appointmentDateValidationResult)
      errors.push(...appointmentDateValidationResult);

    const userIdValidationResult = await this.validateUserId();
    if (userIdValidationResult) errors.push(...userIdValidationResult);

    const combineVendorIdRecurringItemIdValidationResult =
      await this.validateCombineVendorIdRecurringItemId();
    if (combineVendorIdRecurringItemIdValidationResult)
      errors.push(...combineVendorIdRecurringItemIdValidationResult);

    const vendorOwnershipValidationResult = await this.validateVendorIdUserId();
    if (vendorOwnershipValidationResult)
      errors.push(...vendorOwnershipValidationResult);

    // const recurringItemIdValidationResult =
    //   await this.validateRecurringItemId();
    // if (recurringItemIdValidationResult)
    //   errors.push(...recurringItemIdValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateAppointmentDate(
    existingEntity?: EntityType<EntityList.APPOINTMENT>,
  ) {
    const errors: IDtoValidationError[] = [];

    // this will only have those appointment
    // that will be scheduled for the same data & item
    // recurringItemId: [this.recurringItemId],
    // appointmentDate: [this.appointmentDate],
    const existingAppointment = this.validationData.getEntityFromList(
      EntityList.APPOINTMENT,
    );

    if (existingAppointment && existingAppointment.length > 0) {
      // Only error if the found appointment is a DIFFERENT entity
      if (!existingEntity || existingEntity.id !== existingAppointment[0].id) {
        errors.push({
          key: 'appointmentDate',
          message: `An appointment for recurring item ID: ${this.recurringItemId} on date: ${this.appointmentDate} already exists. Please verify the details & try again.`,
        });
      }
    }

    return errors.length > 0 ? errors : null;
  }

  async validateUserId() {
    const errors: IDtoValidationError[] = [];

    // const userEntityIncludeData: IEntityFilterIncludeData<EntityList.USER> = {
    //   name: EntityList.USER,
    //   include: {
    //     id: [this.userId],
    //   },
    // };
    const existingUserId = this.validationData.getEntityFromList(
      EntityList.USER,
    );
    if (existingUserId.length === 0) {
      errors.push({
        key: 'userId',
        message: `User with id: ${this.userId} does not exist. Please try with a valid user id.`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateCombineVendorIdRecurringItemId() {
    const errors: IDtoValidationError[] = [];

    //  const recurringItemEntityIncludeData: IEntityFilterIncludeData<EntityList.RECURRING_ITEM> =
    //   {
    //     name: EntityList.RECURRING_ITEM,
    //     include: { id: [this.recurringItemId], userId: [this.userId] },
    //   };
    const existingRecurringItemId = this.validationData.getEntityFromList(
      EntityList.RECURRING_ITEM,
    );
    if (existingRecurringItemId.length === 0) {
      errors.push({
        key: 'recurringItemId',
        message: `Recurring Item with id: ${this.recurringItemId} does not exists for current user. Please try with a valid recurring item id.`,
      });
    }

    const vendorRecurringItemIdMappings = this.validationData.getEntityFromList(
      EntityList.VENDOR_RECURRING_ITEM_MAPPING,
    );
    const allVendorsAllowedForThisRecurringITemId =
      vendorRecurringItemIdMappings.map((mapping) => mapping.vendorId);
    if (!allVendorsAllowedForThisRecurringITemId.includes(this.vendorId)) {
      errors.push({
        key: 'vendorId',
        message: `The selected vendor is not linked to this recurring item. Please select an assigned vendor or update the vendor-item mapping.`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  // async validateRecurringItemId() {
  //   const errors: IDtoValidationError[] = [];

  //   //  const recurringItemEntityIncludeData: IEntityFilterIncludeData<EntityList.RECURRING_ITEM> =
  //   //   {
  //   //     name: EntityList.RECURRING_ITEM,
  //   //     include: { id: [this.recurringItemId], userId: [this.userId] },
  //   //   };
  //   const existingRecurringItemId = this.validationData.getEntityFromList(
  //     EntityList.RECURRING_ITEM,
  //   );
  //   if (existingRecurringItemId.length === 0) {
  //     errors.push({
  //       key: 'recurringItemId',
  //       message: `Recurring Item with id: ${this.recurringItemId} does not exists for current user. Please try with a valid recurring item id.`,
  //     });
  //   }

  //   return errors.length > 0 ? errors : null;
  // }

  async validateVendorIdUserId() {
    if (!this.vendorId) return null;

    const errors: IDtoValidationError[] = [];

    const vendors = this.validationData.getEntityFromList(EntityList.VENDOR);

    if (vendors.length === 0) {
      errors.push({
        key: 'vendorId',
        message: `Vendor does not exist or does not belong to the user.`,
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
      checkPoints: this.checkPoints,
    };
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

    const vendorRecurringItemMappingEntityIncludeData: IEntityFilterIncludeData<EntityList.VENDOR_RECURRING_ITEM_MAPPING> =
      {
        name: EntityList.VENDOR_RECURRING_ITEM_MAPPING,
        include: {
          vendorId: [this.vendorId],
          recurringItemId: [this.recurringItemId],
        },
      };

    const filter: IAppointmentSearchDto = {
      recurringItemId: [this.recurringItemId],
      appointmentDate: [this.appointmentDate],
      entities: [
        userEntityIncludeData,
        recurringItemEntityIncludeData,
        vendorRecurringItemMappingEntityIncludeData,
      ],
    };

    if (this.vendorId) {
      const vendorEntityIncludeRelations: IEntityFilterIncludeData<EntityList.VENDOR> =
        {
          name: EntityList.VENDOR,
          include: { id: [this.vendorId], userId: [this.userId] },
        };
      filter.entities = [
        ...(filter.entities ?? []),
        vendorEntityIncludeRelations,
      ];
    }

    return new EntityFilterDataHelper(
      await this.registryService
        .get(EntityList.APPOINTMENT)
        .searchV2(filter, currentUser),
    );
  }
}
