import { Injectable } from '@nestjs/common';
import {
  EntityList,
  EntityType,
  IUserEntity,
  IVendorRecurringItemMappingCreateDto,
} from 'service_reminder_common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService, IEntityConfig } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { VendorRecurringItemMappingRepository } from '../repositories/vendor-recurring-item-mapping.repository';

@Injectable()
export class VendorRecurringItemMappingService extends BaseService<EntityList.VENDOR_RECURRING_ITEM_MAPPING> {
  constructor(
    private readonly vendorRecurringItemMappingEntity: VendorRecurringItemMappingRepository,
  ) {
    super(EntityList.VENDOR_RECURRING_ITEM_MAPPING);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.VENDOR_RECURRING_ITEM_MAPPING> {
    return this.vendorRecurringItemMappingEntity;
  }

  getEntityConfig(): IEntityConfig<
    EntityType<EntityList.VENDOR_RECURRING_ITEM_MAPPING>
  > {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
      [EntityList.VENDOR]: {
        mappingProperty: 'vendorId',
        searchProperty: 'id',
      },
      [EntityList.RECURRING_ITEM]: {
        mappingProperty: 'recurringItemId',
        searchProperty: 'id',
      },
    };
  }

  async createVendorRecurringItemMapping(
    dto: IVendorRecurringItemMappingCreateDto,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ) {
    const instance = await this.getInstanceBase(
      currentUser,
      dto,
      entityManager,
    );
    return this.createBase(instance, entityManager);
  }
}
