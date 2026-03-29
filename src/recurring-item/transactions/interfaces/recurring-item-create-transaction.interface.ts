import { IRecurringItemCreateDto } from 'src/common/interfaces/dtos/recurring-item.dto.interface';
import { IRecurringItemEntity } from 'src/common/interfaces/entities/recurring-item.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IRecurringItemCreateTransactionInputData {
  dto: IRecurringItemCreateDto;
  currentUser: IUserEntity;
}

export interface IRecurringItemCreateTransactionOutputData
  extends IRecurringItemEntity {}
