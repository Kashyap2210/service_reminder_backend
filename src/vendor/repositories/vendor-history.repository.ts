import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { VendorHistoryEntity } from '../entities/vendor-history.entity';
import { EntityList, IVendorHistoryEntity } from 'service_reminder_common';

@Injectable()
export class VendorHistoryRepository extends EntityManagerBaseService<EntityList.VENDOR_HISTORY> {
  getEntityClass(): new () => IVendorHistoryEntity {
    return VendorHistoryEntity;
  }
}
