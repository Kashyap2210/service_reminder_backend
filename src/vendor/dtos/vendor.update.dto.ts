import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { RegistryService } from 'src/shared/services/registry.service';
import { VendorCreateDto } from './vendor.create.dto';
import { EntityList, EntityType, IDtoValidationError, IUserEntity, IVendorEntity, IVendorEntityUpdateDto } from 'service_reminder_common';

export class VendorUpdateDto
  extends PartialType(
    OmitType(VendorCreateDto, [
      'validate',
      'validateUserId',
      // 'validateRecurringItemId',
    ] as const),
  )
  implements IVendorEntityUpdateDto
{
  @ApiProperty({
    type: [Number],
    example: [1],
    description: 'Recurring-Item entity id(s)',
    required: true,
  })
  @IsArray()
  recurringItemIds: number[];

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

    const existing = await this.registryService.get(EntityList.VENDOR).search(
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

    const allRecurringItemsIdsOfCurrentVendor = (
      await this.registryService
        .get(EntityList.VENDOR_RECURRING_ITEM_MAPPING)
        .search({ vendorId: [existingEntity.id] }, currentUser)
    ).map((mapping) => mapping.recurringItemId);

    const createDto = Object.assign(new VendorCreateDto(), {
      ...existingEntity,
      ...this,
      recurringItemIds: allRecurringItemsIdsOfCurrentVendor,
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

  toUpdateDto(): IVendorEntityUpdateDto {
    return {
      name: this.name ?? undefined,
      contactNo: this.contactNo ?? undefined,
      email: this.email ?? undefined,
      // recurringItemId: this.recurringItemId ?? undefined,
      userId: this.userId ?? undefined,
    };
  }
}
