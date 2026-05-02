import { Inject, Injectable } from '@nestjs/common';
import {
  EntityHistoryOperation,
  EntityList,
  ServiceStatus,
} from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { ServiceHistoryService } from '../services/service-history.service';
import { ServiceService } from '../services/service.service';
import {
  IServiceCreateTransactionInputData,
  IServiceCreateTransactionOutputData,
} from './interfaces/service-create-transaction.interface';

@Injectable()
export class ServiceCreateTransaction extends BaseTransaction<
  IServiceCreateTransactionInputData,
  IServiceCreateTransactionOutputData
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
    data: IServiceCreateTransactionInputData,
    manager: EntityManager,
  ): Promise<IServiceCreateTransactionOutputData> {
    const { dto, currentUser } = data;

    const instance = await this.serviceService.getInstanceBase(
      currentUser,
      { ...dto, serviceStatus: ServiceStatus.SCHEDULED },
      manager,
    );

    const created = await this.serviceService.createBase(instance, manager);

    await this.serviceHistoryService.createHistoryEntity(
      currentUser,
      created,
      EntityHistoryOperation.CREATE,
      undefined,
      manager,
    );

    await this.serviceService.sendServiceCreatedNotification(
      currentUser,
      created,
      manager,
    );

    return created;
  }
}
