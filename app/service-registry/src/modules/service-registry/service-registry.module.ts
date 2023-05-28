import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { ServiceRegistryController } from './service-registry.controller';
import { ServiceRegistryService } from './service-registry.service';

@Module({
  imports:     [ConfigModule.forRoot()],
  exports:     [],
  providers:   [ServiceRegistryService, PrismaService],
  controllers: [ServiceRegistryController]
})
export class ServiceRegistryModule {}
