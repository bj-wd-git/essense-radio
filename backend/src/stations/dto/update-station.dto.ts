import { IsString, IsOptional, IsEnum } from 'class-validator';
import { StationStatus } from '../entities/station.entity';

export class UpdateStationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsEnum(StationStatus)
  status?: StationStatus;
}

