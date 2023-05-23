import { HttpService } from '@nestjs/axios';
import { Controller, Injectable, UseGuards } from '@nestjs/common';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
@UseGuards(AuthGuard)
@Controller('goals')
export class GoalController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'goals');
  }
}
