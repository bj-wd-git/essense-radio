import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station, StationStatus } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import * as crypto from 'crypto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async create(createStationDto: CreateStationDto, userId: number): Promise<Station> {
    const streamKey = crypto.randomBytes(16).toString('hex');
    
    const station = this.stationRepository.create({
      ...createStationDto,
      ownerId: userId,
      streamKey,
      status: StationStatus.PENDING,
    });

    return this.stationRepository.save(station);
  }

  async findAll(): Promise<Station[]> {
    return this.stationRepository.find({
      relations: ['owner'],
      where: [
        { status: StationStatus.APPROVED },
        { status: StationStatus.LIVE },
      ],
      order: { isLive: 'DESC', createdAt: 'DESC' }, // Live stations first
    });
  }

  async findOne(id: number): Promise<Station> {
    const station = await this.stationRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    return station;
  }

  async findByOwner(userId: number): Promise<Station[]> {
    return this.stationRepository.find({
      where: { ownerId: userId },
      relations: ['owner'],
    });
  }

  async update(id: number, updateStationDto: UpdateStationDto, userId: number, isAdmin: boolean): Promise<Station> {
    const station = await this.findOne(id);
    
    if (!isAdmin && station.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own stations');
    }

    Object.assign(station, updateStationDto);
    return this.stationRepository.save(station);
  }

  async remove(id: number, userId: number, isAdmin: boolean): Promise<void> {
    const station = await this.findOne(id);
    
    if (!isAdmin && station.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own stations');
    }

    await this.stationRepository.remove(station);
  }

  async startStream(id: number, userId: number): Promise<Station> {
    const station = await this.findOne(id);
    
    if (station.ownerId !== userId) {
      throw new ForbiddenException('Only the station owner can start the stream');
    }

    station.isLive = true;
    station.status = StationStatus.LIVE;
    return this.stationRepository.save(station);
  }

  async stopStream(id: number, userId: number): Promise<Station> {
    const station = await this.findOne(id);
    
    if (station.ownerId !== userId) {
      throw new ForbiddenException('Only the station owner can stop the stream');
    }

    station.isLive = false;
    station.status = StationStatus.OFFLINE;
    station.listenerCount = 0;
    return this.stationRepository.save(station);
  }

  async updateListenerCount(id: number, count: number): Promise<void> {
    await this.stationRepository.update(id, { listenerCount: count });
  }
}

