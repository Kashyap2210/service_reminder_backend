import { Injectable } from '@nestjs/common';
import { IAppointmentEntity } from 'src/common/interfaces/entities/appointment.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { AppointmentEntity } from '../entities/appointment.entity';

@Injectable()
export class AppointmentRepository extends EntityManagerBaseService<EntityList.APPOINTMENT> {
  getEntityClass(): new () => IAppointmentEntity {
    return AppointmentEntity;
  }
}
