import { Injectable } from '@nestjs/common';
import { IBaseHistoryEntity } from 'src/common/interfaces/entities/base-history.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { AppointmentHistoryEntity } from '../entities/appointment-history.entity';

@Injectable()
export class AppointmentHistoryRepository extends EntityManagerBaseService<EntityList.APPOINTMENT_HISTORY> {
  getEntityClass(): new () => IBaseHistoryEntity {
    return AppointmentHistoryEntity;
  }
}
