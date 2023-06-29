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
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './dto/user.dto';

@ApiTags('User')
@Injectable()
@UseGuards(AuthGuard)
@Controller('users')
export class UserController extends ServerController<User> {
  constructor(protected httpService: HttpService) {
    super(httpService, 'users');
  }

  @Get(':id/nearest-trainers')
  async getNearestTrainers(
    @Param('id') id: number,
    @Query() query: Record<string, any>
  ): Promise<User[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<User[]>(`/users/${id}/nearest-trainers`, { params: query })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
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

  @Get('favorited/:workoutId')
  async getUsersWhoFavoritedWorkout(
    @Param('workoutId') workoutId: string
  ): Promise<User[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<User[]>(`/users/favorited/${workoutId}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
