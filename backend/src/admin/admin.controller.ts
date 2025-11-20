import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateStationDto } from '../stations/dto/update-station.dto';
import { StationStatus } from '../stations/entities/station.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }
    return this.adminService.getDashboard();
  }

  @Get('stations')
  getAllStations(@Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }
    return this.adminService.getAllStations();
  }

  @Get('users')
  getAllUsers(@Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }
    return this.adminService.getAllUsers();
  }

  @Patch('stations/:id/approve')
  approveStation(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }
    return this.adminService.updateStationStatus(+id, StationStatus.APPROVED);
  }

  @Patch('stations/:id/reject')
  rejectStation(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }
    return this.adminService.updateStationStatus(+id, StationStatus.REJECTED);
  }

  @Patch('users/:id/activate')
  activateUser(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }
    return this.adminService.updateUserStatus(+id, true);
  }

  @Patch('users/:id/deactivate')
  deactivateUser(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }
    return this.adminService.updateUserStatus(+id, false);
  }
}

