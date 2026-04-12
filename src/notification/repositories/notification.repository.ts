import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { NotificationEntity } from '../entities/notification.entity';
import { EntityList, INotificationEntity } from 'service_reminder_common';

@Injectable()
export class NotificationRepository extends EntityManagerBaseService<EntityList.NOTIFICATION> {
  getEntityClass(): new () => INotificationEntity {
    return NotificationEntity;
  }
}
