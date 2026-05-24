import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  EntityList,
  EntityType,
  IDtoValidationError,
  IServiceEntity,
  IServiceUpdateDto,
  IUserEntity,
  ServiceAction,
  ServiceStatus,
} from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { ServiceCreateDto } from './service.create.dto';

export class ServiceUpdateDto
  extends PartialType(
    OmitType(ServiceCreateDto, [
      'validate',
      'validateUserId',
      // 'validateRecurringItemId',
      'validateAppointmentId',
    ] as const),
  )
  implements IServiceUpdateDto
{
  @ApiProperty({
    enum: ServiceAction,
    enumName: 'ServiceAction',
    description: 'Action to be performed on the appointment',
    example: ServiceAction.EDIT, // adjust based on your enum
  })
  @IsEnum(ServiceAction)
  action: ServiceAction;

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

    const existing = await this.registryService.get(EntityList.SERVICE).search(
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

  toUpdateDto(nextStatus: ServiceStatus): IServiceUpdateDto {
    return {
      serviceDate: this.serviceDate ?? undefined,
      recurringItemId: this.recurringItemId ?? undefined,
      appointmentId: this.appointmentId ?? undefined,
      userId: this.userId ?? undefined,
      serviceType: this.serviceType ?? undefined,
      serviceStatus: nextStatus,
      vendorId: this.vendorId ?? undefined,
      serviceEstimate: this.serviceEstimate ?? undefined,
      serviceAmount: this.serviceAmount ?? undefined,
      invoiceDocument: this.invoiceDocument ?? undefined,
    };
  }
}
