import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DateCodeUtils,
  EntityList,
  EntityType,
  IServiceEntity,
  IUserEntity,
  ServiceModel,
} from 'service_reminder_common';
import { MailService } from 'src/mail/services/mail.service';
import { IMailData } from 'src/mail/templates/template-interfaces/mail-data.interface';
import { IServiceCreated } from 'src/mail/templates/template-interfaces/service-created.interface';
import { EmailTemplate } from 'src/mail/utils/email-template.enum';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
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

  async sendServiceCreatedNotification(service: IServiceEntity) {
    const mailData: IMailData = {
      toEmail: [service.user.email],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Service Created',
    };

    const formattedDate = new Date(service.serviceDate).toLocaleDateString(
      'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' },
    );

    const serviceCreatedTemplateData: IServiceCreated = {
      serviceDate: formattedDate,
      serviceType: service.serviceType,
      serviceStatus: service.serviceStatus,
      vendorName: service.vendor?.name || '',
      recurringItemName: service.recurringItem?.name,
      serviceEstimate: service.serviceEstimate,
      serviceAmount: service.serviceAmount,
      userName: service.user.name,
      year: DateCodeUtils.getCurrentYear(),
    };

    await this.mailService.sendNotification(
      EmailTemplate.SERVICE_CREATED,
      mailData,
      serviceCreatedTemplateData,
    );
  }
}
