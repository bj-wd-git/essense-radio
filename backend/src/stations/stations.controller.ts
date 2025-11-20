import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createStationDto: CreateStationDto, @Request() req) {
    return this.stationsService.create(createStationDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.stationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/stations')
  findMyStations(@Request() req) {
    return this.stationsService.findByOwner(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
    @Request() req,
  ) {
    const isAdmin = req.user.role === 'admin';
    return this.stationsService.update(+id, updateStationDto, req.user.userId, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.role === 'admin';
    return this.stationsService.remove(+id, req.user.userId, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  startStream(@Param('id') id: string, @Request() req) {
    return this.stationsService.startStream(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/stop')
  stopStream(@Param('id') id: string, @Request() req) {
    return this.stationsService.stopStream(+id, req.user.userId);
  }
}

