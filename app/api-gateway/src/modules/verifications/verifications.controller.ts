import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerController } from '../../shared/server-controller';
import { Verification } from './dto/verification.dto';

@ApiTags('Verifications')
@Injectable()
@Controller('verifications')
export class VerificationsController extends ServerController<Verification> {
  constructor(httpService: HttpService) {
    super(httpService, 'verifications');
  }
}
