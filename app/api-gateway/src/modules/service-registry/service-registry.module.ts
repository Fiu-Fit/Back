import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceConfig, ServiceName } from '../../shared/service-config';
import { ServiceRegistryController } from './service-registry.controller';
import { ServiceRegistryService } from './service-registry.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports:    [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ServiceConfig.createHttpModuleOptions(
          ServiceName.ServiceRegistry,
          configService
        ),
      inject: [ConfigService]
    })
  ],
  controllers: [ServiceRegistryController],
  providers:   [ServiceRegistryService],
  exports:     [ServiceRegistryService]
})
export class ServiceRegistryModule {}
