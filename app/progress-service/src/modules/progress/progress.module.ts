import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports:     [HttpModule],
  controllers: [ProgressController],
  providers:   [ProgressService, PrismaService]
})
export class ProgressModule {}
