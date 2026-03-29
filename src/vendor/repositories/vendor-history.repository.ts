import { Injectable } from '@nestjs/common';
import { IVendorHistoryEntity } from 'src/common/interfaces/entities/vendor-history.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { VendorHistoryEntity } from '../entities/vendor-history.entity';

@Injectable()
export class VendorHistoryRepository extends EntityManagerBaseService<EntityList.VENDOR_HISTORY> {
  getEntityClass(): new () => IVendorHistoryEntity {
    return VendorHistoryEntity;
  }
}
