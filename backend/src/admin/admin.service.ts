import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station, StationStatus } from '../stations/entities/station.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getDashboard() {
    const [totalStations, liveStations, totalUsers, pendingStations] = await Promise.all([
      this.stationRepository.count(),
      this.stationRepository.count({ where: { isLive: true } }),
      this.userRepository.count(),
      this.stationRepository.count({ where: { status: StationStatus.PENDING } }),
    ]);

    return {
      totalStations,
      liveStations,
      totalUsers,
      pendingStations,
    };
  }

  async getAllStations() {
    return this.stationRepository.find({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllUsers() {
    return this.userRepository.find({
      relations: ['stations'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStationStatus(id: number, status: StationStatus) {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) {
      throw new Error('Station not found');
    }
    station.status = status;
    return this.stationRepository.save(station);
  }

  async updateUserStatus(id: number, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = isActive;
    return this.userRepository.save(user);
  }
}

