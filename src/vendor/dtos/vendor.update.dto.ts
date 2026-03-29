import { OmitType, PartialType } from '@nestjs/swagger';
import { IVendorUpdateDto } from 'src/common/interfaces/dtos/vendor.dto.interface';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { VendorCreateDto } from './vendor.create.dto';

export class VendorUpdateDto
  extends PartialType(
    OmitType(VendorCreateDto, [
      'validate',
      'validateUserId',
      'validateRecurringItemId',
    ] as const),
  )
  implements IVendorUpdateDto
{
  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntityId: number,
  ): Promise<IDtoValidationError[] | EntityType<EntityList.VENDOR> | null> {
    this.registryService = registryService;
    const errors: IDtoValidationError[] = [];
    let existingEntity: EntityType<EntityList.VENDOR> | null = null;

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

    return errors.length > 0 ? errors : (existingEntity ?? null);
  }

  async validateExistingEntityId(
    currentUser: IUserEntity,
    existingEntityId: number,
  ): Promise<IDtoValidationError[] | EntityType<EntityList.VENDOR>> {
    const errors: IDtoValidationError[] = [];

    const existing = await this.registryService
      .get(EntityList.VENDOR)
      .search(
        {
          id: [existingEntityId],
        },
        currentUser,
      );

    if (!existing || existing.length === 0) {
      errors.push({
        key: 'id',
        message: `Vendor with id: ${existingEntityId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : existing[0];
  }

  async validateCreateDto(
    currentUser: IUserEntity,
    existingEntity: IVendorEntity,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const createDto = Object.assign(new VendorCreateDto(), {
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

  toUpdateDto(): IVendorUpdateDto {
    return {
      name: this.name ?? undefined,
      contactNo: this.contactNo ?? undefined,
      email: this.email ?? undefined,
      recurringItemId: this.recurringItemId ?? undefined,
      userId: this.userId ?? undefined,
    };
  }
}
