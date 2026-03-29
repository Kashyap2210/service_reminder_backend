import { BadRequestException, Injectable } from '@nestjs/common';
import { IServiceEntity } from 'src/common/interfaces/entities/service.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { ServiceCreateDto } from '../dtos/service.create.dto';
import { ServiceUpdateDto } from '../dtos/service.update.dto';
import { ServiceRepository } from '../repositories/service.repository';
import { ServiceCreateTransaction } from '../transactions/service.create.transaction';
import { ServiceUpdateTransaction } from '../transactions/service.update.transaction';
import { IServiceCreateTransactionInputData } from '../transactions/interfaces/service-create-transaction.interface';
import { IServiceUpdateTransactionInputData } from '../transactions/interfaces/service-update-transaction.interface';
import { ServiceHistoryService } from './service-history.service';

@Injectable()
export class ServiceService extends BaseService<EntityList.SERVICE> {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceCreateTransaction: ServiceCreateTransaction,
    private readonly serviceUpdateTransaction: ServiceUpdateTransaction,
  ) {
    super(EntityList.SERVICE);
  }

  get serviceHistoryService(): ServiceHistoryService {
    return this.registryService.get(
      EntityList.SERVICE_HISTORY,
    ) as ServiceHistoryService;
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.SERVICE> {
    return this.serviceRepository;
  }

  async createService(
    currentUser: IUserEntity,
    dto: ServiceCreateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.SERVICE>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: IServiceCreateTransactionInputData = {
      dto: dto.toCreateDto(),
      currentUser,
    };

    return this.serviceCreateTransaction.run(data);
  }

  async updateService(
    id: number,
    currentUser: IUserEntity,
    dto: ServiceUpdateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.SERVICE>> {
    let existingService: IServiceEntity | null = null;
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
        existingService = validationResult;
      }
    }

    const data: IServiceUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(),
      currentUser,
      existingEntity: existingService!,
    };

    return this.serviceUpdateTransaction.run(data);
  }

  async deleteService(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.serviceRepository.deleteById(id, entityManager);
  }
}
