import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ServerController } from '../../shared/server-controller';
// import { AuthGuard } from '../auth/auth.guard';

@Injectable()
@Controller('ratings')
export class RatingController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'ratings');
  }
}
