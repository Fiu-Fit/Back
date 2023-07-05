import { HttpModule } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Follower, PrismaClient, Role, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Model } from 'mongoose';
import { PrismaService } from '../../../prisma.service';
import { UserService } from '../../user/user.service';
import { UserLocation } from '../../user-location/schema/user-location.schema';
import { UserLocationService } from '../../user-location/user-location.service';
import { FollowerService } from '../follower.service';

describe('FollowerService', () => {
  let followerService: FollowerService;
  let prisma: DeepMockProxy<PrismaClient>;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:   [HttpModule],
      providers: [
        UserService,
        UserLocationService,
        PrismaService,
        FollowerService,
        {
          provide:  getModelToken(UserLocation.name),
          useValue: Model
        }
      ]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userService = await module.resolve(UserService);
    followerService = await module.resolve(FollowerService);
    prisma = await module.resolve(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultFollower: Follower = {
    id:         1,
    userId:     1,
    followerId: 2
  };

  const defaultUser: User = {
    id:                1,
    firstName:         'test',
    lastName:          'test',
    email:             'test@gmail.com',
    role:              Role.Athlete,
    bodyWeight:        100,
    interests:         [],
    phoneNumber:       '',
    uid:               'test',
    profilePicture:    'test',
    deviceToken:       'test',
    createdAt:         new Date(),
    confirmationPIN:   '',
    confirmed:         false,
    blocked:           false,
    blockedAt:         null,
    federatedIdentity: false
  };

  describe('followUser', () => {
    it('should create a follower', async () => {
      jest.spyOn(prisma.follower, 'create').mockResolvedValue(defaultFollower);

      const userId = 1;
      const followerId = 2;

      const result = await followerService.followUser(userId, followerId);

      expect(result).toEqual(defaultFollower);
    });
  });

  describe('getUserFollowers', () => {
    it('should return user followers', async () => {
      const followers = {
        rows: [
          defaultFollower,
          { ...defaultFollower, id: 2 },
          { ...defaultFollower, id: 3 }
        ],
        count: 3
      };

      jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue({
          ...defaultUser,
          followers: followers.rows as any
        });

      jest
        .spyOn(userService, 'findAndCount')
        .mockResolvedValue(followers as any);

      const userId = 1;

      const result = await followerService.getUserFollowers(userId);

      expect(result).toEqual(followers);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const userId = 1;

      await expect(
        followerService.getUserFollowers(userId)
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getUserFollowings', () => {
    it('should return user followings', async () => {
      const following = [
        { id: 1, userId: 8, followerId: 1, user: defaultUser },
        { id: 2, userId: 9, followerId: 1, user: { ...defaultUser, id: 2 } },
        { id: 3, userId: 10, followerId: 1, user: { ...defaultUser, id: 3 } }
      ];

      jest.spyOn(prisma.follower, 'findMany').mockResolvedValue(following);

      const followerId = 1;

      const result = await followerService.getUserFollowings(followerId);
      console.log('Following users: ', result);

      expect(result).toEqual({
        rows:  following.map(follow => follow.user),
        count: following.length
      });
    });
  });

  describe('unfollowUser', () => {
    it('should delete a follower', async () => {
      jest.spyOn(prisma.follower, 'delete').mockResolvedValue(defaultFollower);

      const followerId = 1;
      const userId = 2;

      const result = await followerService.unfollowUser(followerId, userId);

      expect(result).toStrictEqual(defaultFollower);

      expect(prisma.follower.delete).toHaveBeenCalledWith({
        where: {
          followerFollowingId: {
            userId,
            followerId
          }
        }
      });
    });
  });
});
