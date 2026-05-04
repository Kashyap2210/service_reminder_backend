import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DateCodeUtils,
  EntityFilterDataHelper,
  EntityList,
  EntityType,
  IEntityFilterSearchData,
  IServiceEntity,
  IUserEntity,
  ServiceModel,
} from 'service_reminder_common';
import { MailService } from 'src/mail/services/mail.service';
import { IMailData } from 'src/mail/templates/template-interfaces/mail-data.interface';
import { IServiceCreated } from 'src/mail/templates/template-interfaces/service-created.interface';
import { EmailTemplate } from 'src/mail/utils/email-template.enum';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService, IEntityConfig } from 'src/shared/services/base.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { EntityManager } from 'typeorm';
import { ServiceCreateDto } from '../dtos/service.create.dto';
import { ServiceUpdateDto } from '../dtos/service.update.dto';
import { ServiceRepository } from '../repositories/service.repository';
import { IServiceCreateTransactionInputData } from '../transactions/interfaces/service-create-transaction.interface';
import { IServiceUpdateTransactionInputData } from '../transactions/interfaces/service-update-transaction.interface';
import { ServiceCreateTransaction } from '../transactions/service.create.transaction';
import { ServiceUpdateTransaction } from '../transactions/service.update.transaction';
import { ServiceHistoryService } from './service-history.service';

@Injectable()
export class ServiceService extends BaseService<EntityList.SERVICE> {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly mailService: MailService,
    private readonly envVariablesConfig: EnvVariablesConfig,
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

  getEntityConfig(): IEntityConfig<EntityType<EntityList.SERVICE>> {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
      [EntityList.RECURRING_ITEM]: {
        mappingProperty: 'recurringItemId',
        searchProperty: 'id',
      },
      [EntityList.APPOINTMENT]: {
        mappingProperty: 'appointmentId',
        searchProperty: 'id',
      },
      [EntityList.USER]: {
        mappingProperty: 'userId',
        searchProperty: 'id',
      },
      [EntityList.VENDOR]: {
        mappingProperty: 'vendorId',
        searchProperty: 'id',
      },
    };
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
    if (validationResult && Array.isArray(validationResult)) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }
    existingService = validationResult;
    const existingServiceEntityModel = ServiceModel.populateFromEntity(
      existingService!,
    );

    const nextStatus = existingServiceEntityModel.getNextStatus(
      currentUser,
      dto.action,
    );

    const data: IServiceUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(nextStatus),
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

  async sendServiceCreatedNotification(
    currentUser: IUserEntity,
    service: IServiceEntity,
    entityManager?: EntityManager,
  ): Promise<void> {
    const { userEntity, vendorEntity, recurringItemEntity } =
      await this.getSupportingEntities(service, currentUser, entityManager);

    const mailData: IMailData = {
      toEmail: [userEntity.email],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Service Created',
    };

    const serviceCreatedTemplateData: IServiceCreated = {
      serviceDate: new DateCodeUtils(service.serviceDate).toLongDateString(),
      serviceType: service.serviceType,
      serviceStatus: service.serviceStatus,
      vendorName: vendorEntity?.name || '',
      recurringItemName: recurringItemEntity?.name || '',
      serviceEstimate: service.serviceEstimate
        ? `${service.serviceEstimate}`
        : undefined,
      serviceAmount: service.serviceAmount ?? undefined,
      userName: userEntity.name,
      year: DateCodeUtils.getCurrentYear(),
    };

    await this.mailService.sendNotification(
      EmailTemplate.SERVICE_CREATED,
      mailData,
      serviceCreatedTemplateData,
    );
  }

  private async getSupportingEntities(
    service: IServiceEntity,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ) {
    const userEntityInclude: IEntityFilterSearchData<EntityList.USER> = {
      name: EntityList.USER,
      include: {
        id: [service.userId],
        columnKeys: ['id', 'name', 'email'],
      },
    };

    const vendorEntityInclude: IEntityFilterSearchData<EntityList.VENDOR> = {
      name: EntityList.VENDOR,
      include: {
        id: [service.vendorId],
        columnKeys: ['id', 'name'],
      },
    };

    const recurringItemEntityInclude: IEntityFilterSearchData<EntityList.RECURRING_ITEM> =
      {
        name: EntityList.RECURRING_ITEM,
        include: {
          id: [service.recurringItemId],
          columnKeys: ['id', 'name'],
        },
      };

    const searchResponse = await this.searchV2(
      {
        id: [-1],
        entities: [
          userEntityInclude,
          vendorEntityInclude,
          recurringItemEntityInclude,
        ],
      },
      currentUser,
      entityManager,
    );

    const searchResHelper = new EntityFilterDataHelper(searchResponse);

    const userEntity = searchResHelper.getEntityModelByFilter(EntityList.USER, {
      key: 'id',
      value: service.userId,
    });

    const vendorEntity = searchResHelper.getEntityModelByFilter(
      EntityList.VENDOR,
      {
        key: 'id',
        value: service.vendorId,
      },
    );

    const recurringItemEntity = searchResHelper.getEntityModelByFilter(
      EntityList.RECURRING_ITEM,
      {
        key: 'id',
        value: service.recurringItemId,
      },
    );
    return { userEntity, vendorEntity, recurringItemEntity };
  }
}
