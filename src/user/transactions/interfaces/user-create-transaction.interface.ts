import { IUserEntity } from 'service_reminder_common';
import { UserCreateDto } from 'src/user/dtos/user.create.dto';

export interface IUserCreateTransactionInputData {
  dto: UserCreateDto;
  currentUser: IUserEntity;
}

export interface IUserCreateTransactionOutputData extends IUserEntity {}
