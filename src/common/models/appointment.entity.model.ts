import { BadRequestException } from '@nestjs/common';
import { AppointmentAction } from '../enums/appointment-action.enum';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { AppointmentType } from '../enums/appointment-type.enum';
import { appointmentFlowConfig } from '../flow-configs/appointment-flow.config';
import { IAppointmentEntity } from '../interfaces/entities/appointment.entity.interface';
import { IUserEntity } from '../interfaces/entities/user.entity.interface';
import { Nullable } from '../types/types.generic';

export class AppointmentModel implements IAppointmentEntity {
  id: number;
  appointmentDate: number;
  recurringItemId: number;
  userId: number;
  appointmentType: AppointmentType;
  vendorId: number;
  appointmentStatus: AppointmentStatus;
  checkPoints: Nullable<string>;

  createdOn: number;
  updatedOn: number;
  createdBy: number;
  updatedBy: number;

  private constructor() {}

  static fromEntity(entity: IAppointmentEntity): AppointmentModel {
    return Object.assign(new AppointmentModel(), entity);
  }

  getNextStatus(currentUser: IUserEntity, action: AppointmentAction) {
    // status change only allowed for currentuser
    if (this.createdBy !== currentUser.id) {
      throw new BadRequestException({
        key: 'createdBy',
        message: `Appointment can only be updated by the user who created it.`,
      });
    }

    if (!action || action === undefined || action === null) {
      throw new BadRequestException({
        key: 'action',
        message: `Action is required.`,
      });
    }

    const flowConfigForCurrentStatus =
      appointmentFlowConfig[this.appointmentStatus];
    if (!flowConfigForCurrentStatus) {
      throw new BadRequestException({
        key: 'appointmentStatus',
        message: `No config found for current status.`,
      });
    }

    const actionConfig = flowConfigForCurrentStatus.actions[action];
    if (!actionConfig) {
      throw new BadRequestException({
        key: 'action',
        message: `No config found for action: ${action} for current status.`,
      });
    }

    return actionConfig.next();
  }
}
