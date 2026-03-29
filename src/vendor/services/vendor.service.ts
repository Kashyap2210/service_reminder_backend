import { BadRequestException, Injectable } from '@nestjs/common';
import { IVendorEntity } from 'src/common/interfaces/entities/vendor.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { VendorCreateDto } from '../dtos/vendor.create.dto';
import { VendorUpdateDto } from '../dtos/vendor.update.dto';
import { VendorRepository } from '../repositories/vendor.repository';
import { VendorCreateTransaction } from '../transactions/vendor.create.transaction';
import { VendorUpdateTransaction } from '../transactions/vendor.update.transaction';
import { IVendorCreateTransactionInputData } from '../transactions/interfaces/vendor-create-transaction.interface';
import { IVendorUpdateTransactionInputData } from '../transactions/interfaces/vendor-update-transaction.interface';
import { VendorHistoryService } from './vendor-history.service';

@Injectable()
export class VendorService extends BaseService<EntityList.VENDOR> {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly vendorCreateTransaction: VendorCreateTransaction,
    private readonly vendorUpdateTransaction: VendorUpdateTransaction,
  ) {
    super(EntityList.VENDOR);
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
      dto: dto.toCreateDto(),
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

    const data: IVendorUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(),
      currentUser,
      existingEntity: existingVendor!,
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
}
