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
import { Injectable } from '@nestjs/common';
import { StationsService } from '../stations/stations.service';

@WebSocketGateway({
  namespace: '/streaming',
  cors: {
    origin: true, // Allow all origins in development
    credentials: true,
  },
})
@Injectable()
export class StreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private publishers = new Map<number, string>(); // stationId -> socketId
  private listeners = new Map<number, Set<string>>(); // stationId -> Set of socketIds

  constructor(private stationsService: StationsService) {}

  handleConnection(client: Socket) {
    console.log(`Streaming client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Streaming client disconnected: ${client.id}`);
    
    // Clean up publisher
    for (const [stationId, socketId] of this.publishers.entries()) {
      if (socketId === client.id) {
        this.publishers.delete(stationId);
        this.server.to(`station_${stationId}`).emit('publisher_left');
        break;
      }
    }

    // Clean up listeners
    for (const [stationId, socketIds] of this.listeners.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        this.stationsService.updateListenerCount(stationId, socketIds.size);
        break;
      }
    }
  }

  @SubscribeMessage('publish')
  async handlePublish(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number; streamKey: string },
  ) {
    const station = await this.stationsService.findOne(data.stationId);
    
    if (station.streamKey !== data.streamKey) {
      client.emit('error', { message: 'Invalid stream key' });
      return;
    }

    this.publishers.set(data.stationId, client.id);
    client.join(`station_${data.stationId}`);
    client.emit('publisher_ready');
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number },
  ) {
    const station = await this.stationsService.findOne(data.stationId);
    
    if (!station.isLive) {
      client.emit('error', { message: 'Station is not live' });
      return;
    }

    if (!this.listeners.has(data.stationId)) {
      this.listeners.set(data.stationId, new Set());
    }
    this.listeners.get(data.stationId).add(client.id);
    
    client.join(`station_${data.stationId}`);
    
    const listenerCount = this.listeners.get(data.stationId).size;
    await this.stationsService.updateListenerCount(data.stationId, listenerCount);
    
    client.emit('subscriber_ready');
  }

  @SubscribeMessage('offer')
  handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number; offer: any },
  ) {
    const publisherSocketId = this.publishers.get(data.stationId);
    if (publisherSocketId) {
      console.log(`Forwarding offer from listener ${client.id} to publisher ${publisherSocketId}`);
      this.server.to(publisherSocketId).emit('offer', {
        offer: data.offer,
        socketId: client.id,
      });
    } else {
      console.log(`No publisher found for station ${data.stationId}`);
      client.emit('error', { message: 'No active publisher for this station' });
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number; answer: any; socketId: string },
  ) {
    this.server.to(data.socketId).emit('answer', {
      answer: data.answer,
    });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { stationId: number; candidate: any; targetSocketId?: string },
  ) {
    const publisherSocketId = this.publishers.get(data.stationId);
    const isPublisher = publisherSocketId === client.id;
    
    if (isPublisher) {
      // Publisher sending ICE candidate - broadcast to all listeners
      client.to(`station_${data.stationId}`).emit('ice-candidate', {
        candidate: data.candidate,
      });
    } else {
      // Listener sending ICE candidate - send to publisher
      if (publisherSocketId) {
        this.server.to(publisherSocketId).emit('ice-candidate', {
          candidate: data.candidate,
        });
      }
    }
  }
}

