import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation } from './schemas/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from './enums/reservation-status.enum';
import { EventsService } from '../events/events.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
    private eventsService: EventsService,
  ) { }

  async createReservation(
    userId: string,
    dto: CreateReservationDto,
  ): Promise<Reservation> {
    const event = await this.eventsService.findById(dto.eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Event not available for reservation');
    }

    // Vérifier réservation existante
    const existingReservation = await this.reservationModel.findOne({
      user: userId,
      event: dto.eventId,
      status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
    });

    if (existingReservation) {
      throw new BadRequestException('You already have a reservation');
    }

    // Vérifier capacité
    const confirmedCount = await this.reservationModel.countDocuments({
      event: dto.eventId,
      status: ReservationStatus.CONFIRMED,
    });

    if (confirmedCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    return this.reservationModel.create({
      user: userId,
      event: dto.eventId,
      status: ReservationStatus.PENDING,
    });
  }


  async updateStatus(
    reservationId: string,
    status: ReservationStatus,
  ): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Reservation already processed');
    }

    if (status === ReservationStatus.CONFIRMED) {
      const confirmedCount = await this.reservationModel.countDocuments({
        event: reservation.event,
        status: ReservationStatus.CONFIRMED,
      });

      const event = await this.eventsService.findById(
        reservation.event.toString(),
      );

      if (confirmedCount >= event.capacity) {
        throw new BadRequestException('Event is full');
      }

      reservation.confirmedAt = new Date();
    }

    if (status === ReservationStatus.REFUSED) {
      reservation.canceledAt = new Date();
    }

    reservation.status = status;
    return reservation.save();
  }


  async cancelReservation(
    reservationId: string,
    userId: string,
  ): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.user.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (reservation.status === ReservationStatus.CANCELED) {
      throw new BadRequestException('Reservation already canceled');
    }

    reservation.status = ReservationStatus.CANCELED;
    reservation.canceledAt = new Date();

    return reservation.save();
  }


  async findMyReservations(userId: string) {
    return this.reservationModel
      .find({ user: userId })
      .populate('event');
  }

  async findAll() {
    return this.reservationModel
      .find()
      .populate('user')
      .populate('event');
  }
}
