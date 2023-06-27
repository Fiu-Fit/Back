import { HttpService } from '@nestjs/axios';
import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerController } from '../../shared/server-controller';
import { Service } from '../../shared/service-config';
import { ServiceRegistryService } from './service-registry.service';

@ApiTags('Service Registry')
@Injectable()
@Controller('service-registry')
export class ServiceRegistryController extends ServerController {
  constructor(
    httpService: HttpService,
    private serviceRegistryService: ServiceRegistryService
  ) {
    super(httpService, 'service-registry');
  }

  @Get('name/:name')
  getServiceByName(@Param('name') name: string): Promise<Service> {
    return this.serviceRegistryService.getServiceByName(name);
  }

  @Get('verify-api-key/:apikey')
  verifyApiKey(@Param('apikey') apiKey: string): Promise<boolean> {
    return this.serviceRegistryService.verifyApiKey(apiKey);
  }
}
