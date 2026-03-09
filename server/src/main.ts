import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[NestJS] Running on http://localhost:${port}`);
}
bootstrap();
