import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async create(createChatMessageDto: CreateChatMessageDto): Promise<ChatMessage> {
    const message = this.chatMessageRepository.create(createChatMessageDto);
    return this.chatMessageRepository.save(message);
  }

  async findByStation(stationId: number, limit: number = 50): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { stationId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async remove(id: number): Promise<void> {
    await this.chatMessageRepository.delete(id);
  }
}

