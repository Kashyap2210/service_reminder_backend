import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import {
  EntityFilterDataHelper,
  EntityList,
  EntityType,
  IDtoValidationError,
  IEntityCreateDto,
  IUserCreateDto,
  IUserEntity,
  IUserSearchDto,
  UserRole,
  UserStatus,
} from 'service_reminder_common';
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

  // @ApiProperty({
  //   example: UserRole.ADMIN,
  //   description: 'Role of the user',
  //   required: true,
  // })
  // @IsEnum(UserRole)
  // role: UserRole;

  registryService: RegistryService;

  validationData: EntityFilterDataHelper;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.USER>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;
    this.validationData = await this.fetchDataForCombineValidation(currentUser);

    const contactNoValidationResult =
      await this.validateContactNo(existingEntity);
    if (contactNoValidationResult) errors.push(...contactNoValidationResult);

    const emailValidationResult = await this.validateEmail(existingEntity);
    if (emailValidationResult) errors.push(...emailValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateContactNo(existingEntity?: EntityType<EntityList.USER>) {
    const errors: IDtoValidationError[] = [];

    const existingUserFromContactNo = this.validationData
      .getEntityFromList(EntityList.USER)
      .filter((user) => user.contactNo === this.contactNo);

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

  async validateEmail(existingEntity?: EntityType<EntityList.USER>) {
    const errors: IDtoValidationError[] = [];

    const existingUserFromEmail = this.validationData
      .getEntityFromList(EntityList.USER)
      .filter((user) => user.email === this.email);

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

  async fetchDataForCombineValidation(
    currentUser: IUserEntity,
  ): Promise<EntityFilterDataHelper> {
    const filter: IUserSearchDto = {
      include: {
        contactNo: [this.contactNo],
        email: [this.email],
      },
    };

    return new EntityFilterDataHelper(
      await this.registryService
        .get(EntityList.USER)
        .searchV2(filter, currentUser),
    );
  }

  toCreateDto(): IEntityCreateDto<EntityType<EntityList.USER>> {
    return {
      name: this.name,
      contactNo: this.contactNo,
      email: this.email,
      password: this.password,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    };
  }
}
