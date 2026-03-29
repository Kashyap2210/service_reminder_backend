import { BadRequestException, Injectable } from '@nestjs/common';
import { IAppointmentEntity } from 'src/common/interfaces/entities/appointment.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { AppointmentCreateDto } from '../dtos/appointment.create.dto';
import { AppointmentUpdateDto } from '../dtos/appointment.update.dto';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { AppointmentCreateTransaction } from '../transactions/appointment.create.transaction';
import { AppointmentUpdateTransaction } from '../transactions/appointment.update.transaction';
import { IAppointmentCreateTransactionInputData } from '../transactions/interfaces/appointment-create-transaction.interface';
import { IAppointmentUpdateTransactionInputData } from '../transactions/interfaces/appointment-update-transaction.interface';
import { AppointmentHistoryService } from './appointment-history.service';

@Injectable()
export class AppointmentService extends BaseService<EntityList.APPOINTMENT> {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentCreateTransaction: AppointmentCreateTransaction,
    private readonly appointmentUpdateTransaction: AppointmentUpdateTransaction,
  ) {
    super(EntityList.APPOINTMENT);
  }

  get appointmentHistoryService(): AppointmentHistoryService {
    return this.registryService.get(
      EntityList.APPOINTMENT_HISTORY,
    ) as AppointmentHistoryService;
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.APPOINTMENT> {
    return this.appointmentRepository;
  }

  async createAppointment(
    currentUser: IUserEntity,
    dto: AppointmentCreateDto,
    entityManager?: EntityManager,
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
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.APPOINTMENT>> {
    let existingAppointment: IAppointmentEntity | null = null;
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
        existingAppointment = validationResult;
      }
    }

    const data: IAppointmentUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(),
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
}
