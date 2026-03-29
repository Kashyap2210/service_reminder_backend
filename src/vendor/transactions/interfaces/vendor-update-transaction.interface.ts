import { IVendorUpdateDto } from 'src/common/interfaces/dtos/vendor.dto.interface';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export interface IVendorUpdateTransactionInputData {
  id: number;
  dto: IVendorUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IVendorEntity;
}

export interface IVendorUpdateTransactionOutputData extends IVendorEntity {}
