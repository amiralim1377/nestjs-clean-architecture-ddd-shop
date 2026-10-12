import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ApplicationExceptionFilter } from './shared/infrastructure/filters/application-exception.filter.js';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new ApplicationExceptionFilter(),
    new DomainExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
