import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  EntityList,
  EntityType,
  ICronJobEntity,
  IUserEntity,
} from 'service_reminder_common';
import { AppointmentNoShowCronJob } from 'src/appointment/cron/appointment-no-show.cron';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService, IEntityConfig } from 'src/shared/services/base.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { UserService } from 'src/user/services/user.service';
import { EntityManager } from 'typeorm';
import { NotificationDBEntites } from '../cronjobs/notification-cronjob';
import { SendServiceReminderNotifications } from '../cronjobs/send-notification-cronjob';
import { CronJobCreateDto } from '../dtos/cronjob.create.dto';
import { CronJobUpdateDto } from '../dtos/cronjob.update.dto';
import { CronJobRepository } from '../repositories/cronjob.repository';
import { CronJobCreateTransaction } from '../transactions/cronjob.create.transaction';
import { CronJobUpdateTransaction } from '../transactions/cronjob.update.transaction';
import { ICronJobCreateTransactionInputData } from '../transactions/interfaces/cronjob-create-transaction.interface';
import { ICronJobUpdateTransactionInputData } from '../transactions/interfaces/cronjob-update-transaction.interface';

@Injectable()
export class CronJobService extends BaseService<EntityList.CRONJOB> {
  private readonly logger = new Logger(CronJobService.name);

  constructor(
    private readonly cronJobRepository: CronJobRepository,
    private readonly cronJobCreateTransaction: CronJobCreateTransaction,
    private readonly cronJobUpdateTransaction: CronJobUpdateTransaction,

    // private readonly mailService: MailService,
    private readonly sendServiceReminderNotifications: SendServiceReminderNotifications, // ← inject
    private readonly notificationDBEntities: NotificationDBEntites, // ← inject
    private readonly appointmentNoShowCronJob: AppointmentNoShowCronJob,

    private readonly envVariablesConfig: EnvVariablesConfig,
  ) {
    super(EntityList.CRONJOB);
  }

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.CRONJOB> {
    return this.cronJobRepository;
  }

  getEntityConfig(): IEntityConfig<EntityType<EntityList.CRONJOB>> {
    return {
      // [EntityList.XYZ]: { mappingProperty: 'xyzId', searchProperty: 'id' }
    };
  }

  get sendNotifications(): boolean {
    return this.envVariablesConfig.sendNotifications;
  }

  @Cron('0-58/2 * * * *') // even minutes (0, 2, 4, 6, 8...)
  async runNotificationJob() {
    if (this.sendNotifications) {
      this.logger.log('[runNotificationJob] Cron triggered');
      const currentUser = await this.userService.getSystemUser();
      await this.notificationDBEntities.prepareNotificationEntities();
    }
  }

  @Cron('1-59/2 * * * *') // odd minutes (1, 3, 5, 7, 9...)
  async runSendNotificationsJob() {
    if (this.sendNotifications) {
      this.logger.log('[runSendNotificationsJob] Cron triggered');
      const currentUser = await this.userService.getSystemUser();
      await this.sendServiceReminderNotifications.processAndSendNotifications(
        currentUser,
      );
    }
  }

  @Cron('0 0 10 * *')
  async runNoShowAppointmentCronJob() {
    if (this.sendNotifications) {
      this.logger.log('[runNoShowAppointmentCronJob] Cron triggered');
      const currentUser = await this.userService.getSystemUser();
      await this.appointmentNoShowCronJob.updateNoShowCronJobBulk(currentUser);
    }
  }

  async createCronJob(
    currentUser: IUserEntity,
    dto: CronJobCreateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.CRONJOB>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: ICronJobCreateTransactionInputData = {
      dto: dto.toCreateDto(),
      currentUser,
    };

    return this.cronJobCreateTransaction.run(data);
  }

  async updateCronJob(
    id: number,
    currentUser: IUserEntity,
    dto: CronJobUpdateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.CRONJOB>> {
    let existing: ICronJobEntity | null = null;
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
        existing = validationResult;
      }
    }

    const data: ICronJobUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(),
      currentUser,
      existingEntity: existing!,
    };

    return this.cronJobUpdateTransaction.run(data);
  }

  async deleteCronJob(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.cronJobRepository.deleteById(id, entityManager);
  }
}
