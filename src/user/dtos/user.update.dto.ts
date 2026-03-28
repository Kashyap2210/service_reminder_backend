import { OmitType, PartialType } from '@nestjs/swagger';
import { IUserUpdateDto } from 'src/common/interfaces/dtos/user.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { UserCreateDto } from './user.create.dto';

export class UserUpdateDto
  extends PartialType(
    OmitType(UserCreateDto, [
      'validate',
      'validateContactNo',
      'validateEmail',
    ] as const),
  )
  implements IUserUpdateDto
{
  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntityId: number,
  ): Promise<IDtoValidationError[] | null> {
    this.registryService = registryService;
    const errors: IDtoValidationError[] = [];
    let existingEntity: IUserEntity | null = null;

    const existingEntityIdValidationResult =
      await this.validateExistingEntityId(currentUser, existingEntityId);
    if (existingEntityIdValidationResult) {
      if (Array.isArray(existingEntityIdValidationResult)) {
        errors.push(...existingEntityIdValidationResult);
      } else {
        existingEntity = existingEntityIdValidationResult;
      }
    }

    if (existingEntity) {
      const createDtoValidationResult = await this.validateCreateDto(
        currentUser,
        existingEntity,
      );
      if (createDtoValidationResult) {
        errors.push(...createDtoValidationResult);
      }
    }

    return errors.length > 0 ? errors : null;
  }

  async validateExistingEntityId(
    currentUser: IUserEntity,
    existingEntityId: number,
  ): Promise<IDtoValidationError[] | EntityType<EntityList.USER>> {
    const errors: IDtoValidationError[] = [];

    const existingUser = await this.registryService.get(EntityList.USER).search(
      {
        id: [existingEntityId],
      },
      currentUser,
    );

    if (!existingUser || existingUser.length === 0) {
      errors.push({
        key: 'id',
        message: `User with id: ${existingEntityId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : existingUser[0];
  }

  async validateCreateDto(
    currentUser: IUserEntity,
    existingEntity: EntityType<EntityList.USER>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const createDto = Object.assign(new UserCreateDto(), {
      ...existingEntity,
      ...this,
    });
    const createDtoValidationResult = await createDto.validate(
      currentUser,
      this.registryService,
      existingEntity,
    );
    if (createDtoValidationResult) {
      errors.push(...createDtoValidationResult);
    }

    return errors.length > 0 ? errors : null;
  }

  toUpdateDto(): IUserUpdateDto {
    return {
      name: this.name ?? undefined,
      contactNo: this.contactNo ?? undefined,
      email: this.email ?? undefined,
      password: this.password ?? undefined,
    };
  }
}
