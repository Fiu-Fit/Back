import { Workout } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './interfaces/user.interface';

@Injectable()
@UseGuards(AuthGuard)
@Controller('users')
export class UserController extends ServerController {
  constructor(protected httpService: HttpService) {
    super(httpService, 'users');
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Headers('Authorization') bearerToken: string): Promise<User> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<User>(
          '/users/me',
          {},
          {
            headers: { Authorization: bearerToken }
          }
        )
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Get(':id/favoriteWorkouts')
  async getFavoriteWorkouts(@Param('id') id: number): Promise<Workout[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Workout[]>(`/users/${id}/favoriteWorkouts`)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Put(':id/favoriteWorkouts')
  async addFavoriteWorkout(
    @Param('id') id: number,
    @Body('workoutId') workoutId: string
  ): Promise<User> {
    const { data } = await firstValueFrom(
      this.httpService
        .put<User>(`/users/${id}/favoriteWorkouts`, { workoutId })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Delete(':id/favoriteWorkouts/:workoutId')
  async removeFavoriteWorkout(
    @Param('id') id: number,
    @Param('workoutId') workoutId: string
  ): Promise<User> {
    const { data } = await firstValueFrom(
      this.httpService
        .delete<User>(`/users/${id}/favoriteWorkouts/${workoutId}`)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Get(':id/token')
  async getDeviceToken(@Param('id') id: number): Promise<string | null> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<string>(`/users/${id}/token`)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Patch(':id/token')
  async updateDeviceToken(
    @Param('id') id: number,
    @Body('token') token: string
  ): Promise<User> {
    const { data } = await firstValueFrom(
      this.httpService
        .patch<User>(`/users/${id}/token`, { token })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }
}
