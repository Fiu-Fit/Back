import { Page } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { User } from '../user/interfaces/user.interface';
import { GetAuthMetricsQueryDTO, GetUserMetricsQueryDTO } from './dto';

@Controller('metrics')
export class MetricsController {
  private readonly entityName: string = 'metrics';

  constructor(private httpService: HttpService) {}

  @Get('login')
  async getLoginMetrics(
    @Headers('Authorization') authToken: string,
    @Query() filter: GetAuthMetricsQueryDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Page<User>>(`${this.entityName}/login`, {
          params:  filter,
          headers: { Authorization: authToken }
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get('register')
  async getRegisterMetrics(
    @Headers('Authorization') authToken: string,
    @Query() filter: GetAuthMetricsQueryDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Page<User>>(`${this.entityName}/register`, {
          params:  filter,
          headers: { Authorization: authToken }
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get('password-reset')
  async getPasswordResetMetrics(
    @Headers('Authorization') authToken: string,
    @Query() filter: GetAuthMetricsQueryDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Page<User>>(`${this.entityName}/password-reset`, {
          params:  filter,
          headers: { Authorization: authToken }
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get('users')
  async getUsersMetrics(
    @Headers('Authorization') authToken: string,
    @Query() filter: GetUserMetricsQueryDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Page<User>>(`${this.entityName}/users`, {
          params:  filter,
          headers: { Authorization: authToken }
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Post('login')
  async createLoginMetric(@Body('uid') uid: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${this.entityName}/login`, {
          uid
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get('trainers')
  async getTrainerMetrics(
    @Headers('Authorization') authToken: string,
    @Query() filter: GetUserMetricsQueryDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Page<User>>(`${this.entityName}/trainers`, {
          params:  filter,
          headers: { Authorization: authToken }
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
