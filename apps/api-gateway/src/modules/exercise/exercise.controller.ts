import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ServerController } from '../../shared/server-controller';

@Injectable()
@Controller('exercises')
export class ExerciseController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'exercises');
  }
}
