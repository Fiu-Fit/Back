import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerController } from '../../shared/server-controller';

@ApiTags('Exercises')
@Injectable()
@Controller('exercises')
export class ExerciseController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'exercises');
  }
}
