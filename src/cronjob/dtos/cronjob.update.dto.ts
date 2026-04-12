import { OmitType, PartialType } from '@nestjs/swagger';
import { RegistryService } from 'src/shared/services/registry.service';
import { CronJobCreateDto } from './cronjob.create.dto';
import { EntityList, EntityType, ICronJobEntity, ICronJobUpdateDto, IDtoValidationError, IUserEntity } from 'service_reminder_common';

export class CronJobUpdateDto
  extends PartialType(OmitType(CronJobCreateDto, ['validate'] as const))
  implements ICronJobUpdateDto
{
  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntityId: number,
  ): Promise<IDtoValidationError[] | EntityType<EntityList.CRONJOB> | null> {
    this.registryService = registryService;
    const errors: IDtoValidationError[] = [];
    let existingEntity: EntityType<EntityList.CRONJOB> | null = null;

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
  ): Promise<IDtoValidationError[] | EntityType<EntityList.CRONJOB>> {
    const errors: IDtoValidationError[] = [];

    const existing = await this.registryService
      .get(EntityList.CRONJOB)
      .search(
        {
          id: [existingEntityId],
        },
        currentUser,
      );

    if (!existing || existing.length === 0) {
      errors.push({
        key: 'id',
        message: `Cron job with id: ${existingEntityId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : existing[0];
  }

  async validateCreateDto(
    currentUser: IUserEntity,
    existingEntity: ICronJobEntity,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const createDto = Object.assign(new CronJobCreateDto(), {
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

  toUpdateDto(): ICronJobUpdateDto {
    return {
      name: this.name ?? undefined,
      cronExpression: this.cronExpression ?? undefined,
      scheduledAt: this.scheduledAt ?? undefined,
      startedAt: this.startedAt ?? undefined,
      completedAt: this.completedAt ?? undefined,
      status: this.status ?? undefined,
      error: this.error ?? undefined,
    };
  }
}
