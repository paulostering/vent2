import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with credentials for subdomain support
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      /^https?:\/\/.*\.appname\.com$/,
      /^https?:\/\/appname\.com$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Enable cookie parsing
  app.use(cookieParser());

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Set global prefix
  app.setGlobalPrefix('api', { exclude: ['auth/health'] });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  
  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/auth/health`);
}
bootstrap();
