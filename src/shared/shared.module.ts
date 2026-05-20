import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { EntityController } from './controllers/entity.controller';
import { EnvVariablesConfig } from './services/env-variables-config.service';
import { RegistryService } from './services/registry.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [EntityController],
  providers: [RegistryService, EnvVariablesConfig],
  exports: [RegistryService, EnvVariablesConfig],
})
export class SharedModule {}
