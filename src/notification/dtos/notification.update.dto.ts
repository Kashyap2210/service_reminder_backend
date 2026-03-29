import { OmitType, PartialType } from '@nestjs/swagger';
import { INotificationUpdateDto } from 'src/common/interfaces/dtos/notification.dto.interface';
import { INotificationEntity } from 'src/common/interfaces/entities/notification.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { NotificationCreateDto } from './notification.create.dto';

export class NotificationUpdateDto
  extends PartialType(
    OmitType(NotificationCreateDto, [
      'validate',
      'validateUserId',
      'validateRecurringItemId',
      'validateAppointmentIfPresent',
    ] as const),
  )
  implements INotificationUpdateDto
{
  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntityId: number,
  ): Promise<
    IDtoValidationError[] | EntityType<EntityList.NOTIFICATION> | null
  > {
    this.registryService = registryService;
    const errors: IDtoValidationError[] = [];
    let existingEntity: EntityType<EntityList.NOTIFICATION> | null = null;

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
  ): Promise<IDtoValidationError[] | EntityType<EntityList.NOTIFICATION>> {
    const errors: IDtoValidationError[] = [];

    const existing = await this.registryService
      .get(EntityList.NOTIFICATION)
      .search(
        {
          id: [existingEntityId],
        },
        currentUser,
      );

    if (!existing || existing.length === 0) {
      errors.push({
        key: 'id',
        message: `Notification with id: ${existingEntityId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : existing[0];
  }

  async validateCreateDto(
    currentUser: IUserEntity,
    existingEntity: INotificationEntity,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const createDto = Object.assign(new NotificationCreateDto(), {
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

  toUpdateDto(): INotificationUpdateDto {
    return {
      userid: this.userid ?? undefined,
      recurringItemid: this.recurringItemid ?? undefined,
      appointmentId: this.appointmentId ?? undefined,
      type: this.type ?? undefined,
      status: this.status ?? undefined,
      scheduledFor: this.scheduledFor ?? undefined,
      sentAt: this.sentAt ?? undefined,
      retryCount: this.retryCount ?? undefined,
      lastError: this.lastError ?? undefined,
      payload: this.payload ?? undefined,
    };
  }
}
