import { Injectable } from '@nestjs/common';
import { EntityList, ICronJobEntity } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { CronJobEntity } from '../entities/cronjob.entity';

@Injectable()
export class CronJobRepository extends EntityManagerBaseService<EntityList.CRONJOB> {
  getEntityClass(): new () => ICronJobEntity {
    return CronJobEntity;
  }
}
