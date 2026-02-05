import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';


@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}


  @Post()
  @Roles(Role.PARTICIPANT)
  create(@Request() req, @Body() dto: CreateReservationDto) {
    return this.reservationsService.createReservation(req.user.id, dto);
  }

  @Get('me')
  @Roles(Role.PARTICIPANT)
  findMine(@Request() req) {
    return this.reservationsService.findMyReservations(req.user.id);
  }

  @Patch(':id/cancel')
  @Roles(Role.PARTICIPANT)
  cancel(@Param('id') id: string, @Request() req) {
    return this.reservationsService.cancelReservation(id, req.user.id);
  }


  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.reservationsService.findAll();
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN )
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, dto.status);
  }
}
