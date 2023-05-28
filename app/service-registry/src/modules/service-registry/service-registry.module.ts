import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceRegistryController } from './service-registry.controller';
import { ServiceRegistryService } from './service-registry.service';

@Module({
  imports:     [ConfigModule.forRoot()],
  exports:     [],
  providers:   [ServiceRegistryService],
  controllers: [ServiceRegistryController]
})
export class ServiceRegistryModule {}
