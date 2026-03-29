import { Injectable } from '@nestjs/common';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { VendorEntity } from '../entities/vendor.entity';

@Injectable()
export class VendorRepository extends EntityManagerBaseService<EntityList.VENDOR> {
  getEntityClass(): new () => IVendorEntity {
    return VendorEntity;
  }
}
