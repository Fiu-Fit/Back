import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ServerController } from '../../shared/server-controller';

@Injectable()
@Controller('workouts')
export class WorkoutController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'workouts');
  }
}
