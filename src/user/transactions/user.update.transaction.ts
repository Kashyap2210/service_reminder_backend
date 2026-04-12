import { Inject, Injectable } from '@nestjs/common';
import { EntityHistoryOperation, EntityList } from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { UserHistoryService } from '../services/user-history.service';
import { UserService } from '../services/user.service';
import {
  IUserUpdateTransactionInputData,
  IUserUpdateTransactionOutputData,
} from './interfaces/user-update-transaction.interface';

@Injectable()
export class UserUpdateTransaction extends BaseTransaction<
  IUserUpdateTransactionInputData,
  IUserUpdateTransactionOutputData
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
    data: IUserUpdateTransactionInputData,
    manager: EntityManager,
  ): Promise<IUserUpdateTransactionOutputData> {
    const { id, dto, currentUser, existingEntity } = data;

    const updatedUser = await this.userService.updateByIdBase(
      id,
      { ...dto, updatedBy: currentUser.id },
      manager,
    );

    await this.userHistoryService.createHistoryEntity(
      currentUser,
      existingEntity,
      EntityHistoryOperation.UPDATE,
      { ...updatedUser }, // ← diff will be computed against oldUser
      manager,
    );

    return updatedUser;
  }
}
