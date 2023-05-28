import { HttpModuleOptions } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceRegistryService } from '../modules/service-registry/service-registry.service';

export const ServiceName = {
  Workout:         'workout',
  User:            'user',
  Progress:        'progress',
  ServiceRegistry: 'serviceRegistry'
};

export const ServiceApiKeys: Record<string, string> = {
  workout:         'WORKOUT_API_KEY',
  user:            'USER_API_KEY',
  progress:        'PROGRESS_API_KEY',
  serviceRegistry: 'SERVICE_REGISTRY_API_KEY'
};

export const ServiceUrl: Record<string, string> = {
  workout:         'WORKOUT_SERVICE_URL',
  user:            'USER_SERVICE_URL',
  progress:        'PROGRESS_SERVICE_URL',
  serviceRegistry: 'SERVICE_REGISTRY_URL'
};

export type Service = {
  id: number;
  apiKey: string;
  name: string;
  url: string;
  description: string;
  status: ServiceStatus;
};

export enum ServiceStatus {
  Available = 'Available',
  Blocked = 'Blocked'
}

@Injectable()
export class ServiceConfig {
  constructor(private serviceRegistryService: ServiceRegistryService) {}

  static createHttpModuleOptions(
    serviceName: string,
    configService: ConfigService
  ): Promise<HttpModuleOptions> {
    const apiKey = configService.get<string>(ServiceApiKeys[serviceName]);
    const baseURL = configService.get<string>(ServiceUrl[serviceName]);

    return Promise.resolve({
      headers: {
        'Api-Key': apiKey
      },
      baseURL
    });
  }

  static async createHttpModuleOptionsFromService(
    serviceRegistryService: ServiceRegistryService,
    serviceName: string
  ): Promise<HttpModuleOptions> {
    const service = await serviceRegistryService.getServiceByName(serviceName);

    return Promise.resolve({
      headers: {
        'Api-Key': service.apiKey
      },
      baseURL: service.url
    });
  }
}
