import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  Injectable,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { ServerController } from '../../shared/server-controller';

@Injectable()
@Controller('verifications')
export class VerificationsController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'verifications');
  }

  @Get('user/:userId')
  async getVerificationByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get('/verifications/user/' + userId)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }
}
