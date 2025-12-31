import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting Essence Radio Backend...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    const dbHost = process.env.DB_HOST || '127.0.0.1';
    const dbPort = process.env.DB_PORT || '3306';
    const dbName = process.env.DB_DATABASE || 'essence_radio';
    console.log(`🗄️  Database: ${dbHost}:${dbPort}/${dbName}`);
    
    if (!process.env.DB_HOST) {
      console.warn('⚠️  WARNING: DB_HOST not set, using default 127.0.0.1');
      console.warn('⚠️  Please set DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables');
    }
    
    console.log('📦 Creating NestJS application...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    
    // Serve static files from public directory (frontend)
    const publicPath = join(__dirname, '..', 'public');
    console.log(`📁 Serving static files from: ${publicPath}`);
    app.useStaticAssets(publicPath, {
      index: 'index.html',
    });
    
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

    // Set global prefix for API routes
    app.setGlobalPrefix('api');

    //const port = 3000 || process.env.PORT || 80;
     const port = 3000;
    console.log(`🌐 Starting HTTP server on port ${port}...`);
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Backend server running on http://0.0.0.0:${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/api/health`);
    console.log(`🌍 Frontend available at http://localhost:${port}/`);
    console.log(`🎉 Application started successfully!`);
  } catch (error) {
    console.error('❌ Failed to start application:');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.error('\n💡 Troubleshooting:');
    console.error('  1. Check database connection settings (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE)');
    console.error('  2. Verify database is running and accessible');
    console.error('  3. Check network connectivity');
    console.error('  4. Review logs above for specific error details');
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
