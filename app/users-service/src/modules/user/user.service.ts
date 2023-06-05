import { Page, Workout } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import * as admin from 'firebase-admin';
import { firstValueFrom } from 'rxjs';
import { firebaseAdmin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { UserLocationService } from '../user-location/user-location.service';
import { GetUsersQueryDTO, UserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private userLocationService: UserLocationService
  ) {}

  async findAndCount(filter: GetUsersQueryDTO): Promise<Page<User>> {
    const response = filter.params
      ? await this.simpleFilter(filter)
      : await this.advancedFilter(filter);
    return response;
  }

  async simpleFilter(filter: GetUsersQueryDTO): Promise<Page<User>> {
    const { params } = filter;
    const where: Prisma.UserWhereInput = {
      OR: []
    };
    const filterArray: any[] = [];
    const paramsArray: string[] = params?.split(' ') ?? [];
    const fields = Object.getOwnPropertyNames(filter);
    paramsArray.map(param => {
      fields.map(field => {
        if (field != 'ids' && field != 'role' && field != 'params') {
          filterArray.push({
            [field as keyof Prisma.UserWhereInput]: {
              contains: param,
              mode:     'insensitive'
            }
          });
        }
      });
    });
    where.OR = filterArray;
    return {
      rows: await this.prismaService.user.findMany({
        orderBy: { id: 'asc' },
        where
      }),
      count: await this.prismaService.user.count({ where })
    };
  }

  async advancedFilter(filter: GetUsersQueryDTO): Promise<Page<User>> {
    const { ids, role, ...filters } = filter;
    const where: Prisma.UserWhereInput = {
      id: {
        in: ids
      },
      AND: []
    };
    const filterArray: any[] = [];
    if (role) {
      filterArray.push({
        role: {
          equals: role
        }
      });
    }
    for (const key in filters) {
      if (filters[key]) {
        const field = key as keyof Prisma.UserWhereInput;
        filterArray.push({
          [field]: {
            contains: filters[key] as string,
            mode:     'insensitive'
          }
        });
      }
    }
    where.AND = filterArray;
    return {
      rows: await this.prismaService.user.findMany({
        orderBy: { id: 'asc' },
        where
      }),
      count: await this.prismaService.user.count({ where })
    };
  }

  async getUserById(
    id: number
  ): Promise<User & { location: number[] | undefined }> {
    const userLocation = await this.userLocationService.findUserLocation(id);

    const user = await this.prismaService.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return {
      ...user,
      location: userLocation?.location?.coordinates
    };
  }

  async getFavoriteWorkouts(id: number): Promise<Workout[]> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    const filter = { filters: JSON.stringify({ _id: user.favoriteWorkouts }) };

    const workouts = await firstValueFrom(
      this.httpService.get<Workout[]>(
        `${process.env.WORKOUT_SERVICE_URL}/workouts`,
        {
          params:  filter,
          headers: { 'api-key': process.env.WORKOUT_API_KEY }
        }
      )
    );

    return workouts.data;
  }

  async addFavoriteWorkout(id: number, workoutId: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    if (user.favoriteWorkouts.includes(workoutId)) {
      // do not add duplicate id
      return user;
    }

    const favoriteWorkouts = [...user.favoriteWorkouts, workoutId];
    return this.prismaService.user.update({
      where: { id },
      data:  { favoriteWorkouts }
    });
  }

  async removeFavoriteWorkout(id: number, workoutId: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    const favoriteWorkouts = user.favoriteWorkouts.filter(
      idToDelete => idToDelete !== workoutId
    );
    return this.prismaService.user.update({
      where: { id },
      data:  { favoriteWorkouts }
    });
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email }
    });
  }

  async editUser(id: number, user: UserDTO): Promise<User> {
    const { coordinates, ...rest } = user;

    if (coordinates) {
      await this.userLocationService.updateLocation(id, coordinates);
    }

    return this.prismaService.user.update({
      where: {
        id
      },
      data: rest
    });
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.prismaService.user
      .delete({
        where: {
          id
        }
      })
      .catch(() => {
        throw new NotFoundException({ message: 'User not found' });
      });

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    await firebaseAdmin.auth().deleteUser(user.uid);

    return user;
  }

  createUser(user: UserDTO): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...user,
        federatedIdentity: true
      }
    });
  }

  async getUserByToken(bearerToken: string): Promise<User | null> {
    try {
      const token = bearerToken.replace('Bearer ', '');
      const payload = await admin.auth().verifyIdToken(token);

      if (!payload || !payload.email) return null;

      return this.getUserByEmail(payload.email!);
    } catch (error) {
      throw new UnauthorizedException({
        message: `The token is invalid: ${error}`
      });
    }
  }

  async getNearestTrainers(userId: number, radius: number): Promise<User[]> {
    const nearestUsers = await this.userLocationService.findNearestUsers(
      userId,
      radius
    );

    return this.prismaService.user.findMany({
      where: {
        id: {
          in: nearestUsers.map(userLocation => userLocation.userId)
        },
        role: Role.Trainer
      }
    });
  }
}
