import { Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { VendorEntity } from '../entities/vendor.entity';
import { EntityList, IVendorEntity } from 'service_reminder_common';

@Injectable()
export class VendorRepository extends EntityManagerBaseService<EntityList.VENDOR> {
  getEntityClass(): new () => IVendorEntity {
    return VendorEntity;
  }
}
