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
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { AuthGuard } from '../auth/auth.guard';
import { GetUsersQueryDTO, UserDTO } from './dto';
import { User } from './interfaces/user.interface';

@Injectable()
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  private readonly entityName = 'users';

  constructor(protected httpService: HttpService) {}

  @Post()
  public async createUser(@Body() user: UserDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, user)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async getUsers(@Query() params: GetUsersQueryDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}`, {
          params: params
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async getUserById(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteUser(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async editUser(@Param('id') id: number, @Body() user: UserDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, user)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id/nearest-trainers')
  async getNearestTrainers(
    @Param('id') id: number,
    @Query('radius') radius: number
  ): Promise<User[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<User[]>(`/${this.entityName}/${id}/nearest-trainers`, {
          params: { radius }
        })
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
          `/${this.entityName}/me`,
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
        .get<Workout[]>(`/${this.entityName}/${id}/favoriteWorkouts`)
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
        .put<User>(`/${this.entityName}/${id}/favoriteWorkouts`, { workoutId })
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
        .delete<User>(`/${this.entityName}/${id}/favoriteWorkouts/${workoutId}`)
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
        .get<User[]>(`/${this.entityName}/favorited/${workoutId}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
