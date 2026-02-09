import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TicketsService } from './tickets.service';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)  // <<< important
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('reservation/:id')
  async downloadTicket(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const pdf = await this.ticketsService.generateTicket(id, req.user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=ticket.pdf',
    });

    res.send(pdf);
  }
}
