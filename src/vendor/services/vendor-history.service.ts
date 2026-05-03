import { Injectable } from '@nestjs/common';
import { EntityList, EntityType } from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseHistoryService } from 'src/shared/services/base-history.service';
import { IEntityConfig } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { VendorHistoryRepository } from '../repositories/vendor-history.repository';

@Injectable()
export class VendorHistoryService extends BaseHistoryService<
  EntityList.VENDOR_HISTORY,
  EntityList.VENDOR
> {
  constructor(
    private readonly vendorHistoryRepository: VendorHistoryRepository,
  ) {
    super(EntityList.VENDOR_HISTORY);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.VENDOR_HISTORY> {
    return this.vendorHistoryRepository;
  }

  getEntityConfig(): IEntityConfig<EntityType<EntityList.VENDOR_HISTORY>> {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
    };
  }
}
