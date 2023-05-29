import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceConfig, ServiceName } from '../../shared/service-config';
import { ServiceRegistryController } from './service-registry.controller';
import { ServiceRegistryService } from './service-registry.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports:    [ServiceRegistryModule, HttpModule],
      useFactory: (serviceRegistryService: ServiceRegistryService) => {
        return ServiceConfig.createHttpModuleOptionsFromService(
          serviceRegistryService,
          ServiceName.User
        );
      },
      inject: [ServiceRegistryService]
    })
  ],
  controllers: [ServiceRegistryController],
  providers:   [ServiceRegistryService],
  exports:     [ServiceRegistryService]
})
export class ServiceRegistryModule {}
