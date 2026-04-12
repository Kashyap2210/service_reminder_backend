import { Inject, Injectable } from '@nestjs/common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { AppointmentHistoryService } from '../services/appointment-history.service';
import { AppointmentService } from '../services/appointment.service';
import {
  IAppointmentCreateTransactionInputData,
  IAppointmentCreateTransactionOutputData,
} from './interfaces/appointment-create-transaction.interface';
import { AppointmentStatus, EntityHistoryOperation, EntityList } from 'service_reminder_common';

@Injectable()
export class AppointmentCreateTransaction extends BaseTransaction<
  IAppointmentCreateTransactionInputData,
  IAppointmentCreateTransactionOutputData
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
    data: IAppointmentCreateTransactionInputData,
    manager: EntityManager,
  ): Promise<IAppointmentCreateTransactionOutputData> {
    const { dto, currentUser } = data;

    const appointmentInstance = await this.appointmentService.getInstanceBase(
      currentUser,
      { ...dto, appointmentStatus: AppointmentStatus.BOOKED },
      manager,
    );

    const createdAppointment = await this.appointmentService.createBase(
      appointmentInstance,
      manager,
    );

    await this.appointmentHistoryService.createHistoryEntity(
      currentUser,
      createdAppointment,
      EntityHistoryOperation.CREATE,
      undefined, // ← no newEntity on create, stores full snapshot
      manager,
    );

    return createdAppointment;
  }
}
