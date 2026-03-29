import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { DataBaseModule } from './config/database.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ServiceModule } from './service/service.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { NotificationModule } from './notification/notification.module';
import { VendorModule } from './vendor/vendor.module';
import { RecurringItemModule } from './recurring-item/recurring-item.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
