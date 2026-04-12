import { OmitType, PartialType } from '@nestjs/swagger';
import { RegistryService } from 'src/shared/services/registry.service';
import { RecurringItemCreateDto } from './recurring-item.create.dto';
import { EntityList, EntityType, IDtoValidationError, IRecurringItemEntity, IRecurringItemUpdateDto, IUserEntity } from 'service_reminder_common';

export class RecurringItemUpdateDto
  extends PartialType(
    OmitType(RecurringItemCreateDto, ['validate', 'validateUserId'] as const),
  )
  implements IRecurringItemUpdateDto
{
  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntityId: number,
  ): Promise<
    IDtoValidationError[] | EntityType<EntityList.RECURRING_ITEM> | null
  > {
    this.registryService = registryService;
    const errors: IDtoValidationError[] = [];
    let existingEntity: EntityType<EntityList.RECURRING_ITEM> | null = null;

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
  ): Promise<IDtoValidationError[] | EntityType<EntityList.RECURRING_ITEM>> {
    const errors: IDtoValidationError[] = [];

    const existing = await this.registryService
      .get(EntityList.RECURRING_ITEM)
      .search(
        {
          id: [existingEntityId],
        },
        currentUser,
      );

    if (!existing || existing.length === 0) {
      errors.push({
        key: 'id',
        message: `Recurring item with id: ${existingEntityId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : existing[0];
  }

  async validateCreateDto(
    currentUser: IUserEntity,
    existingEntity: IRecurringItemEntity,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const createDto = Object.assign(new RecurringItemCreateDto(), {
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

  toUpdateDto(): IRecurringItemUpdateDto {
    return {
      name: this.name ?? undefined,
      type: this.type ?? undefined,
      companyName: this.companyName ?? undefined,
      // vendorId: this.vendorId ?? undefined,
      servicePeriod: this.servicePeriod ?? undefined,
      servicePeriodUnit: this.servicePeriodUnit ?? undefined,
      servicePlaceAddress: this.servicePlaceAddress ?? undefined,
      userId: this.userId ?? undefined,
    };
  }
}
