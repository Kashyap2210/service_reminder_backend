import { OmitType, PartialType } from '@nestjs/swagger';
import { IServiceUpdateDto } from 'src/common/interfaces/dtos/service.dto.interface';
import { IServiceEntity } from 'src/common/interfaces/entities/service.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { ServiceCreateDto } from './service.create.dto';

export class ServiceUpdateDto
  extends PartialType(
    OmitType(ServiceCreateDto, [
      'validate',
      'validateUserId',
      'validateRecurringItemId',
      'validateAppointmentIfPresent',
    ] as const),
  )
  implements IServiceUpdateDto
{
  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntityId: number,
  ): Promise<IDtoValidationError[] | EntityType<EntityList.SERVICE> | null> {
    this.registryService = registryService;
    const errors: IDtoValidationError[] = [];
    let existingEntity: EntityType<EntityList.SERVICE> | null = null;

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
  ): Promise<IDtoValidationError[] | EntityType<EntityList.SERVICE>> {
    const errors: IDtoValidationError[] = [];

    const existing = await this.registryService
      .get(EntityList.SERVICE)
      .search(
        {
          id: [existingEntityId],
        },
        currentUser,
      );

    if (!existing || existing.length === 0) {
      errors.push({
        key: 'id',
        message: `Service with id: ${existingEntityId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : existing[0];
  }

  async validateCreateDto(
    currentUser: IUserEntity,
    existingEntity: IServiceEntity,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const createDto = Object.assign(new ServiceCreateDto(), {
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

  toUpdateDto(): IServiceUpdateDto {
    return {
      serviceDate: this.serviceDate ?? undefined,
      recurringItemid: this.recurringItemid ?? undefined,
      appointmentId: this.appointmentId ?? undefined,
      userid: this.userid ?? undefined,
      serviceType: this.serviceType ?? undefined,
      serviceStatus: this.serviceStatus ?? undefined,
      vendorId: this.vendorId ?? undefined,
      serviceEstimate: this.serviceEstimate ?? undefined,
      serviceAmount: this.serviceAmount ?? undefined,
      invoiceDocument: this.invoiceDocument ?? undefined,
    };
  }
}
