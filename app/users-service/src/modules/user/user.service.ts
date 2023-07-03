import { Page, Service, Workout } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { FavoriteWorkout, Prisma, Role, User } from '@prisma/client';
import * as admin from 'firebase-admin';
import { firstValueFrom } from 'rxjs';
import { firebaseAdmin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { UserLocationService } from '../user-location/user-location.service';
import { FavoritedByFilterDto, GetUsersQueryDTO, UserDTO } from './dto';

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
        where,
        include: {
          verification: true
        }
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
        where,
        include: {
          verification: true
        }
      }),
      count: await this.prismaService.user.count({ where })
    };
  }

  async getUserById(
    id: number
  ): Promise<User & { location: number[] | undefined }> {
    const userLocation = await this.userLocationService.findUserLocation(id);

    const user = await this.prismaService.user.findUnique({
      where:   { id },
      include: {
        verification: true
      }
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

    const favoriteWorkouts = await this.prismaService.favoriteWorkout.findMany({
      where: { userId: id }
    });

    const favoriteWorkoutsIds = favoriteWorkouts.map(
      workout => workout.workoutId
    );

    const filter = { filters: JSON.stringify({ _id: favoriteWorkoutsIds }) };

    const {
      data: { apiKey }
    } = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/workout`
      )
    );

    const workouts = await firstValueFrom(
      this.httpService.get<Workout[]>(
        `${process.env.WORKOUT_SERVICE_URL}/workouts`,
        {
          params:  filter,
          headers: { 'api-key': apiKey }
        }
      )
    );
    return workouts.data;
  }

  async addFavoriteWorkout(
    id: number,
    workoutId: string
  ): Promise<FavoriteWorkout> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return this.prismaService.favoriteWorkout.upsert({
      where: {
        userId_workoutId: {
          userId:    id,
          workoutId: workoutId
        }
      },
      create: {
        userId:    id,
        workoutId: workoutId
      },
      update: {}
    });
  }

  async removeFavoriteWorkout(
    id: number,
    workoutId: string
  ): Promise<FavoriteWorkout> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    try {
      return await this.prismaService.favoriteWorkout.delete({
        where: {
          userId_workoutId: {
            userId:    id,
            workoutId: workoutId
          }
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'Favorite workout not found'
          });
        }
      }

      throw error;
    }
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where:   { email },
      include: {
        verification: true
      }
    });
  }

  async getUsersWhoFavoritedWorkoutPage(
    workoutId: string,
    start?: Date,
    end?: Date
  ): Promise<Page<User>> {
    const rows = await this.prismaService.favoriteWorkout.findMany({
      where: {
        workoutId,
        createdAt: {
          gte: start,
          lt:  end
        }
      },
      select: { user: true }
    });

    return {
      rows:  rows.map(row => row.user),
      count: await this.prismaService.favoriteWorkout.count({
        where: {
          workoutId,
          createdAt: {
            gte: start,
            lt:  end
          }
        }
      })
    };
  }

  isFutureDate(date: Date, currentDate: Date): boolean {
    return (
      date.getFullYear() > currentDate.getFullYear() ||
      (date.getFullYear() == currentDate.getFullYear() &&
        date.getMonth() > currentDate.getMonth() + 1)
    );
  }

  async getUsersWhoFavoritedWorkoutPerMonth(
    workoutId: string,
    year: number
  ): Promise<Array<Page<User>> | Page<User>> {
    const pages = [];
    const endDate = new Date(year, 1, 1);
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      if (this.isFutureDate(endDate, currentDate)) {
        break;
      }

      const page = await this.getUsersWhoFavoritedWorkoutPage(
        workoutId,
        undefined,
        endDate
      );

      pages.push(page);

      endDate.setMonth(endDate.getMonth() + 1);
    }

    const padding = Array(12 - pages.length).fill({
      rows:  [],
      count: 0
    });

    return pages.concat(padding);
  }

  getUsersWhoFavoritedWorkout(
    workoutId: string,
    filter?: FavoritedByFilterDto
  ): Promise<Array<Page<User>> | Page<User>> {
    if (filter?.year) {
      return this.getUsersWhoFavoritedWorkoutPerMonth(workoutId, filter.year);
    }

    return this.getUsersWhoFavoritedWorkoutPage(
      workoutId,
      undefined,
      undefined
    );
  }

  async editUser(id: number, user: Partial<UserDTO>): Promise<User> {
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
      },
      include: {
        verification: true
      }
    });
  }
}
