import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  AppointmentAction,
  AppointmentStatus,
  EntityList,
  EntityType,
  IAppointmentUpdateDto,
  IDtoValidationError,
  IUserEntity,
} from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { AppointmentCreateDto } from './appointment.create.dto';

export class AppointmentUpdateDto
  extends PartialType(
    OmitType(AppointmentCreateDto, [
      'validate',
      'validateAppointmentDate',
    ] as const),
  )
  implements IAppointmentUpdateDto
{
  registryService: RegistryService;

  @ApiProperty({
    enum: AppointmentAction,
    enumName: 'AppointmentAction',
    description: 'Action to be performed on the appointment',
    example: AppointmentAction.EDIT, // adjust based on your enum
  })
  @IsEnum(AppointmentAction)
  action: AppointmentAction;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntityId: number,
  ): Promise<
    IDtoValidationError[] | EntityType<EntityList.APPOINTMENT> | null
  > {
    this.registryService = registryService;
    const errors: IDtoValidationError[] = [];
    let existingEntity: EntityType<EntityList.APPOINTMENT> | null = null;

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
  ): Promise<IDtoValidationError[] | EntityType<EntityList.APPOINTMENT>> {
    const errors: IDtoValidationError[] = [];

    const existingAppointment =
      (
        await this.registryService.get(EntityList.APPOINTMENT).searchV2(
          {
            include: {
              id: [existingEntityId],
            },
          },
          currentUser,
        )
      )[EntityList.APPOINTMENT] ?? [];
    // console.log('existingAppointment from dto', existingAppointment);

    if (!existingAppointment || existingAppointment.length === 0) {
      errors.push({
        key: 'id',
        message: `Appointment with id: ${existingEntityId} does not exist. Please verify the id & try again`,
      });
    }

    return errors.length > 0 ? errors : existingAppointment[0];
  }

  async validateCreateDto(
    currentUser: IUserEntity,
    existingEntity: EntityType<EntityList.APPOINTMENT>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];

    const createDto = Object.assign(new AppointmentCreateDto(), {
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

  toUpdateDto(nextStatus: AppointmentStatus): IAppointmentUpdateDto {
    return {
      appointmentDate: this.appointmentDate ?? undefined,
      recurringItemId: this.recurringItemId ?? undefined,
      userId: this.userId ?? undefined,
      appointmentType: this.appointmentType ?? undefined,
      vendorId: this.vendorId ?? undefined,
      appointmentStatus: nextStatus,
      checkPoints: this.checkPoints ?? undefined,
    };
  }
}
