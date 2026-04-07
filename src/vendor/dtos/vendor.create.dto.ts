import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EntityFilterDataHelper } from 'src/common/helpers/entity-filter-data.helper';
import {
  IVendorCreateDto,
  IVendorEntityCreateDto,
  IVendorSearchDto,
} from 'src/common/interfaces/dtos/vendor.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { IEntityFilterIncludeData } from 'src/common/types/generic.dto.types';
import { Nullable } from 'src/common/types/types.generic';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';

export class VendorCreateDto implements IVendorCreateDto {
  @ApiProperty({
    type: String,
    example: 'ACME Service Center',
    description: 'Vendor display name',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
    example: '+1234567890',
    description: 'Primary contact number',
  })
  @IsString()
  @MaxLength(15)
  contactNo: string;

  @ApiPropertyOptional({
    type: String,
    example: 'vendor@example.com',
    description: 'Email (optional)',
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(256)
  email: Nullable<string>;

  @ApiProperty({
    type: [Number],
    example: [1],
    description: 'Recurring-Item entity id(s)',
    required: true,
  })
  @IsArray()
  recurringItemIds: number[];

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
    existingEntity?: EntityType<EntityList.VENDOR>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;
    this.validationData = await this.fetchDataForCombineValidation(currentUser);

    const combineContactNumberEmailNameValidationResult =
      await this.validateContactNumberEmailNameCombine(existingEntity);
    if (combineContactNumberEmailNameValidationResult)
      errors.push(...combineContactNumberEmailNameValidationResult);

    const userValidationResult = await this.validateUserId();
    if (userValidationResult) errors.push(...userValidationResult);

    const recurringValidationResult = await this.validateRecurringItemId();
    if (recurringValidationResult) errors.push(...recurringValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateContactNumberEmailNameCombine(
    existingEntity?: EntityType<EntityList.VENDOR>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const paramForValidation: (keyof IVendorCreateDto)[] = [
      'name',
      'contactNo',
      'email',
    ];
    for (const param of paramForValidation) {
      const relevantVendor = this.validationData
        .getEntityFromList(EntityList.VENDOR)
        .filter((vendor) => vendor[param] === this[param]);

      if (relevantVendor.length > 0) {
        if (!existingEntity || existingEntity.id !== relevantVendor[0].id)
          errors.push({
            key: `${param}`,
            message: `Vendor with ${param}: '${this[param]}' already exists please try with a valid value.`,
          });
      }
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

  async validateRecurringItemId() {
    const errors: IDtoValidationError[] = [];

    const items = this.validationData.getEntityFromList(
      EntityList.RECURRING_ITEM,
    );

    if (items.length === 0 || items.length !== this.recurringItemIds.length) {
      errors.push({
        key: 'recurringItemId',
        message: `Recurring item with id: ${this.recurringItemIds} does not exist. Please verify the id & try again`,
      });
    }

    // const existingVendorForRecurringItem = await this.registryService
    //   .get(EntityList.VENDOR)
    //   .search({ recurringItemId: [this.recurringItemId] }, currentUser);
    //   if(existingVendorForRecurringItem && existingVendorForRecurringItem.length> 0 ){
    //     errors.push({
    //       key: 'recurringItemId',
    //       message: `A vendor already exists for the ${items[0].name}. If you wish you can update the recurring item to`
    //     })
    //   }

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
        include: { id: this.recurringItemIds, userId: [this.userId] },
      };

    const filter: IVendorSearchDto = {
      entities: [userEntityIncludeData, recurringItemEntityIncludeData],
    };

    return new EntityFilterDataHelper(
      await this.registryService
        .get(EntityList.VENDOR)
        .searchV2(filter, currentUser),
    );
  }

  toCreateDto(): IVendorEntityCreateDto {
    return {
      name: this.name,
      contactNo: this.contactNo,
      email: this.email,
      // recurringItemId: this.recurringItemId,
      userId: this.userId,
    };
  }
}
