import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';
import { UserRole } from 'src/common/enums/user.role.enum';
import { IUserCreateDto } from 'src/common/interfaces/dtos/user.dto';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';

export class UserCreateDto implements IUserCreateDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @MaxLength(256)
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Password for the u  ser account',
    type: String,
    name: 'password',
    example: 'P@ssw0rd123',
    required: true,
  })
  password: string;

  @ApiProperty({
    type: String,
    example: '+1234567890',
    description: 'Primary contact number',
  })
  @IsString()
  @MaxLength(64)
  contactNo: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
    description: 'Email ID',
  })
  @IsEmail()
  @MaxLength(128)
  email: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    description: 'Role of the user',
    required: true,
  })
  @IsEnum(UserRole)
  role: UserRole;

  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.USER>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;

    const contactNoValidationResult = await this.validateContactNo(
      currentUser,
      existingEntity,
    );
    if (contactNoValidationResult) errors.push(...contactNoValidationResult);

    const emailValidationResult = await this.validateEmail(
      currentUser,
      existingEntity,
    );
    if (emailValidationResult) errors.push(...emailValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateContactNo(
    currentUser: IUserEntity,
    existingEntity?: EntityType<EntityList.USER>,
  ) {
    const errors: IDtoValidationError[] = [];

    const existingUserFromContactNo = await this.registryService
      .get(EntityList.USER)
      .search(
        {
          contactNo: [this.contactNo],
        },
        currentUser,
      );

    if (existingUserFromContactNo && existingUserFromContactNo.length > 0) {
      // Only error if the found user is a DIFFERENT entity
      if (
        !existingEntity ||
        existingEntity.id !== existingUserFromContactNo[0].id
      ) {
        errors.push({
          key: 'contactNo',
          message: `User with contact number: ${this.contactNo} already exists. Please verify contact number & try again`,
        });
      }
    }

    return errors.length > 0 ? errors : null;
  }

  async validateEmail(
    currentUser: IUserEntity,
    existingEntity?: EntityType<EntityList.USER>,
  ) {
    const errors: IDtoValidationError[] = [];

    const existingUserFromEmail = await this.registryService
      .get(EntityList.USER)
      .search(
        {
          email: [this.email],
        },
        currentUser,
      );

    if (existingUserFromEmail && existingUserFromEmail.length > 0) {
      // Only error if the found user is a DIFFERENT entity
      if (
        !existingEntity ||
        existingEntity.id !== existingUserFromEmail[0].id
      ) {
        errors.push({
          key: 'email',
          message: `User with email: ${this.email} already exists. Please verify email & try again`,
        });
      }
    }

    return errors.length > 0 ? errors : null;
  }

  toCreateDto(): IUserCreateDto {
    return {
      name: this.name,
      contactNo: this.contactNo,
      email: this.email,
      password: this.password,
      role: UserRole.USER,
    };
  }
}
