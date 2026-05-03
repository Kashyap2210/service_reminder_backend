import { Injectable } from '@nestjs/common';
import { EntityList, EntityType } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { IEntityConfig } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { AppointmentHistoryRepository } from '../repositories/appointment-history.repository';

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

  getEntityConfig(): IEntityConfig<EntityType<EntityList.APPOINTMENT_HISTORY>> {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
    };
  }
}
