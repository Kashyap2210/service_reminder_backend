import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringItemModule } from 'src/recurring-item/recurring-item.module';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { NotificationController } from './controllers/notification.controller';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './services/notification.service';
import { NotificationCreateTransaction } from './transactions/notification.create.transaction';
import { NotificationUpdateTransaction } from './transactions/notification.update.transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    SharedModule,
    UserModule,
    RecurringItemModule,
  ],
  providers: [
    NotificationService,
    NotificationRepository,
    NotificationCreateTransaction,
    NotificationUpdateTransaction,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
