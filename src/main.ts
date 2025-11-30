import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are sent
    transform: true, // Automatically transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true, // Enable implicit type conversion
    },
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
