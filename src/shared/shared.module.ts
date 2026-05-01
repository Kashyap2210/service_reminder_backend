import { Module } from '@nestjs/common';
import { EnvVariablesConfig } from './services/env-variables-config.service';
import { RegistryService } from './services/registry.service';

@Module({
  providers: [RegistryService, EnvVariablesConfig],
  exports: [RegistryService, EnvVariablesConfig],
})
export class SharedModule {}
