import { User } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Followers')
@Injectable()
@UseGuards(AuthGuard)
@Controller('followers')
export class FollowerController {
  constructor(protected httpService: HttpService) {}

  @Post('follow')
  async followUser(
    @Query('userId') userId: number,
    @Body('userIdToFollow') userIdToFollow: number
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post('/followers/follow', { userIdToFollow }, { params: { userId } })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Delete('unfollow')
  async unfollowUser(
    @Query('userId') userId: number,
    @Query('followerId') followerId: number
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete<User>('/followers/unfollow', { params: { userId, followerId } })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Get('followers')
  async getFollowers(@Query('userId') userId: number): Promise<User[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<User[]>('/followers/followers', { params: { userId } })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Get('following')
  async getFollowing(@Query('userId') userId: number): Promise<User[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<User[]>('/followers/following', { params: { userId } })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }
}
