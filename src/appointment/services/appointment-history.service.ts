import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { EntityManager } from 'typeorm';
import { AppointmentHistoryRepository } from '../repositories/appointment-history.repository';
import { EntityList } from 'service_reminder_common';

@Injectable()
export class AppointmentHistoryService extends BaseHistoryService<
  EntityList.APPOINTMENT_HISTORY,
  EntityList.APPOINTMENT
> {
  constructor(
    private readonly appointmentHistoryRepository: AppointmentHistoryRepository,
  ) {
    super(EntityList.APPOINTMENT_HISTORY);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.APPOINTMENT_HISTORY> {
    return this.appointmentHistoryRepository;
  }
}
