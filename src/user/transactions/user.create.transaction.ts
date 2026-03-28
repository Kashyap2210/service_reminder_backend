import { Inject, Injectable } from '@nestjs/common';
import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { EntityList } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { UserHistoryService } from '../services/user-history.service';
import { UserService } from '../services/user.service';
import {
  IUserCreateTransactionInputData,
  IUserCreateTransactionOutputData,
} from './interfaces/user-create-transaction.interface';

@Injectable()
export class UserCreateTransaction extends BaseTransaction<
  IUserCreateTransactionInputData,
  IUserCreateTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
  }

  get userHistoryService(): UserHistoryService {
    return this.registryService.get(
      EntityList.USER_HISTORY,
    ) as UserHistoryService;
  }

  protected async execute(
    data: IUserCreateTransactionInputData,
    manager: EntityManager,
  ): Promise<IUserCreateTransactionOutputData> {
    const { dto, currentUser } = data;

    const userInstance = await this.userService.getInstanceBase(
      currentUser,
      dto,
      manager,
    );

    const createdUser = await this.userService.createBase(
      userInstance,
      manager,
    );

    await this.userHistoryService.createHistoryEntity(
      currentUser,
      createdUser,
      EntityHistoryOperation.CREATE,
      undefined, // ← no newEntity on create, stores full snapshot
      manager,
    );

    return createdUser;
  }
}
