import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { RecurringItemModule } from 'src/recurring-item/recurring-item.module';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { ServiceController } from './controllers/service.controller';
import { ServiceHistoryEntity } from './entities/service-history.entity';
import { ServiceEntity } from './entities/service.entity';
import { ServiceHistoryRepository } from './repositories/service-history.repository';
import { ServiceRepository } from './repositories/service.repository';
import { ServiceHistoryService } from './services/service-history.service';
import { ServiceService } from './services/service.service';
import { ServiceCreateTransaction } from './transactions/service.create.transaction';
import { ServiceUpdateTransaction } from './transactions/service.update.transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity, ServiceHistoryEntity]),
    SharedModule,
    UserModule,
    RecurringItemModule,
    MailModule,
  ],
  providers: [
    ServiceService,
    ServiceRepository,
    ServiceHistoryService,
    ServiceHistoryRepository,
    ServiceCreateTransaction,
    ServiceUpdateTransaction,
    EnvVariablesConfig,
  ],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}
