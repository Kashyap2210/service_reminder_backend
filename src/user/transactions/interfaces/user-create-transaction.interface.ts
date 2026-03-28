// interfaces/user-create-transaction.interface.ts
import { IUserCreateDto } from 'src/common/interfaces/dtos/user.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IUserCreateTransactionInputData {
  dto: IUserCreateDto;
  currentUser: IUserEntity;
}

export interface IUserCreateTransactionOutputData extends IUserEntity {}
