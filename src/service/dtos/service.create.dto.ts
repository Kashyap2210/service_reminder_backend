import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AppointmentType, EntityFilterDataHelper, EntityList, EntityType, IDtoValidationError, IEntityFilterIncludeData, IServiceCreateDto, IServiceSearchDto, IUserEntity, Nullable } from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { IsValidDateCode } from 'src/shared/validators/dateCode.validator';

export class ServiceCreateDto implements IServiceCreateDto {
  @ApiProperty({
    type: Number,
    example: 20260604,
    description: 'Service date as epoch timestamp (bigint)',
  })
  @IsNumber()
  @IsValidDateCode()
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

  // @ApiProperty({
  //   example: ServiceStatus.SERVICE_STARTED,
  //   enum: ServiceStatus,
  //   description: 'Service status',
  // })
  // @IsEnum(ServiceStatus)
  // serviceStatus: ServiceStatus;

  @ApiProperty({
    type: Number,
    example: 2,
    description: 'Vendor id (optional)',
    required: true,
  })
  @IsNumber()
  vendorId: number;

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

    const combineVendorIdRecurringItemIdValidationResult =
      await this.validateCombineVendorIdRecurringItemId();
    if (combineVendorIdRecurringItemIdValidationResult)
      errors.push(...combineVendorIdRecurringItemIdValidationResult);

    const recurringItemUserValidationResult =
      await this.validateRecurringItemIdUserId();
    if (recurringItemUserValidationResult)
      errors.push(...recurringItemUserValidationResult);

    // const recurringValidationResult = await this.validateRecurringItemId();
    // if (recurringValidationResult) errors.push(...recurringValidationResult);

    // const vendorValidationResult = await this.validateVendorId();
    // if (vendorValidationResult) errors.push(...vendorValidationResult);

    const serviceDateValidationResult = await this.validateServiceDate();
    if (serviceDateValidationResult)
      errors.push(...serviceDateValidationResult);

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

  async validateServiceDate() {
    const errors: IDtoValidationError[] = [];

    const existingServices = this.validationData.getEntityFromList(
      EntityList.SERVICE,
    );

    if (existingServices.length > 0) {
      errors.push({
        key: 'serviceDate',
        message: `A service already exists for this vendor and recurring item on the selected date.`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateRecurringItemIdUserId() {
    const errors: IDtoValidationError[] = [];

    const recurringItems = this.validationData.getEntityFromList(
      EntityList.RECURRING_ITEM,
    );

    if (recurringItems.length === 0) {
      errors.push({
        key: 'recurringItemId',
        message: `Recurring item with id: ${this.recurringItemId} does not exist for this user.`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateCombineVendorIdRecurringItemId() {
    const errors: IDtoValidationError[] = [];

    if (this.vendorId) {
      //  const vendorEntityIncludeRelations: IEntityFilterIncludeData<EntityList.VENDOR> =
      //   {
      //     name: EntityList.VENDOR,
      //     include: { id: [this.vendorId], userId: [this.userId] },
      //   };
      const existingVendorId = this.validationData.getEntityFromList(
        EntityList.VENDOR,
      );
      if (existingVendorId.length === 0) {
        errors.push({
          key: 'vendorId',
          message: `Vendor with id: ${this.vendorId} does not exist for current user. Please try with a valid vendor id.`,
        });
      }
    }

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

  async validateAppointmentOwnershipAndMapping() {
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
        message: `Appointment with id: ${this.appointmentId} does not exist for the selected user, item, and vendor.`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  // async validateRecurringItemId() {
  //   const errors: IDtoValidationError[] = [];

  //   const items = this.validationData.getEntityFromList(
  //     EntityList.RECURRING_ITEM,
  //   );

  //   if (items.length === 0) {
  //     errors.push({
  //       key: 'recurringItemid',
  //       message: `Recurring item with id: ${this.recurringItemId} does not exist. Please verify the id & try again`,
  //     });
  //   }

  //   return errors.length > 0 ? errors : null;
  // }

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

  // async validateVendorId() {
  //   const errors: IDtoValidationError[] = [];

  //   const vendors = this.validationData.getEntityFromList(EntityList.VENDOR);

  //   if (vendors.length === 0) {
  //     errors.push({
  //       key: 'vendorId',
  //       message: `Vendor with id: ${this.vendorId} does not exist. Please verify the id & try again`,
  //     });
  //   }

  //   return errors.length > 0 ? errors : null;
  // }

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

    const vendorIncludeData: IEntityFilterIncludeData<EntityList.VENDOR> = {
      name: EntityList.VENDOR,
      include: { id: [this.vendorId] },
    };

    const serviceEntityIncludeData: IEntityFilterIncludeData<EntityList.SERVICE> =
      {
        name: EntityList.SERVICE,
        include: {
          userId: [this.userId],
          recurringItemId: [this.recurringItemId],
          vendorId: [this.vendorId],
          serviceDate: [this.serviceDate],
        },
      };

    const vendorRecurringItemMappingEntityIncludeData: IEntityFilterIncludeData<EntityList.VENDOR_RECURRING_ITEM_MAPPING> =
      {
        name: EntityList.VENDOR_RECURRING_ITEM_MAPPING,
        include: {
          vendorId: [this.vendorId],
          recurringItemId: [this.recurringItemId],
        },
      };

    const filter: IServiceSearchDto = {
      entities: [
        userEntityIncludeData,
        recurringItemEntityIncludeData,
        vendorIncludeData,
        serviceEntityIncludeData,
        vendorRecurringItemMappingEntityIncludeData,
      ],
    };

    if (this.appointmentId != null) {
      const appointmentEntityIncludeData: IEntityFilterIncludeData<EntityList.APPOINTMENT> =
        {
          name: EntityList.APPOINTMENT,
          include: {
            id: [this.appointmentId],
            userId: [this.userId],
            recurringItemId: [this.recurringItemId],
            vendorId: [this.vendorId],
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
      vendorId: this.vendorId,
      serviceEstimate: this.serviceEstimate,
      serviceAmount: this.serviceAmount,
      invoiceDocument: this.invoiceDocument,
    };
  }
}
