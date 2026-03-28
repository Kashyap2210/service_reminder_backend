import { IUserEntity } from './entities/user.entity.interface';

export interface ILoginResponse {
  currentUser?: IUserEntity;
  accessToken?: string;
}
