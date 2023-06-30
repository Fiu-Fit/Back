import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
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
import { EditGoalDto, GetGoalsQueryDto, GoalDto } from './dto';

@Injectable()
@UseGuards(AuthGuard)
@Controller('goals')
export class GoalController {
  private readonly entityName: string;

  constructor(protected httpService: HttpService) {
    this.entityName = 'goals';
  }

  @Post()
  public async createGoal(@Body() goal: GoalDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, goal)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async getGoals(@Query() params: GetGoalsQueryDto) {
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
  public async getGoalById(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteGoal(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async editGoal(@Param('id') id: number, @Body() goal: EditGoalDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, goal)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
