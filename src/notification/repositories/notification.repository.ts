import { Injectable } from '@nestjs/common';
import { INotificationEntity } from 'src/common/interfaces/entities/notification.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository extends EntityManagerBaseService<EntityList.NOTIFICATION> {
  getEntityClass(): new () => INotificationEntity {
    return NotificationEntity;
  }
}
