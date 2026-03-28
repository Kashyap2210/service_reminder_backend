// interfaces/user-update-transaction.interface.ts
import { IUserUpdateDto } from 'src/common/interfaces/dtos/user.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IUserUpdateTransactionInputData {
  id: number;
  dto: IUserUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IUserEntity;
}

export interface IUserUpdateTransactionOutputData extends IUserEntity {}
