import { Page } from '@fiu-fit/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Follower, User } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class FollowerService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  followUser(userId: number, followerId: number): Promise<Follower> {
    return this.prismaService.follower.create({
      data: {
        userId,
        followerId
      }
    });
  }

  async getUserFollowers(id: number): Promise<Page<User>> {
    const user = await this.prismaService.user.findUnique({
      where:   { id },
      include: {
        followers: {
          select: { followerId: true }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userService.findAndCount({
      ids: user.followers.map(follower => follower.followerId)
    });
  }

  async getUserFollowings(followerId: number): Promise<Page<User>> {
    const followingUsers = await this.prismaService.follower.findMany({
      where:  { followerId },
      select: { user: true }
    });

    return {
      rows:  followingUsers.map(following => following.user),
      count: followingUsers.length
    };
  }

  unfollowUser(followerId: number, userId: number): Promise<Follower> {
    return this.prismaService.follower.delete({
      where: {
        followerFollowingId: {
          userId,
          followerId
        }
      }
    });
  }
}
