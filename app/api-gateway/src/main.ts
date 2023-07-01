import { LoggerFactory } from '@fiu-fit/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const logger = LoggerFactory('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //  magic line

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Fiu Fit')
    .setDescription('API de Fiu Fit')
    .setVersion('1.0')
    .addTag('fiu-fit')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = parseInt(process.env.PORT || '8080');
  await app.listen(port);

  logger.info(`App is running on PORT: ${port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
