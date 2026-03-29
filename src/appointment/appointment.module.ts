import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { AppointmentController } from './controllers/appointment.controller';
import { AppointmentHistoryEntity } from './entities/appointment-history.entity';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentHistoryRepository } from './repositories/appointment-history.repository';
import { AppointmentRepository } from './repositories/appointment.repository';
import { AppointmentHistoryService } from './services/appointment-history.service';
import { AppointmentService } from './services/appointment.service';
import { AppointmentCreateTransaction } from './transactions/appointment.create.transaction';
import { AppointmentUpdateTransaction } from './transactions/appointment.update.transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity, AppointmentHistoryEntity]),
    SharedModule,
    UserModule,
  ],
  providers: [
    AppointmentService,
    AppointmentRepository,
    AppointmentHistoryService,
    AppointmentHistoryRepository,
    AppointmentCreateTransaction,
    AppointmentUpdateTransaction,
  ],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
