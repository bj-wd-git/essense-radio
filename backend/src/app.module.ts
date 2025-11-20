import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StationsModule } from './stations/stations.module';
import { ChatModule } from './chat/chat.module';
import { StreamingModule } from './streaming/streaming.module';
import { AdminModule } from './admin/admin.module';
import { User } from './auth/entities/user.entity';
import { Station } from './stations/entities/station.entity';
import { ChatMessage } from './chat/entities/chat-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'essence_radio',
      entities: [User, Station, ChatMessage],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 10,
      retryDelay: 5000,
      autoLoadEntities: true,
      connectTimeout: 60000,
      extra: {
        connectTimeout: 60000,
      },
    }),
    AuthModule,
    StationsModule,
    ChatModule,
    StreamingModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

