import { ServiceAction } from '../enums/service-action.enum';
import { ServiceStatus } from '../enums/service-status.enum';
import { IFlowConfig } from './flow.generic.type';

export type IServiceFlowConfig = IFlowConfig<ServiceStatus, ServiceAction>;

export const serviceFlowConfig: IServiceFlowConfig = {
  [ServiceStatus.SCHEDULED]: {
    actions: {
      [ServiceAction.EDIT]: {
        next: () => ServiceStatus.SCHEDULED,
      },
      [ServiceAction.START]: {
        next: () => ServiceStatus.SERVICE_STARTED,
      },
      [ServiceAction.CANCEL]: {
        next: () => ServiceStatus.CANCELLED,
      },
    },
  },

  [ServiceStatus.SERVICE_STARTED]: {
    actions: {
      [ServiceAction.EDIT]: {
        next: () => ServiceStatus.SERVICE_STARTED,
      },
      [ServiceAction.COMPLETE]: {
        next: () => ServiceStatus.COMPLETED,
      },
      [ServiceAction.FAIL]: {
        next: () => ServiceStatus.FAILED,
      },
      [ServiceAction.CANCEL]: {
        next: () => ServiceStatus.CANCELLED,
      },
    },
  },

  [ServiceStatus.COMPLETED]: {
    actions: {},
  },

  [ServiceStatus.CANCELLED]: {
    actions: {},
  },

  [ServiceStatus.FAILED]: {
    actions: {},
  },
};
