import { Module } from '@nestjs/common';
import { StreamingGateway } from './streaming.gateway';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [StationsModule],
  providers: [StreamingGateway],
  exports: [StreamingGateway],
})
export class StreamingModule {}

