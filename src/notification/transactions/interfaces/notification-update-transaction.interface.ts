import { INotificationUpdateDto } from 'src/common/interfaces/dtos/notification.dto.interface';
import { INotificationEntity } from 'src/common/interfaces/entities/notification.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface INotificationUpdateTransactionInputData {
  id: number;
  dto: INotificationUpdateDto;
  currentUser: IUserEntity;
  existingEntity: INotificationEntity;
}

export interface INotificationUpdateTransactionOutputData
  extends INotificationEntity {}
