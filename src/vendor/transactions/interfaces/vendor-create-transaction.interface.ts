import { IVendorCreateDto } from 'src/common/interfaces/dtos/vendor.dto.interface';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IVendorCreateTransactionInputData {
  dto: IVendorCreateDto;
  currentUser: IUserEntity;
}

export interface IVendorCreateTransactionOutputData extends IVendorEntity {}
