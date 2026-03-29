import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { CronJobController } from './controllers/cronjob.controller';
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
  ],
  providers: [
    CronJobService,
    CronJobRepository,
    CronJobCreateTransaction,
    CronJobUpdateTransaction,
  ],
  controllers: [CronJobController],
  exports: [CronJobService],
})
export class CronjobModule {}
