import { AppointmentAction } from '../enums/appointment-action.enum';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { IFlowConfig } from './flow.generic.type';

export const appointmentFlowConfig: IFlowConfig<
  AppointmentStatus,
  AppointmentAction
> = {
  [AppointmentStatus.BOOKED]: {
    actions: {
      [AppointmentAction.EDIT]: { next: () => AppointmentStatus.BOOKED },
      [AppointmentAction.RE_SCHEDULE]: {
        next: () => AppointmentStatus.RE_SCHEDULED,
      },
      [AppointmentAction.CANCEL]: { next: () => AppointmentStatus.CANCELLED },
      [AppointmentAction.COMPLETE]: { next: () => AppointmentStatus.COMPLETED },
      [AppointmentAction.MARK_NO_SHOW]: {
        next: () => AppointmentStatus.NO_SHOW,
      },
    },
  },
  [AppointmentStatus.RE_SCHEDULED]: {
    actions: {
      [AppointmentAction.EDIT]: { next: () => AppointmentStatus.RE_SCHEDULED },
      [AppointmentAction.RE_SCHEDULE]: {
        next: () => AppointmentStatus.RE_SCHEDULED,
      },
      [AppointmentAction.CANCEL]: { next: () => AppointmentStatus.CANCELLED },
      [AppointmentAction.COMPLETE]: { next: () => AppointmentStatus.COMPLETED },
      [AppointmentAction.MARK_NO_SHOW]: {
        next: () => AppointmentStatus.NO_SHOW,
      },
    },
  },

  // --- terminal states — no actions allowed ---
  [AppointmentStatus.CANCELLED]: { actions: {} },
  [AppointmentStatus.COMPLETED]: { actions: {} },
  [AppointmentStatus.NO_SHOW]: { actions: {} },
};
