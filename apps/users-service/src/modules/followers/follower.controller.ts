import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common';
import { Follower, User } from '@prisma/client';
import { Page } from 'common';
import { FollowerService } from './follower.service';

@Controller('followers')
@Injectable()
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post('follow')
  followUser(
    @Query('userId') userId: number,
    @Body('userIdToFollow') userIdToFollow: number
  ): Promise<Follower> {
    return this.followerService.followUser(userIdToFollow, userId);
  }

  @Get('followers')
  getFollowers(
    @Query('userId', ParseIntPipe) userId: number
  ): Promise<Page<User>> {
    return this.followerService.getUserFollowers(userId);
  }

  @Get('following')
  getFollowing(
    @Query('userId', ParseIntPipe) userId: number
  ): Promise<Page<User>> {
    return this.followerService.getUserFollowings(userId);
  }

  @Delete('unfollow')
  unfollowUser(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('followerId', ParseIntPipe) followerId: number
  ): Promise<Follower> {
    return this.followerService.unfollowUser(userId, followerId);
  }
}
