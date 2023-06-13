import { LoggerFactory } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiKeyGuard } from '../utils/api-key-guard';
import { AppModule } from './app.module';

// add comment to test actions

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //  magic line

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalGuards(new ApiKeyGuard(app.get(HttpService)));

  await app.listen(process.env.PORT || '8080');

  const logger = LoggerFactory('main');

  logger.info(`Application is running on: ${await app.getUrl()}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
