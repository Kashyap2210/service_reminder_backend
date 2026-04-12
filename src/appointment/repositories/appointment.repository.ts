import { Injectable } from '@nestjs/common';
import { EntityList, IAppointmentEntity } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { AppointmentEntity } from '../entities/appointment.entity';

@Injectable()
export class AppointmentRepository extends EntityManagerBaseService<EntityList.APPOINTMENT> {
  getEntityClass(): new () => IAppointmentEntity {
    return AppointmentEntity;
  }
}
