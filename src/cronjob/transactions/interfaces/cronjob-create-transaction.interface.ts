import { ICronJobCreateDto } from 'src/common/interfaces/dtos/cronjob.dto.interface';
import { ICronJobEntity } from 'src/common/interfaces/entities/cronjob.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface ICronJobCreateTransactionInputData {
  dto: ICronJobCreateDto;
  currentUser: IUserEntity;
}

export interface ICronJobCreateTransactionOutputData extends ICronJobEntity {}
