import { HttpModule } from '@nestjs/axios';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteWorkout, PrismaClient, Role, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Model } from 'mongoose';
import { PrismaService } from '../../../prisma.service';
import { UserLocation } from '../../user-location/schema/user-location.schema';
import { UserLocationService } from '../../user-location/user-location.service';
import { UserDTO } from '../dto';
import { UserService } from '../user.service';

const authMock = {
  deleteUser:    jest.fn(),
  verifyIdToken: jest.fn(
    _ =>
      ({
        email: 'default'
      } as any)
  )
};

jest.mock('firebase-admin', () => {
  return {
    auth:          jest.fn(() => authMock),
    initializeApp: jest.fn().mockReturnThis(),
    credential:    {
      cert: jest.fn().mockReturnThis()
    }
  };
});

describe('UserService', () => {
  let userService: UserService;
  let prisma: DeepMockProxy<PrismaClient>;
  let userLocationService: UserLocationService;

  const newUser: UserDTO = {
    firstName:      'test',
    lastName:       'test',
    email:          'test@gmail.com',
    role:           Role.Admin,
    bodyWeight:     100,
    interests:      [],
    phoneNumber:    '',
    uid:            'test',
    profilePicture: 'test',
    deviceToken:    'test'
  };

  const defaultUser: User = {
    ...newUser,
    id:                1,
    createdAt:         new Date(),
    confirmationPIN:   '',
    confirmed:         false,
    blocked:           false,
    blockedAt:         null,
    federatedIdentity: false
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:   [HttpModule],
      providers: [
        UserService,
        PrismaService,
        UserLocationService,
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

    prisma = await module.resolve(PrismaService);

    userLocationService = await module.resolve(UserLocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(userService).toBeDefined();
    expect(userLocationService).toBeDefined();
  });

  describe('create', () => {
    it('should create a User', async () => {
      prisma.user.create.mockResolvedValueOnce(defaultUser);

      const result = await userService.createUser(newUser);

      expect(result).toStrictEqual(defaultUser);
    });
  });

  describe('find', () => {
    async function assertFind(users: User[]) {
      const page = {
        rows:  users,
        count: users.length
      };

      jest.spyOn(userService, 'simpleFilter').mockResolvedValue(page);
      jest.spyOn(userService, 'advancedFilter').mockResolvedValue(page);

      prisma.user.findMany.mockResolvedValueOnce(users);
      prisma.user.count.mockResolvedValueOnce(users.length);

      prisma.user.findMany.mockReset();

      const result = await userService.findAndCount({ params: '' });

      expect(result).toStrictEqual(page);
    }

    it('should find all users', () => {
      const users = [
        defaultUser,
        {
          ...defaultUser,
          id: 2
        }
      ];

      assertFind(users);

      jest.clearAllMocks();
    });

    it('Empty array doesnt throw error', () => {
      const users: User[] = [];

      assertFind(users);
    });
  });

  describe('findById', () => {
    it('Should return User with ID without location', async () => {
      jest
        .spyOn(userLocationService, 'findUserLocation')
        .mockResolvedValueOnce(null);
      prisma.user.findUnique.mockResolvedValueOnce(defaultUser);

      const result = await userService.getUserById(defaultUser.id);

      expect(result).toStrictEqual({ ...defaultUser, location: undefined });
    });

    it('Should return User with ID with location', async () => {
      jest.spyOn(userLocationService, 'findUserLocation').mockResolvedValueOnce(
        Promise.resolve({
          id:       'test',
          userId:   1,
          location: { coordinates: [0, 0], type: 'Point' }
        })
      );
      prisma.user.findUnique.mockResolvedValueOnce(defaultUser);

      const result = await userService.getUserById(defaultUser.id);

      expect(result).toStrictEqual({ ...defaultUser, location: [0, 0] });
    });

    it('should throw error if not found', async () => {
      jest
        .spyOn(userLocationService, 'findUserLocation')
        .mockResolvedValueOnce(null);
      const id = 1;

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(userService.getUserById(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findByEmail', () => {
    it('Should return User with email without location', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(defaultUser);

      const result = await userService.getUserByEmail(defaultUser.email);

      expect(result).toStrictEqual(defaultUser);
    });

    it('should return null if not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      const result = await userService.getUserByEmail(defaultUser.email);

      expect(result).toStrictEqual(null);
    });
  });

  describe('findByToken', () => {
    const bearerToken = 'Bearer test';

    it('Should return User by token', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValueOnce(Promise.resolve(defaultUser));

      const result = await userService.getUserByToken(bearerToken);

      expect(result).toStrictEqual(defaultUser);
    });

    it('should throw error if firebase fails', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);

      jest.spyOn(authMock, 'verifyIdToken').mockImplementation(_ => {
        throw new Error();
      });

      await expect(userService.getUserByToken(bearerToken)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should return null if firebase returns null', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);

      jest.spyOn(authMock, 'verifyIdToken').mockImplementation(_ => {
        return null;
      });

      const result = await userService.getUserByToken(bearerToken);

      expect(result).toStrictEqual(null);
    });
  });

  describe('updateById', () => {
    it('Should update User', async () => {
      const editedUser: UserDTO = {
        ...defaultUser,
        confirmationPIN: '',
        firstName:       'edited',
        phoneNumber:     'test',
        profilePicture:  'test'
      };

      prisma.user.update.mockResolvedValueOnce({
        ...defaultUser,
        firstName:      editedUser.firstName,
        phoneNumber:    editedUser.phoneNumber,
        profilePicture: editedUser.profilePicture
      });

      const result = await userService.editUser(defaultUser.id, editedUser);

      expect(result).toStrictEqual(editedUser);
    });
  });

  describe('deleteById', () => {
    it('Should delete User', async () => {
      prisma.user.delete.mockResolvedValueOnce(defaultUser);

      const result = await userService.deleteUser(defaultUser.id);

      expect(result).toStrictEqual(defaultUser);
    });
  });

  describe('addFavoriteWorkout', () => {
    it('Should add favorite workout', async () => {
      const workoutId = 'testWorkoutId';
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce({
        ...defaultUser,
        location: undefined
      });
      const createdAt = new Date();
      prisma.favoriteWorkout.upsert.mockResolvedValueOnce({
        id:        1,
        userId:    defaultUser.id,
        workoutId: workoutId,
        createdAt
      });

      const result = await userService.addFavoriteWorkout(
        defaultUser.id,
        workoutId
      );

      expect(result).toStrictEqual({
        id:        1,
        userId:    defaultUser.id,
        workoutId: workoutId,
        createdAt
      });
    });

    it('Should throw error if user is not found', async () => {
      const workoutId = 'testWorkoutId';
      jest
        .spyOn(userLocationService, 'findUserLocation')
        .mockResolvedValueOnce(null);

      await expect(
        userService.addFavoriteWorkout(defaultUser.id, workoutId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUsersWhoFavoritedWorkout', () => {
    it('Should return users who favorited workout', async () => {
      const workoutId = 'testWorkoutId';
      const users = [
        defaultUser,
        {
          ...defaultUser,
          id: 2
        },
        {
          ...defaultUser,
          id: 3
        }
      ];
      const favoriteWorkouts = [
        {
          id:        1,
          userId:    1,
          workoutId,
          createdAt: new Date(),
          user:      users[0]
        },
        {
          id:        3,
          userId:    3,
          workoutId,
          createdAt: new Date(),
          user:      users[2]
        }
      ] as unknown as FavoriteWorkout[];

      prisma.favoriteWorkout.findMany.mockResolvedValueOnce(favoriteWorkouts);
      prisma.favoriteWorkout.count.mockResolvedValueOnce(2);

      const result = await userService.getUsersWhoFavoritedWorkout(workoutId);

      expect(result).toStrictEqual({
        rows:  [users[0], users[2]],
        count: 2
      });
    });

    it('Should return users who favorited workout per month', async () => {
      const workoutId = 'testWorkoutId';
      const users = [
        defaultUser,
        {
          ...defaultUser,
          id: 2
        },
        {
          ...defaultUser,
          id: 3
        }
      ];
      const januaryFavoriteWorkouts = [
        {
          id:        1,
          userId:    1,
          workoutId,
          createdAt: new Date('2021-01-01'),
          user:      users[0]
        }
      ] as unknown as FavoriteWorkout[];
      const februaryFavoriteWorkouts = [
        {
          id:        3,
          userId:    3,
          workoutId,
          createdAt: new Date('2021-02-15'),
          user:      users[2]
        }
      ] as unknown as FavoriteWorkout[];
      const decemberFavoriteWorkouts = [
        {
          id:        2,
          userId:    2,
          workoutId,
          createdAt: new Date('2021-12-25'),
          user:      users[1]
        }
      ];

      prisma.favoriteWorkout.findMany
        .mockResolvedValueOnce(januaryFavoriteWorkouts)
        .mockResolvedValueOnce(februaryFavoriteWorkouts)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(decemberFavoriteWorkouts);
      prisma.favoriteWorkout.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1);

      const result = await userService.getUsersWhoFavoritedWorkout(workoutId, {
        year: 2021
      });
      const expected = [
        {
          rows:  [users[0]],
          count: 1
        },
        {
          rows:  [users[2]],
          count: 1
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [],
          count: 0
        },
        {
          rows:  [users[1]],
          count: 1
        }
      ];

      expect(result).toStrictEqual(expected);
      expect(prisma.favoriteWorkout.findMany).toHaveBeenCalledTimes(12);
      expect(prisma.favoriteWorkout.count).toHaveBeenCalledTimes(12);
    });
  });

  describe('getNearestTrainers', () => {
    it('Should return trainers', async () => {
      const users: User[] = [
        {
          ...defaultUser,
          id:   2,
          role: Role.Trainer
        },
        {
          ...defaultUser,
          id:   3,
          role: Role.Trainer
        }
      ];

      prisma.user.findMany.mockResolvedValueOnce(users);

      const userLocations = [
        {
          id:       'test',
          userId:   1,
          location: { coordinates: [0, 0], type: 'Point' }
        },
        {
          id:       'test',
          userId:   2,
          location: { coordinates: [0, 0], type: 'Point' }
        },
        {
          id:       'test',
          userId:   3,
          location: { coordinates: [0, 0], type: 'Point' }
        }
      ];

      jest
        .spyOn(userLocationService, 'findNearestUsers')
        .mockResolvedValueOnce(userLocations);

      const result = await userService.getNearestTrainers(defaultUser.id, 100);

      expect(result).toStrictEqual(users);
      expect(prisma.user.findMany).toBeCalledWith({
        where: {
          id: {
            in: users.map(user => user.id)
          },
          role: Role.Trainer
        },
        include: {
          verification: true
        }
      });
    });
  });
});
