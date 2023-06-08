import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { Goal } from '@prisma/client';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto';
import { GoalDto } from './dto/goal.dto';
import { GoalService } from './goal.service';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  createGoal(@Body() goal: GoalDto): Promise<Goal> {
    return this.goalService.createGoal(goal);
  }

  @Get()
  getGoals(@Query() filter: GetGoalsQueryDto): Promise<Goal[]> {
    return this.goalService.findAll(filter);
  }

  @Get(':id')
  async getGoalById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Goal | null> {
    const goal = await this.goalService.getGoalById(id);

    if (!goal) {
      throw new NotFoundException({ message: 'Goals not found' });
    }

    return goal;
  }

  @Put(':id')
  async editGoal(
    @Param('id', ParseIntPipe) id: number,
    @Body() goal: Goal
  ): Promise<Goal> {
    const editedGoal = await this.goalService.editGoal(id, goal);

    if (!editedGoal) {
      throw new NotFoundException({ message: 'Goals not found' });
    }

    return editedGoal;
  }

  @Delete(':id')
  async deleteGoal(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Goal | undefined> {
    try {
      return await this.goalService.deleteGoal(id);
    } catch (e) {
      if ((e as any)?.code === 'P2025') {
        throw new NotFoundException({ message: 'Goal not found' });
      }
      throw e;
    }
  }
}
