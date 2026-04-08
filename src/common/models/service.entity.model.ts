import { BadRequestException } from '@nestjs/common';
import { AppointmentType } from '../enums/appointment-type.enum';
import { ServiceAction } from '../enums/service-action.enum';
import { ServiceStatus } from '../enums/service-status.enum';
import { serviceFlowConfig } from '../flow-configs/service-flow.config';
import { IServiceEntity } from '../interfaces/entities/service.entity.interface';
import { IUserEntity } from '../interfaces/entities/user.entity.interface';
import { Nullable } from '../types/types.generic';

export class ServiceModel implements IServiceEntity {
  id: number;
  appointmentId: number;
  userId: number;
  vendorId: number;
  serviceStatus: ServiceStatus;
  serviceDate: number;
  recurringItemId: number;
  serviceType: AppointmentType;
  serviceEstimate: Nullable<number>;
  serviceAmount: Nullable<number>;
  invoiceDocument: Nullable<string>;

  // Audit fields
  createdOn: number;
  updatedOn: number;
  createdBy: number;
  updatedBy: number;

  private constructor() {}

  static fromEntity(entity: IServiceEntity): ServiceModel {
    return Object.assign(new ServiceModel(), entity);
  }

  getNextStatus(
    currentUser: IUserEntity,
    action: ServiceAction,
  ): ServiceStatus {
    // Only creator can update
    if (this.createdBy !== currentUser.id) {
      throw new BadRequestException({
        key: 'createdBy',
        message: `Service can only be updated by the user who created it.`,
      });
    }

    if (action === undefined || action === null) {
      throw new BadRequestException({
        key: 'action',
        message: `Action is required.`,
      });
    }

    const flowConfigForCurrentStatus = serviceFlowConfig[this.serviceStatus];

    if (!flowConfigForCurrentStatus) {
      throw new BadRequestException({
        key: 'serviceStatus',
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
