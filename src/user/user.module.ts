import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { UserController } from './controllers/user.controller';
import { UserHistoryEntity } from './entities/user-history.entity';
import { UserEntity } from './entities/user.entity';
import { UserHistoryRepository } from './repositories/user-history.repository';
import { UserRepository } from './repositories/user.repository';
import { UserHistoryService } from './services/user-history.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserHistoryEntity]),
    SharedModule,
    AuthModule,
  ],
  providers: [
    UserService,
    UserRepository,
    UserHistoryService,
    UserHistoryRepository,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
