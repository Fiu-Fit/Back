import { HttpModuleOptions } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ServiceRegistryService } from '../modules/service-registry/service-registry.service';

export const ServiceName = {
  Workout:         'workout',
  User:            'user',
  Progress:        'progress',
  ServiceRegistry: 'serviceRegistry'
};

export const ServiceUrl: Record<string, string> = {
  workout:       'WORKOUT_SERVICE_URL',
  user:          'USER_SERVICE_URL',
  progress:      'PROGRESS_SERVICE_URL',
  goals:         'PROGRESS_SERVICE_URL',
  ratings:       'USER_SERVICE_URL',
  followers:     'USER_SERVICE_URL',
  notifications: 'USER_SERVICE_URL'
};

export type Service = {
  id: number;
  apiKey: string;
};

@Injectable()
export class ServiceConfig {
  static async createHttpModuleOptionsFromService(
    serviceRegistryService: ServiceRegistryService,
    serviceName: string
  ): Promise<HttpModuleOptions> {
    const { apiKey } = await serviceRegistryService.getServiceByName(
      serviceName
    );

    const baseURL = process.env[ServiceUrl[serviceName]];

    return Promise.resolve({
      headers: {
        'Api-Key': apiKey
      },
      baseURL
    });
  }
}
