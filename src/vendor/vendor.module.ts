import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringItemModule } from 'src/recurring-item/recurring-item.module';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { VendorController } from './controllers/vendor.controller';
import { VendorHistoryEntity } from './entities/vendor-history.entity';
import { VendorRecurringItemMappingEntity } from './entities/vendor-recurring-item-mapping.entity';
import { VendorEntity } from './entities/vendor.entity';
import { VendorHistoryRepository } from './repositories/vendor-history.repository';
import { VendorRecurringItemMappingRepository } from './repositories/vendor-recurring-item-mapping.repository';
import { VendorRepository } from './repositories/vendor.repository';
import { VendorHistoryService } from './services/vendor-history.service';
import { VendorRecurringItemMappingService } from './services/vendor-recurring-item-mapping.service';
import { VendorService } from './services/vendor.service';
import { VendorCreateTransaction } from './transactions/vendor.create.transaction';
import { VendorUpdateTransaction } from './transactions/vendor.update.transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorEntity,
      VendorHistoryEntity,
      VendorRecurringItemMappingEntity,
    ]),
    SharedModule,
    UserModule,
    RecurringItemModule,
  ],
  providers: [
    VendorService,
    VendorRepository,
    VendorHistoryService,
    VendorHistoryRepository,
    VendorCreateTransaction,
    VendorUpdateTransaction,
    VendorRecurringItemMappingService,
    VendorRecurringItemMappingRepository,
  ],
  controllers: [VendorController],
  exports: [VendorService],
})
export class VendorModule {}
