import { Page } from '@fiu-fit/common';
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
import { Follower, User, Verification } from '@prisma/client';
import { VerificationService } from './verification.service';

@Controller('verifications')
@Injectable()
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('')
  addVerification(
    @Body('verification') verification: { userId: number; resourceId: number }
  ): Promise<Verification> {
    return this.verificationService.addVerificationRequest(
      verification.userId,
      verification.resourceId
    );
  }

  @Get('followers')
  getFollowers(
    @Query('userId', ParseIntPipe) userId: number
  ): Promise<Page<User>> {
    return this.verificationService.getUserFollowers(userId);
  }

  @Get('following')
  getFollowing(
    @Query('userId', ParseIntPipe) userId: number
  ): Promise<Page<User>> {
    return this.verificationService.getUserFollowings(userId);
  }

  @Delete('unfollow')
  unfollowUser(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('followerId', ParseIntPipe) followerId: number
  ): Promise<Follower> {
    return this.verificationService.unfollowUser(userId, followerId);
  }
}
