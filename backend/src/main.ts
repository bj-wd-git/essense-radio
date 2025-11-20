import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting Essence Radio Backend...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    const dbHost = process.env.DB_HOST || '127.0.0.1';
    const dbPort = process.env.DB_PORT || '3306';
    console.log(`🗄️  Database: ${dbHost}:${dbPort}`);
    console.log(`📝 Database: ${process.env.DB_DATABASE || 'essence_radio'}`);
    
    if (!process.env.DB_HOST) {
      console.warn('⚠️  WARNING: DB_HOST not set, using default 127.0.0.1');
      console.warn('⚠️  Please set DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables');
    }
    
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    
    // Allow all origins in development, restrict in production
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? (process.env.ALLOWED_ORIGINS?.split(',') || [])
      : true; // Allow all in development for network access

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Backend server running on http://0.0.0.0:${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/health`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();

