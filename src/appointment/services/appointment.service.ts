import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AppointmentModel,
  DateCodeUtils,
  EntityList,
  EntityType,
  IAppointmentEntity,
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

  async sendAppointmentCreatedNotification(appointment: IAppointmentEntity) {
    const mailData: IMailData = {
      toEmail: [appointment.user.email],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Appointment Confirmation',
    };

    const formattedDate = new Date(
      appointment.appointmentDate,
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const appointmentCreatedTemplateData: IAppointmentCreated = {
      appointmentDate: formattedDate,
      appointmentType: appointment.appointmentType,
      appointmentStatus: appointment.appointmentStatus,
      vendorName: appointment.vendorId?.name || '',
      recurringItemName: appointment.recurringItem?.name,
      userName: appointment.user.name,
      year: DateCodeUtils.getCurrentYear(),
    };

    await this.mailService.sendNotification(
      EmailTemplate.APPOINTMENT_CREATED,
      mailData,
      appointmentCreatedTemplateData,
    );
  }
}
