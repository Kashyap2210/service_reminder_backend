import { IServiceCreateDto } from 'src/common/interfaces/dtos/service.dto.interface';
import { IServiceEntity } from 'src/common/interfaces/entities/service.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IServiceCreateTransactionInputData {
  dto: IServiceCreateDto;
  currentUser: IUserEntity;
}

export interface IServiceCreateTransactionOutputData extends IServiceEntity {}
