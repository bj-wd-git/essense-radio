import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatMessageDto {
  @IsNumber()
  @IsNotEmpty()
  stationId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}

