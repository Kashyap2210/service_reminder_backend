import { Inject, Injectable } from '@nestjs/common';
import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { EntityList } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { ServiceHistoryService } from '../services/service-history.service';
import { ServiceService } from '../services/service.service';
import {
  IServiceUpdateTransactionInputData,
  IServiceUpdateTransactionOutputData,
} from './interfaces/service-update-transaction.interface';

@Injectable()
export class ServiceUpdateTransaction extends BaseTransaction<
  IServiceUpdateTransactionInputData,
  IServiceUpdateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get serviceService(): ServiceService {
    return this.registryService.get(EntityList.SERVICE) as ServiceService;
  }

  get serviceHistoryService(): ServiceHistoryService {
    return this.registryService.get(
      EntityList.SERVICE_HISTORY,
    ) as ServiceHistoryService;
  }

  protected async execute(
    data: IServiceUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<IServiceUpdateTransactionOutputData> {
    const { id, dto, currentUser, existingEntity } = data;

    const updated = await this.serviceService.updateByIdBase(
      id,
      { ...dto, updatedBy: currentUser.id },
      manager,
    );

    await this.serviceHistoryService.createHistoryEntity(
      currentUser,
      existingEntity,
      EntityHistoryOperation.UPDATE,
      { ...updated },
      manager,
    );

    return updated;
  }
}
