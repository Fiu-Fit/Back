import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceConfig, ServiceName } from '../../shared/service-config';
import { ServiceRegistryModule } from '../service-registry/service-registry.module';
import { ServiceRegistryService } from '../service-registry/service-registry.service';
import { ExerciseController } from './exercise.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports:    [ServiceRegistryModule, HttpModule],
      useFactory: (serviceRegistryService: ServiceRegistryService) => {
        return ServiceConfig.createHttpModuleOptionsFromService(
          serviceRegistryService,
          ServiceName.Workout
        );
      },
      inject: [ServiceRegistryService]
    })
  ],
  controllers: [ExerciseController]
})
export class ExerciseModule {}
