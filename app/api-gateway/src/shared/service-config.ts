import { HttpModuleOptions } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ServiceRegistryService } from '../modules/service-registry/service-registry.service';

export const ServiceName = {
  Workout:         'workout',
  User:            'user',
  Progress:        'progress',
  Goals:           'goals',
  Ratings:         'ratings',
  Followers:       'followers',
  Notifications:   'notifications',
  ServiceRegistry: 'serviceRegistry'
};

export type Service = {
  id: number;
  apiKey: string;
  url: string;
};

@Injectable()
export class ServiceConfig {
  static async createHttpModuleOptionsFromService(
    serviceRegistryService: ServiceRegistryService,
    serviceName: string
  ): Promise<HttpModuleOptions> {
    const { apiKey, url: baseURL } =
      await serviceRegistryService.getServiceByName(serviceName);

    return Promise.resolve({
      headers: {
        'Api-Key': apiKey
      },
      baseURL
    });
  }
}
