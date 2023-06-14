import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceRegistryModule } from './modules/service-registry/service-registry.module';

@Module({
  imports:     [ConfigModule.forRoot(), ServiceRegistryModule],
  controllers: [AppController],
  providers:   [AppService]
})
export class AppModule {}
