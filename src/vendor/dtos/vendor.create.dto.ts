import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IVendorCreateDto } from 'src/common/interfaces/dtos/vendor.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
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
    type: Number,
    example: 1,
    description: 'Linked recurring item id',
  })
  @IsNumber()
  recurringItemId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Owning user id',
  })
  @IsNumber()
  userId: number;

  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.VENDOR>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;

    const userValidationResult = await this.validateUserId(currentUser);
    if (userValidationResult) errors.push(...userValidationResult);

    const recurringValidationResult =
      await this.validateRecurringItemId(currentUser);
    if (recurringValidationResult)
      errors.push(...recurringValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateUserId(currentUser: IUserEntity) {
    const errors: IDtoValidationError[] = [];

    const users = await this.registryService
      .get(EntityList.USER)
      .search({ id: [this.userId] }, currentUser);

    if (!users || users.length === 0) {
      errors.push({
        key: 'userId',
        message: `User with id: ${this.userId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async validateRecurringItemId(currentUser: IUserEntity) {
    const errors: IDtoValidationError[] = [];

    const items = await this.registryService
      .get(EntityList.RECURRING_ITEM)
      .search({ id: [this.recurringItemId] }, currentUser);

    if (!items || items.length === 0) {
      errors.push({
        key: 'recurringItemId',
        message: `Recurring item with id: ${this.recurringItemId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : null;
  }

  toCreateDto(): IVendorCreateDto {
    return {
      name: this.name,
      contactNo: this.contactNo,
      email: this.email,
      recurringItemId: this.recurringItemId,
      userId: this.userId,
    };
  }
}
