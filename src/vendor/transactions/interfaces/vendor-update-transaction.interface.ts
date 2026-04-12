import { IUserEntity, IVendorEntity } from 'service_reminder_common';
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
