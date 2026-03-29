import { IRecurringItemUpdateDto } from 'src/common/interfaces/dtos/recurring-item.dto.interface';
import { IRecurringItemEntity } from 'src/common/interfaces/entities/recurring-item.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IRecurringItemUpdateTransactionInputData {
  id: number;
  dto: IRecurringItemUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IRecurringItemEntity;
}

export interface IRecurringItemUpdateTransactionOutputData
  extends IRecurringItemEntity {}
