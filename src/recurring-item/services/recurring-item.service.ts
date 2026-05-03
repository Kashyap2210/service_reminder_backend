import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DateCodeUtils,
  EntityFilterDataHelper,
  EntityList,
  EntityType,
  IEntityFilterSearchData,
  IRecurringItemEntity,
  IUserEntity,
} from 'service_reminder_common';
import { MailService } from 'src/mail/services/mail.service';
import { IMailData } from 'src/mail/templates/template-interfaces/mail-data.interface';
import { IRecurringItemCreated } from 'src/mail/templates/template-interfaces/recurring-item-created.interface';
import { EmailTemplate } from 'src/mail/utils/email-template.enum';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { EntityManager } from 'typeorm';
import { RecurringItemCreateDto } from '../dtos/recurring-item.create.dto';
import { RecurringItemUpdateDto } from '../dtos/recurring-item.update.dto';
import { RecurringItemRepository } from '../repositories/recurring-item.repository';
import { IRecurringItemCreateTransactionInputData } from '../transactions/interfaces/recurring-item-create-transaction.interface';
import { IRecurringItemUpdateTransactionInputData } from '../transactions/interfaces/recurring-item-update-transaction.interface';
import { RecurringItemCreateTransaction } from '../transactions/recurring-item.create.transaction';
import { RecurringItemUpdateTransaction } from '../transactions/recurring-item.update.transaction';
import { RecurringItemHistoryService } from './recurring-item-history.service';

@Injectable()
export class RecurringItemService extends BaseService<EntityList.RECURRING_ITEM> {
  constructor(
    private readonly recurringItemRepository: RecurringItemRepository,
    private readonly mailService: MailService,
    private readonly envVariablesConfig: EnvVariablesConfig,
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

  async sendRecurringItemCreatedNotification(
    currentUser: IUserEntity,
    recurringItem: IRecurringItemEntity,
    entityManager?: EntityManager,
  ): Promise<void> {
    const userEntity = await this.getSupportingEntities(
      recurringItem,
      currentUser,
      entityManager,
    );

    const mailData: IMailData = {
      toEmail: [userEntity.email],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Recurring Item Created',
    };

    const recurringItemCreatedTemplateData: IRecurringItemCreated = {
      name: recurringItem.name,
      type: recurringItem.type,
      companyName: recurringItem.companyName ?? undefined,
      servicePeriod: recurringItem.servicePeriod.toString(),
      servicePeriodUnit: recurringItem.servicePeriodUnit,
      userName: userEntity.name,
      year: DateCodeUtils.getCurrentYear(),
    };

    await this.mailService.sendNotification(
      EmailTemplate.RECURRING_ITEM_CREATED,
      mailData,
      recurringItemCreatedTemplateData,
    );
  }

  private async getSupportingEntities(
    recurringItem: IRecurringItemEntity,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ) {
    const userEntityInclude: IEntityFilterSearchData<EntityList.USER> = {
      name: EntityList.USER,
      include: {
        id: [recurringItem.userId],
        columnKeys: ['id', 'name', 'email'],
      },
    };

    const searchResponse = await this.searchV2(
      {
        id: [-1],
        entities: [userEntityInclude],
      },
      currentUser,
      entityManager,
    );

    const searchResHelper = new EntityFilterDataHelper(searchResponse);

    const userEntity = searchResHelper.getEntityModelByFilter(EntityList.USER, {
      key: 'id',
      value: recurringItem.userId,
    });
    return userEntity;
  }
}
