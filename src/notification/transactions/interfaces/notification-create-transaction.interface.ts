import { INotificationCreateDto } from 'src/common/interfaces/dtos/notification.dto.interface';
import { INotificationEntity } from 'src/common/interfaces/entities/notification.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface INotificationCreateTransactionInputData {
  dto: INotificationCreateDto;
  currentUser: IUserEntity;
}

export interface INotificationCreateTransactionOutputData
  extends INotificationEntity {}
