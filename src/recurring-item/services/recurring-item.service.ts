import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { RecurringItemCreateDto } from '../dtos/recurring-item.create.dto';
import { RecurringItemUpdateDto } from '../dtos/recurring-item.update.dto';
import { RecurringItemRepository } from '../repositories/recurring-item.repository';
import { RecurringItemCreateTransaction } from '../transactions/recurring-item.create.transaction';
import { RecurringItemUpdateTransaction } from '../transactions/recurring-item.update.transaction';
import { IRecurringItemCreateTransactionInputData } from '../transactions/interfaces/recurring-item-create-transaction.interface';
import { IRecurringItemUpdateTransactionInputData } from '../transactions/interfaces/recurring-item-update-transaction.interface';
import { RecurringItemHistoryService } from './recurring-item-history.service';
import { EntityList, EntityType, IRecurringItemEntity, IUserEntity } from 'service_reminder_common';

@Injectable()
export class RecurringItemService extends BaseService<EntityList.RECURRING_ITEM> {
  constructor(
    private readonly recurringItemRepository: RecurringItemRepository,
    private readonly recurringItemCreateTransaction: RecurringItemCreateTransaction,
    private readonly recurringItemUpdateTransaction: RecurringItemUpdateTransaction,
  ) {
    super(EntityList.RECURRING_ITEM);
  }

  get recurringItemHistoryService(): RecurringItemHistoryService {
    return this.registryService.get(
      EntityList.RECURRING_ITEM_HISTORY,
    ) as RecurringItemHistoryService;
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.RECURRING_ITEM> {
    return this.recurringItemRepository;
  }

  async createRecurringItem(
    currentUser: IUserEntity,
    dto: RecurringItemCreateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.RECURRING_ITEM>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: IRecurringItemCreateTransactionInputData = {
      dto: dto.toCreateDto(),
      currentUser,
    };

    return this.recurringItemCreateTransaction.run(data);
  }

  async updateRecurringItem(
    id: number,
    currentUser: IUserEntity,
    dto: RecurringItemUpdateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.RECURRING_ITEM>> {
    let existingRecurringItem: IRecurringItemEntity | null = null;
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
        existingRecurringItem = validationResult;
      }
    }

    const data: IRecurringItemUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(),
      currentUser,
      existingEntity: existingRecurringItem!,
    };

    return this.recurringItemUpdateTransaction.run(data);
  }

  async deleteRecurringItem(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.recurringItemRepository.deleteById(id, entityManager);
  }
}
