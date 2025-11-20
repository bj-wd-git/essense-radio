import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { StationsService } from '../stations/stations.service';

@WebSocketGateway({
  cors: {
    origin: true, // Allow all origins in development
    credentials: true,
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private stationsService: StationsService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_station')
  async handleJoinStation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number },
  ) {
    client.join(`station_${data.stationId}`);
    const station = await this.stationsService.findOne(data.stationId);
    this.server.to(`station_${data.stationId}`).emit('user_joined', {
      stationId: data.stationId,
      listenerCount: station.listenerCount + 1,
    });
  }

  @SubscribeMessage('leave_station')
  async handleLeaveStation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number },
  ) {
    client.leave(`station_${data.stationId}`);
    const station = await this.stationsService.findOne(data.stationId);
    const newCount = Math.max(0, station.listenerCount - 1);
    await this.stationsService.updateListenerCount(data.stationId, newCount);
    this.server.to(`station_${data.stationId}`).emit('user_left', {
      stationId: data.stationId,
      listenerCount: newCount,
    });
  }

  @SubscribeMessage('chat_message')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number; userId: number; message: string },
  ) {
    try {
      const chatMessage = await this.chatService.create({
        stationId: data.stationId,
        userId: data.userId,
        message: data.message,
      });

      // Reload message with user relation to ensure user data is available
      const messages = await this.chatService.findByStation(data.stationId, 100);
      const fullMessage = messages.find(m => m.id === chatMessage.id);

      if (fullMessage) {
        this.server.to(`station_${data.stationId}`).emit('chat_message', {
          id: fullMessage.id,
          message: fullMessage.message,
          userId: fullMessage.userId,
          stationId: fullMessage.stationId,
          createdAt: fullMessage.createdAt,
          user: fullMessage.user ? {
            id: fullMessage.user.id,
            username: fullMessage.user.username,
            displayName: fullMessage.user.displayName,
          } : {
            id: data.userId,
            username: 'Unknown',
            displayName: 'Unknown User',
          },
        });
      }
    } catch (error) {
      console.error('Error handling chat message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('get_chat_history')
  async handleGetChatHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number },
  ) {
    const messages = await this.chatService.findByStation(data.stationId);
    client.emit('chat_history', messages);
  }
}

