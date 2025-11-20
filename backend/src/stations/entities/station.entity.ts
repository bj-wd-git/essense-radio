import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum StationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  LIVE = 'live',
  OFFLINE = 'offline',
}

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  genre: string;

  @Column({
    type: 'enum',
    enum: StationStatus,
    default: StationStatus.PENDING,
  })
  status: StationStatus;

  @Column({ default: false })
  isLive: boolean;

  @Column({ nullable: true })
  streamKey: string;

  @Column({ default: 0 })
  listenerCount: number;

  @ManyToOne(() => User, (user) => user.stations)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

