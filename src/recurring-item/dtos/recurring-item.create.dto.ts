import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ServicePeriodUnit } from 'src/common/enums/service-period-unit.enum';
import { EntityFilterDataHelper } from 'src/common/helpers/entity-filter-data.helper';
import {
  IRecurringItemCreateDto,
  IRecurringItemSearchDto,
} from 'src/common/interfaces/dtos/recurring-item.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { IEntityFilterIncludeData } from 'src/common/types/generic.dto.types';
import { Nullable } from 'src/common/types/types.generic';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';

export class RecurringItemCreateDto implements IRecurringItemCreateDto {
  @ApiProperty({
    type: String,
    example: 'Annual vehicle service',
    description: 'Display name of the recurring item',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
    example: 'vehicle',
    description: 'Category or type label for the recurring item',
  })
  @IsString()
  @MaxLength(100)
  type: string;

  @ApiProperty({
    type: String,
    example: 'ACME Motors',
    description: 'Company name (optional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName: Nullable<string>;

  // @ApiProperty({
  //   type: Number,
  //   example: 1,
  //   description: 'Vendor id (optional)',
  //   required: false,
  //   nullable: true,
  // })
  // @IsOptional()
  // @IsNumber()
  // vendorId: Nullable<number>;

  @ApiProperty({
    type: Number,
    example: 6,
    description: 'Numeric service period (e.g. every 6)',
  })
  @IsNumber()
  servicePeriod: number;

  @ApiProperty({
    example: ServicePeriodUnit.MONTHS,
    description: 'Unit for service period',
    enum: ServicePeriodUnit,
  })
  @IsEnum(ServicePeriodUnit)
  servicePeriodUnit: ServicePeriodUnit;

  @ApiProperty({
    type: String,
    example: '123 Main St',
    description: 'Service location address (optional)',
    required: false,
    nullable: true,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  servicePlaceAddress: Nullable<string>;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Owning user id',
  })
  @IsNumber()
  userId: number;

  registryService: RegistryService;

  validationData: EntityFilterDataHelper;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.RECURRING_ITEM>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;
    this.validationData = await this.fetchDataForCombineValidation(currentUser);

    const userIdValidationResult = await this.validateUserId();
    if (userIdValidationResult) errors.push(...userIdValidationResult);

    // const vendorIdValidationResult = await this.validateVendorId(currentUser);
    // if (vendorIdValidationResult) errors.push(...vendorIdValidationResult);

    const nameTypeCombineValidationResult =
      await this.validateName(existingEntity);
    if (nameTypeCombineValidationResult)
      errors.push(...nameTypeCombineValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateName(existingEntity?: EntityType<EntityList.RECURRING_ITEM>) {
    const errors: IDtoValidationError[] = [];

    const existingRecurringItems = this.validationData.getEntityFromList(
      EntityList.RECURRING_ITEM,
    );

    if (existingRecurringItems && existingRecurringItems.length !== 0) {
      if (!existingEntity || existingEntity.id !== existingRecurringItems[0].id)
        errors.push({
          key: 'name',
          message: `Recurring Item with name: ${this.name} already exists. Please try again with different details.`,
        });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateUserId() {
    const errors: IDtoValidationError[] = [];

    const users = this.validationData.getEntityFromList(EntityList.USER);

    if (users.length === 0) {
      errors.push({
        key: 'userId',
        message: `User with id: ${this.userId} does not exist. Please verify the id & try again`,
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

    const filter: IRecurringItemSearchDto = {
      name: [this.name],
      // type: [this.type],
      entities: [userEntityIncludeData],
    };

    return new EntityFilterDataHelper(
      await this.registryService
        .get(EntityList.RECURRING_ITEM)
        .searchV2(filter, currentUser),
    );
  }

  // async validateVendorId(currentUser: IUserEntity) {
  //   const errors: IDtoValidationError[] = [];
  //   if (this.vendorId) {
  //     const vendors = await this.registryService
  //       .get(EntityList.VENDOR)
  //       .search({ id: [this.vendorId] }, currentUser);

  //     if (!vendors || vendors.length === 0) {
  //       errors.push({
  //         key: 'vendorId',
  //         message: `Vendor with id: ${this.vendorId} does not exist. Please verify the id & try again`,
  //       });
  //     }

  //     return errors.length > 0 ? errors : null;
  //   }
  // }

  toCreateDto(): IRecurringItemCreateDto {
    return {
      name: this.name,
      type: this.type,
      companyName: this.companyName,
      // vendorId: this.vendorId,
      servicePeriod: this.servicePeriod,
      servicePeriodUnit: this.servicePeriodUnit,
      servicePlaceAddress: this.servicePlaceAddress,
      userId: this.userId,
    };
  }
}
