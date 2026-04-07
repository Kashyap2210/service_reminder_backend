import { BadRequestException, Injectable } from '@nestjs/common';
import { IVendorRecurringItemMappingCreateDto } from 'src/common/interfaces/dtos/vendor-recurring-item-mapping.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { diffArrays } from 'src/common/utils/helper.fns';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { VendorCreateDto } from '../dtos/vendor.create.dto';
import { VendorUpdateDto } from '../dtos/vendor.update.dto';
import { VendorRepository } from '../repositories/vendor.repository';
import { IVendorCreateTransactionInputData } from '../transactions/interfaces/vendor-create-transaction.interface';
import { IVendorUpdateTransactionInputData } from '../transactions/interfaces/vendor-update-transaction.interface';
import { VendorCreateTransaction } from '../transactions/vendor.create.transaction';
import { VendorUpdateTransaction } from '../transactions/vendor.update.transaction';
import { VendorHistoryService } from './vendor-history.service';
import { VendorRecurringItemMappingService } from './vendor-recurring-item-mapping.service';

@Injectable()
export class VendorService extends BaseService<EntityList.VENDOR> {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly vendorCreateTransaction: VendorCreateTransaction,
    private readonly vendorUpdateTransaction: VendorUpdateTransaction,
  ) {
    super(EntityList.VENDOR);
  }

  get vendorRecurringItemMappingService(): VendorRecurringItemMappingService {
    return this.registryService.get(
      EntityList.VENDOR_RECURRING_ITEM_MAPPING,
    ) as VendorRecurringItemMappingService;
  }

  get vendorHistoryService(): VendorHistoryService {
    return this.registryService.get(
      EntityList.VENDOR_HISTORY,
    ) as VendorHistoryService;
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.VENDOR> {
    return this.vendorRepository;
  }

  async createVendor(
    currentUser: IUserEntity,
    dto: VendorCreateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.VENDOR>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: IVendorCreateTransactionInputData = {
      dto,
      currentUser,
    };

    return this.vendorCreateTransaction.run(data);
  }

  async updateVendor(
    id: number,
    currentUser: IUserEntity,
    dto: VendorUpdateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.VENDOR>> {
    let existingVendor: IVendorEntity | null = null;
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
      id,
    );
    if (validationResult) {
      if (Array.isArray(validationResult)) {
        const errors = validationResult;
        throw new BadRequestException(errors[0]);
      } else if (typeof validationResult === 'object') {
        existingVendor = validationResult;
      }
    }

    let mappingsToCreate: number[] = [];
    let mappingsToDelete: number[] = [];

    if (dto.recurringItemIds?.length > 0) {
      const mappings = await this.getMappingsToCreateDelete(
        currentUser,
        id,
        dto,
        entityManager,
      );
      mappingsToCreate = mappings.mappingsToCreate;
      mappingsToDelete = mappings.mappingsToDelete;
    }

    const data: IVendorUpdateTransactionInputData = {
      id,
      dto,
      currentUser,
      existingEntity: existingVendor!,
      mappingsToCreate,
      mappingsToDelete,
    };

    return this.vendorUpdateTransaction.run(data);
  }

  async deleteVendor(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.vendorRepository.deleteById(id, entityManager);
  }

  async createVendorRecurringItemMappingEntities(
    currentUser: IUserEntity,
    dtos: IVendorRecurringItemMappingCreateDto[],
    manager: EntityManager,
  ) {
    await Promise.all(
      dtos.map((dto) => {
        this.vendorRecurringItemMappingService.createVendorRecurringItemMapping(
          dto,
          currentUser,
          manager,
        );
      }),
    );
  }

  async deleteVendorRecurringItemMappingEntities(
    currentUser: IUserEntity,
    mappingsToDeleteIds: number[],
    entityManager?: EntityManager,
  ) {
    return this.registryService
      .get(EntityList.VENDOR_RECURRING_ITEM_MAPPING)
      .deleteByIdsBase(currentUser, mappingsToDeleteIds, entityManager);
  }

  async getMappingsToCreateDelete(
    currentUser: IUserEntity,
    vendorId: number,
    dto: VendorUpdateDto,
    entityManager?: EntityManager,
  ): Promise<{
    mappingsToCreate: number[];
    mappingsToDelete: number[];
  }> {
    console.log('updateDto', dto);

    const existingVendorRecurringItemMappings =
      await this.vendorRecurringItemMappingService.search(
        {
          vendorId: [vendorId],
        },
        currentUser,
        entityManager,
      );
    console.log(
      'existingVendorRecurringItemMappings',
      existingVendorRecurringItemMappings,
    );
    const { present, added, deleted } = diffArrays(
      existingVendorRecurringItemMappings.map(
        (mapping) => mapping.recurringItemId,
      ),
      dto.recurringItemIds,
    );

    console.log('added', added);
    console.log('deleted', deleted);

    let mappingsToDelete: number[] = [];
    if (deleted.length > 0) {
      mappingsToDelete = existingVendorRecurringItemMappings
        .filter((mapping) => deleted.includes(mapping.recurringItemId))
        .map((mapping) => mapping.id);
    }

    console.log('mappingsToCreate', added);
    console.log('mappingsToDelete', mappingsToDelete);

    return {
      mappingsToCreate: added,
      mappingsToDelete,
    };
  }
}
