import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ServerController } from '../../shared/server-controller';

@Injectable()
@Controller('service-registry')
export class ServiceRegistryController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'service-registry');
  }
}
