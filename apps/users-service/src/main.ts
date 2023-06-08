import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerFactory } from 'common';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './utils/api-key-guard';

// add comment to test actions

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //  magic line

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalGuards(new ApiKeyGuard());

  await app.listen(process.env.PORT || '8080');

  const logger = LoggerFactory('main');

  logger.info(`Application is running on: ${await app.getUrl()}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
