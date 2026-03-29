import { IAppointmentEntity } from '../interfaces/entities/appointment.entity.interface';
import { IBaseHistoryEntity } from '../interfaces/entities/base-history.entity.interface';
import { ICronJobEntity } from '../interfaces/entities/cronjob.entity.interface';
import { INotificationEntity } from '../interfaces/entities/notification.entity.interface';
import { IRecurringItemEntity } from '../interfaces/entities/recurring-item.entity.interface';
import { IServiceEntity } from '../interfaces/entities/service.entity.interface';
import { IUserEntity } from '../interfaces/entities/user.entity.interface';
import { IVendorRecurringItemMapping } from '../interfaces/entities/vendor-recurring-item-mapping.entity.interface';
import { IVendorEntity } from '../interfaces/entities/vendor.entity.interface';

export enum EntityList {
  USER = 'user',
  USER_HISTORY = 'user_history',
  RECURRING_ITEM = 'recurring_item',
  RECURRING_ITEM_HISTORY = 'recurring_item_history',
  VENDOR = 'vendor',
  VENDOR_HISTORY = 'vendor_history',
  APPOINTMENT = 'appointment',
  APPOINTMENT_HISTORY = 'appointment_history',
  SERVICE = 'service',
  SERVICE_HISTORY = 'service_history',
  NOTIFICATION = 'notification',
  CRONJOB = 'cron_job',
  VENDOR_RECURRING_ITEM_MAPPING = 'vendor_recurring_item_mapping',
}

export type EntityType<T extends EntityList> = T extends EntityList.USER
  ? IUserEntity
  : T extends EntityList.USER_HISTORY
    ? IBaseHistoryEntity
    : T extends EntityList.RECURRING_ITEM
      ? IRecurringItemEntity
      : T extends EntityList.RECURRING_ITEM_HISTORY
        ? IBaseHistoryEntity
        : T extends EntityList.VENDOR
          ? IVendorEntity
          : T extends EntityList.VENDOR_HISTORY
            ? IBaseHistoryEntity
            : T extends EntityList.APPOINTMENT
              ? IAppointmentEntity
              : T extends EntityList.APPOINTMENT_HISTORY
                ? IBaseHistoryEntity
                : T extends EntityList.SERVICE
                  ? IServiceEntity
                  : T extends EntityList.SERVICE_HISTORY
                    ? IBaseHistoryEntity
                    : T extends EntityList.NOTIFICATION
                      ? INotificationEntity
                      : T extends EntityList.CRONJOB
                        ? ICronJobEntity
                        : T extends EntityList.VENDOR_RECURRING_ITEM_MAPPING
                          ? IVendorRecurringItemMapping
                          : never;
