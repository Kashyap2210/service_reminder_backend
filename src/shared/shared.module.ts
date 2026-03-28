import { Module } from '@nestjs/common';
import { RegistryService } from './services/registry.service';

@Module({
  providers: [RegistryService],
  exports: [RegistryService],
})
export class SharedModule {}
