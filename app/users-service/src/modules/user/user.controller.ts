import { Page, Workout } from '@fiu-fit/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUsersQueryDTO } from './dto';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/nearest-trainers')
  getNearestTrainers(
    @Param('id', ParseIntPipe) id: number,
    @Query('radius') radius: number
  ): Promise<User[]> {
    return this.userService.getNearestTrainers(id, radius);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Get()
  getUsers(@Query() filter: GetUsersQueryDTO): Promise<Page<User>> {
    return this.userService.findAndCount(filter);
  }

  @Get('favorited/:workoutId')
  getUsersWhoFavoritedWorkout(
    @Param('workoutId') workoutId: string
  ): Promise<User[]> {
    return this.userService.getUsersWhoFavoritedWorkout(workoutId);
  }

  @Put(':id')
  async putEditUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserDTO
  ): Promise<User> {
    const editedUser = await this.userService.editUser(id, user);

    if (!editedUser) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return editedUser;
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number
  ): Promise<User | undefined> {
    try {
      return await this.userService.deleteUser(id);
    } catch (e) {
      if ((e as any)?.code === 'P2025') {
        throw new NotFoundException({ message: 'User not found' });
      }
      throw e;
    }
  }

  @Post('me')
  async getUserByToken(
    @Headers('Authorization') bearerToken: string
  ): Promise<User> {
    const user = await this.userService.getUserByToken(bearerToken);

    if (!user)
      throw new UnauthorizedException({ message: 'The token is invalid' });

    return user;
  }

  @Post()
  createUser(@Body() user: UserDTO): Promise<User> {
    if (user.role === Role.Admin) {
      throw new UnauthorizedException(
        'No se puede crear un usuario administrador!'
      );
    }

    return this.userService.createUser(user);
  }

  @Get(':id/favoriteWorkouts')
  getFavoriteWorkouts(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Workout[]> {
    return this.userService.getFavoriteWorkouts(id);
  }

  @Put(':id/favoriteWorkouts')
  addFavoriteWorkout(
    @Param('id', ParseIntPipe) id: number,
    @Body('workoutId') workoutId: string
  ): Promise<User> {
    return this.userService.addFavoriteWorkout(id, workoutId);
  }

  @Delete(':id/favoriteWorkouts/:workoutId')
  removeFavoriteWorkout(
    @Param('id', ParseIntPipe) id: number,
    @Param('workoutId') workoutId: string
  ): Promise<User> {
    return this.userService.removeFavoriteWorkout(id, workoutId);
  }
}
