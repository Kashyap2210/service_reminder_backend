import { Injectable } from '@nestjs/common';
import { EntityList, IBaseHistoryEntity } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { AppointmentHistoryEntity } from '../entities/appointment-history.entity';

@Injectable()
export class AppointmentHistoryRepository extends EntityManagerBaseService<EntityList.APPOINTMENT_HISTORY> {
  getEntityClass(): new () => IBaseHistoryEntity {
    return AppointmentHistoryEntity;
  }
}
