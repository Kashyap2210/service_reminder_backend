import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AppointmentModel,
  DateCodeUtils,
  EntityFilterDataHelper,
  EntityList,
  EntityType,
  IAppointmentEntity,
  IEntityFilterIncludeData,
  IUserEntity,
} from 'service_reminder_common';
import { MailService } from 'src/mail/services/mail.service';
import { IAppointmentCreated } from 'src/mail/templates/template-interfaces/appointment-created.interface';
import { IMailData } from 'src/mail/templates/template-interfaces/mail-data.interface';
import { EmailTemplate } from 'src/mail/utils/email-template.enum';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { EntityManager } from 'typeorm';
import { AppointmentCreateDto } from '../dtos/appointment.create.dto';
import { AppointmentUpdateDto } from '../dtos/appointment.update.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { AppointmentCreateTransaction } from '../transactions/appointment.create.transaction';
import { AppointmentUpdateTransaction } from '../transactions/appointment.update.transaction';
import { IAppointmentCreateTransactionInputData } from '../transactions/interfaces/appointment-create-transaction.interface';
import { IAppointmentUpdateTransactionInputData } from '../transactions/interfaces/appointment-update-transaction.interface';

@Injectable()
export class AppointmentService extends BaseService<EntityList.APPOINTMENT> {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly mailService: MailService,
    private readonly envVariablesConfig: EnvVariablesConfig,

    private readonly appointmentCreateTransaction: AppointmentCreateTransaction,
    private readonly appointmentUpdateTransaction: AppointmentUpdateTransaction,
  ) {
    super(EntityList.APPOINTMENT);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.APPOINTMENT> {
    return this.appointmentRepository;
  }

  async createAppointment(
    currentUser: IUserEntity,
    dto: AppointmentCreateDto,
  ): Promise<EntityType<EntityList.APPOINTMENT>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: IAppointmentCreateTransactionInputData = {
      dto: dto.toCreateDto(),
      currentUser,
    };

    return this.appointmentCreateTransaction.run(data);
  }

  async updateAppointment(
    id: number,
    currentUser: IUserEntity,
    dto: AppointmentUpdateDto,
  ): Promise<EntityType<EntityList.APPOINTMENT>> {
    let existingAppointment: IAppointmentEntity | null = null;
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
      id,
    );
    if (validationResult && Array.isArray(validationResult)) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }
    existingAppointment = validationResult;

    const existingAppointmentEntityModel = AppointmentModel.populateFromEntity(
      existingAppointment!,
    );
    const nextStatus = existingAppointmentEntityModel.getNextStatus(
      currentUser,
      dto.action,
    );

    const data: IAppointmentUpdateTransactionInputData = {
      id,
      dto: {
        ...dto.toUpdateDto(nextStatus),
      },
      currentUser,
      existingEntity: existingAppointment!, // <== Appointment will always be there as we throw error from dto
    };

    return this.appointmentUpdateTransaction.run(data);
  }

  async deleteAppointment(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.appointmentRepository.deleteById(id, entityManager);
  }

  async sendAppointmentCreatedNotification(
    currentUser: IUserEntity,
    appointment: IAppointmentEntity,
    entityManager?: EntityManager,
  ): Promise<void> {
    const { userEntity, vendorEntity, recurringItemEntity } =
      await this.getSupportingEntities(appointment, currentUser, entityManager);

    const mailData: IMailData = {
      toEmail: [userEntity.email],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Appointment Confirmation',
    };

    const formattedDate = new DateCodeUtils(
      appointment.appointmentDate,
    ).toLongDateString();

    const appointmentCreatedTemplateData: IAppointmentCreated = {
      appointmentDate: formattedDate,
      appointmentType: appointment.appointmentType,
      appointmentStatus: appointment.appointmentStatus,
      vendorName: vendorEntity.name || '',
      vendorAddress: vendorEntity.address || '',
      recurringItemName: recurringItemEntity.name,
      userName: userEntity.name,
      year: DateCodeUtils.getCurrentYear(),
    };

    await this.mailService.sendNotification(
      EmailTemplate.APPOINTMENT_CREATED,
      mailData,
      appointmentCreatedTemplateData,
    );
  }

  private async getSupportingEntities(
    appointment: IAppointmentEntity,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ) {
    const userEntityInclude: IEntityFilterIncludeData<EntityList.USER> = {
      name: EntityList.USER,
      include: {
        id: [appointment.userId],
        columnKeys: ['id', 'name', 'email'],
      },
    };

    const vendorEntityInclude: IEntityFilterIncludeData<EntityList.VENDOR> = {
      name: EntityList.VENDOR,
      include: {
        id: [appointment.vendorId],
        columnKeys: ['id', 'name', 'address'],
      },
    };

    const recurringItemEntityInclude: IEntityFilterIncludeData<EntityList.RECURRING_ITEM> =
      {
        name: EntityList.RECURRING_ITEM,
        include: {
          id: [appointment.recurringItemId],
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
    // console.log('searchResHelper', searchResHelper);
    const userEntity = searchResHelper.getEntityModelByFilter(EntityList.USER, {
      key: 'id',
      value: appointment.userId,
    });
    // console.log('userEntity', userEntity);
    const vendorEntity = searchResHelper.getEntityModelByFilter(
      EntityList.VENDOR,
      {
        key: 'id',
        value: appointment.vendorId,
      },
    );

    const recurringItemEntity = searchResHelper.getEntityModelByFilter(
      EntityList.RECURRING_ITEM,
      {
        key: 'id',
        value: appointment.recurringItemId,
      },
    );
    return { userEntity, vendorEntity, recurringItemEntity };
  }
}
