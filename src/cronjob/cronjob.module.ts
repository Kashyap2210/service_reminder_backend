import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentNoShowCronJob } from 'src/appointment/cron/appointment-no-show.cron';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/services/mail.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { CronJobController } from './controllers/cronjob.controller';
import { NotificationDBEntites } from './cronjobs/notification-cronjob';
import { SendServiceReminderNotifications } from './cronjobs/send-notification-cronjob';
import { UserDeleteCronJob } from './cronjobs/user-delete-cronjob';
import { CronJobEntity } from './entities/cronjob.entity';
import { CronJobRepository } from './repositories/cronjob.repository';
import { CronJobService } from './services/cronjob.service';
import { CronJobCreateTransaction } from './transactions/cronjob.create.transaction';
import { CronJobUpdateTransaction } from './transactions/cronjob.update.transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([CronJobEntity]),
    SharedModule,
    UserModule,
    MailModule,
  ],
  providers: [
    CronJobService,
    CronJobRepository,
    CronJobCreateTransaction,
    CronJobUpdateTransaction,
    MailService,
    NotificationDBEntites,
    SendServiceReminderNotifications,
    EnvVariablesConfig,
    AppointmentNoShowCronJob,
    UserDeleteCronJob,
    EnvVariablesConfig,
  ],
  controllers: [CronJobController],
  exports: [CronJobService],
})
export class CronjobModule {}
