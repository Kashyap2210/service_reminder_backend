import { Injectable } from '@nestjs/common';
import { ICronJobEntity } from 'src/common/interfaces/entities/cronjob.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { CronJobEntity } from '../entities/cronjob.entity';

@Injectable()
export class CronJobRepository extends EntityManagerBaseService<EntityList.CRONJOB> {
  getEntityClass(): new () => ICronJobEntity {
    return CronJobEntity;
  }
}
