import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoalModule } from './modules/goals/goal.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports:     [ConfigModule.forRoot(), ProgressModule, GoalModule],
  controllers: [AppController],
  providers:   [AppService]
})
export class AppModule {}
