import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceRegistryController } from './service-registry.controller';
import { ServiceRegistryService } from './service-registry.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: process.env.SERVICE_REGISTRY_URL
    })
  ],
  controllers: [ServiceRegistryController],
  providers:   [ServiceRegistryService],
  exports:     [ServiceRegistryService]
})
export class ServiceRegistryModule {}
