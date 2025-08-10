// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}/api`);
}
bootstrap();

// // .env (example)
// DB_HOST=localhost
// DB_PORT=3306
// DB_USERNAME=root
// DB_PASSWORD=password
// DB_DATABASE=clinic_frontend_system
// JWT_SECRET=your-secret-key-here
// NODE_ENV=development
// FRONTEND_URL=http://localhost:3000
// PORT=3001