import { IServiceUpdateDto } from 'src/common/interfaces/dtos/service.dto.interface';
import { IServiceEntity } from 'src/common/interfaces/entities/service.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IServiceUpdateTransactionInputData {
  id: number;
  dto: IServiceUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IServiceEntity;
}

export interface IServiceUpdateTransactionOutputData extends IServiceEntity {}
