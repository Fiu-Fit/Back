import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerController } from '../../shared/server-controller';

@ApiTags('Verifications')
@Injectable()
@Controller('verifications')
export class VerificationsController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'verifications');
  }
}
