import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { EditVerificationDto } from './dto';

@Injectable()
@Controller('verifications')
export class VerificationsController {
  private readonly entityName: string = 'verifications';

  constructor(private httpService: HttpService) {}

  @Post()
  public async addVerification(
    @Body('userId') userId: number,
    @Body('resourceId') resourceId: string
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, {
          userId,
          resourceId
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async getVerifications() {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async getVerification(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async updateVerification(
    @Param('id') id: string,
    @Body() verification: EditVerificationDto
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, verification)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get('user/:userId')
  async getVerificationByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/user/${userId}`)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }
}
