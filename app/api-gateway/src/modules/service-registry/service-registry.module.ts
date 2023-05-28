import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceConfig, ServiceName } from '../../shared/service-config';
import { ServiceRegistryController } from './service-registry.controller';

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
  controllers: [ServiceRegistryController]
})
export class ServiceRegistryModule {}
