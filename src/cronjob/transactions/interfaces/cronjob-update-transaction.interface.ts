import { ICronJobUpdateDto } from 'src/common/interfaces/dtos/cronjob.dto.interface';
import { ICronJobEntity } from 'src/common/interfaces/entities/cronjob.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface ICronJobUpdateTransactionInputData {
  id: number;
  dto: ICronJobUpdateDto;
  currentUser: IUserEntity;
  existingEntity: ICronJobEntity;
}

export interface ICronJobUpdateTransactionOutputData extends ICronJobEntity {}
