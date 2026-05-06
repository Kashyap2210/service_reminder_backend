import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/services/mail.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { CronJobController } from './controllers/cronjob.controller';
import { NotificationDBEntites } from './cronjobs/notification-cronjob';
import { SendServiceReminderNotifications } from './cronjobs/send-notification-cronjob';
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
  ],
  controllers: [CronJobController],
  exports: [CronJobService],
})
export class CronjobModule {}
