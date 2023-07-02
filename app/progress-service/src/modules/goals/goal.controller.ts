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
  getGoalById(@Param('id', ParseIntPipe) id: number): Promise<Goal | null> {
    return this.goalService.getGoalById(id);
  }

  @Put(':id')
  editGoal(
    @Param('id', ParseIntPipe) id: number,
    @Body() goal: Goal
  ): Promise<Goal> {
    return this.goalService.editGoal(id, goal);
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
