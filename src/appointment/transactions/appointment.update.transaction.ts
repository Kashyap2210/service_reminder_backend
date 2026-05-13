import { Inject, Injectable } from '@nestjs/common';
import {
  AppointmentStatus,
  EntityHistoryOperation,
  EntityList,
} from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { AppointmentHistoryService } from '../services/appointment-history.service';
import { AppointmentService } from '../services/appointment.service';
import {
  IAppointmentBulkUpdateTransactionInputData,
  IAppointmentBulkUpdateTransactionOutputData,
  IAppointmentUpdateTransactionInputData,
  IAppointmentUpdateTransactionOutputData,
} from './interfaces/appointment-update-transaction.interface';

@Injectable()
export class AppointmentUpdateTransaction extends BaseTransaction<
  IAppointmentUpdateTransactionInputData,
  IAppointmentUpdateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get appointmentService(): AppointmentService {
    return this.registryService.get(
      EntityList.APPOINTMENT,
    ) as AppointmentService;
  }

  get appointmentHistoryService(): AppointmentHistoryService {
    return this.registryService.get(
      EntityList.APPOINTMENT_HISTORY,
    ) as AppointmentHistoryService;
  }

  protected async execute(
    data: IAppointmentUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<IAppointmentUpdateTransactionOutputData> {
    const { id, dto, currentUser, existingEntity } = data;

    const updatedAppointment = await this.appointmentService.updateByIdBase(
      id,
      { ...dto, updatedBy: currentUser.id },
      manager,
    );

    await this.appointmentHistoryService.createHistoryEntity(
      currentUser,
      existingEntity,
      EntityHistoryOperation.UPDATE,
      { ...updatedAppointment }, // ← diff will be computed against existingEntity
      manager,
    );

    return updatedAppointment;
  }
}

export class AppointmentBulkUpdateTransaction extends BaseTransaction<
  IAppointmentBulkUpdateTransactionInputData,
  IAppointmentBulkUpdateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get appointmentService(): AppointmentService {
    return this.registryService.get(
      EntityList.APPOINTMENT,
    ) as AppointmentService;
  }

  get appointmentHistoryService(): AppointmentHistoryService {
    return this.registryService.get(
      EntityList.APPOINTMENT_HISTORY,
    ) as AppointmentHistoryService;
  }

  protected async execute(
    data: IAppointmentBulkUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<IAppointmentBulkUpdateTransactionOutputData> {
    const { existingEntities, currentUser } = data;

    const updatedEntities = await this.appointmentService.updateBulkBase(
      existingEntities.map((entity) => ({
        id: entity.id,
        appointmentStatus: AppointmentStatus.NO_SHOW,
        updatedBy: currentUser.id,
      })),
      manager,
    );

    await this.appointmentHistoryService.createBulkHistory(
      currentUser,
      existingEntities,
      EntityHistoryOperation.UPDATE,
      updatedEntities,
      manager,
    );

    return updatedEntities;
  }
}
