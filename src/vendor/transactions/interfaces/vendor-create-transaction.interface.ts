import { IVendorCreateDto } from 'src/common/interfaces/dtos/vendor.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { VendorCreateDto } from 'src/vendor/dtos/vendor.create.dto';

export interface IVendorCreateTransactionInputData {
  dto: VendorCreateDto;
  currentUser: IUserEntity;
}

export interface IVendorCreateTransactionOutputData extends IVendorEntity {}
