import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { RecurringItemController } from './controllers/recurring-item.controller';
import { RecurringItemHistoryEntity } from './entities/recurring-item-history.entity';
import { RecurringItemEntity } from './entities/recurring-item.entity';
import { RecurringItemHistoryRepository } from './repositories/recurring-item-history.repository';
import { RecurringItemRepository } from './repositories/recurring-item.repository';
import { RecurringItemHistoryService } from './services/recurring-item-history.service';
import { RecurringItemService } from './services/recurring-item.service';
import { RecurringItemCreateTransaction } from './transactions/recurring-item.create.transaction';
import { RecurringItemUpdateTransaction } from './transactions/recurring-item.update.transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecurringItemEntity, RecurringItemHistoryEntity]),
    SharedModule,
    UserModule,
    MailModule,
  ],
  providers: [
    RecurringItemService,
    RecurringItemRepository,
    RecurringItemHistoryService,
    RecurringItemHistoryRepository,
    RecurringItemCreateTransaction,
    RecurringItemUpdateTransaction,
    EnvVariablesConfig,
  ],
  controllers: [RecurringItemController],
  exports: [RecurringItemService],
})
export class RecurringItemModule {}
