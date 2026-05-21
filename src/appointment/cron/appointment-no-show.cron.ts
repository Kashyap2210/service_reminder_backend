import { Injectable, Logger } from '@nestjs/common';
import {
  AppointmentStatus,
  DateCodeUtils,
  EntityList,
  IUserEntity,
} from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { UserService } from 'src/user/services/user.service';
import { EntityManager } from 'typeorm';
import { AppointmentService } from '../services/appointment.service';

@Injectable()
export class AppointmentNoShowCronJob {
  private readonly logger = new Logger(AppointmentNoShowCronJob.name);

  constructor(private readonly registryService: RegistryService) {}

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
  }

  get appointmentService(): AppointmentService {
    return this.registryService.get(
      EntityList.APPOINTMENT,
    ) as AppointmentService;
  }

  async updateNoShowCronJobBulk(
    systemUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<void> {
    const cutoffDateCode = Number(
      new DateCodeUtils(DateCodeUtils.getCurrentDateCode()).addDays(-7),
    );

    const appointmentsToBeBookedWithNoShow =
      (
        await this.appointmentService.searchV2(
          {
            include: {
              appointmentStatus: [
                AppointmentStatus.BOOKED,
                AppointmentStatus.RE_SCHEDULED,
              ],
            },
          },
          systemUser,
          entityManager,
        )
      )[EntityList.APPOINTMENT] ?? [];

    if (appointmentsToBeBookedWithNoShow.length === 0) return;

    const filteredAppointmentsToBeBookedWithNoShow =
      appointmentsToBeBookedWithNoShow.filter(
        (entity) => entity.appointmentDate < cutoffDateCode,
      );

    await this.appointmentService.updateAppointmentBulk(
      systemUser,
      filteredAppointmentsToBeBookedWithNoShow,
    );
  }
}
