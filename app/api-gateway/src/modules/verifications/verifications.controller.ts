import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ServerController } from '../../shared/server-controller';

@Injectable()
@Controller('verifications')
export class VerificationsController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'verifications');
  }
}
