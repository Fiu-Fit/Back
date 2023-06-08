import { HttpModuleOptions } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const ServiceName = {
  Workout:       'workout',
  User:          'user',
  Progress:      'progress',
  Goals:         'goals',
  Ratings:       'ratings',
  Followers:     'followers',
  Notifications: 'notifications'
};

export const ServiceApiKeys: Record<string, string> = {
  workout:       'WORKOUT_API_KEY',
  user:          'USER_API_KEY',
  progress:      'PROGRESS_API_KEY',
  goals:         'GOALS_API_KEY',
  ratings:       'RATINGS_API_KEY',
  followers:     'USER_API_KEY',
  notifications: 'USER_API_KEY'
};

export const ServiceUrl: Record<string, string> = {
  workout:       'WORKOUT_SERVICE_URL',
  user:          'USER_SERVICE_URL',
  progress:      'PROGRESS_SERVICE_URL',
  goals:         'GOALS_SERVICE_URL',
  ratings:       'RATINGS_SERVICE_URL',
  followers:     'USER_SERVICE_URL',
  notifications: 'USER_SERVICE_URL'
};

@Injectable()
export class ServiceConfig {
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
}
