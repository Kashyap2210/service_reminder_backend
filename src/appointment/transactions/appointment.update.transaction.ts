import { Inject, Injectable } from '@nestjs/common';
import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { EntityList } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { AppointmentHistoryService } from '../services/appointment-history.service';
import { AppointmentService } from '../services/appointment.service';
import {
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
