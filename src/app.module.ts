import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import databaseConfig from './config/database.config';
import { DataBaseModule } from './config/database.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { RecurringItemModule } from './recurring-item/recurring-item.module';
import { ServiceModule } from './service/service.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DataBaseModule,
    SharedModule,
    UserModule,
    RecurringItemModule,
    AppointmentModule,
    ServiceModule,
    CronjobModule,
    NotificationModule,
    VendorModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
