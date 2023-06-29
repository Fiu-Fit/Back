import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerController } from '../../shared/server-controller';
import { Rating } from './dto/rating.dto';

// import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Ratings')
@Injectable()
@Controller('ratings')
export class RatingController extends ServerController<Rating> {
  constructor(httpService: HttpService) {
    super(httpService, 'ratings');
  }
}
