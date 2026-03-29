import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { VendorUpdateDto } from 'src/vendor/dtos/vendor.update.dto';

export interface IVendorUpdateTransactionInputData {
  id: number;
  dto: VendorUpdateDto;
  currentUser: IUserEntity;
  existingEntity: IVendorEntity;
  mappingsToCreate?: number[];
  mappingsToDelete?: number[];
}

export interface IVendorUpdateTransactionOutputData extends IVendorEntity {}
