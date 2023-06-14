import { LoggerFactory } from '@fiu-fit/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// add comment to test actions

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //  magic line

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || '8080');

  const logger = LoggerFactory('main');

  logger.info(`Application is running on: ${await app.getUrl()}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
