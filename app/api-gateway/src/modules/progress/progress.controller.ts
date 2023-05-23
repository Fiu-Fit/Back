import { HttpService } from '@nestjs/axios';
import { Controller, UseGuards } from '@nestjs/common';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('progress')
export class ProgressController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'progress');
  }
}
