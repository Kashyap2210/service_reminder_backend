import { IUserEntity, IVendorEntity } from 'service_reminder_common';
import { VendorCreateDto } from 'src/vendor/dtos/vendor.create.dto';

export interface IVendorCreateTransactionInputData {
  dto: VendorCreateDto;
  currentUser: IUserEntity;
}

export interface IVendorCreateTransactionOutputData extends IVendorEntity {}
