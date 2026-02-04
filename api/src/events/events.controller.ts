import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { eventImageStorage } from './multer.config';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

@Get('me-test')
test(@Req() req) {
  console.log('👤 User dans request:', req.user); // Debug
  return req.user;
}

@Post()
@UseInterceptors(FileInterceptor('photo', { storage: eventImageStorage }))
create(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateEventDto,
  @User('id') userId: string, // récupère l'id depuis le decorator
) {
  const photoUrl = file ? `/uploads/events/${file.filename}` : undefined;
  return this.eventsService.create({ ...dto, photoUrl }, userId);
}




}
