import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PDFDocument from 'pdfkit';

import { Reservation } from '../reservations/schemas/reservation.schema';
import { ReservationStatus } from '../reservations/enums/reservation-status.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
  ) {}

  async generateTicket(reservationId: string, user) {
  const reservation = await this.reservationModel
    .findById(reservationId)
    .populate('event')
    .populate('user');

  if (!reservation) throw new NotFoundException('Réservation introuvable');
  if (reservation.status !== ReservationStatus.CONFIRMED)
    throw new ForbiddenException('Ticket non disponible');

  if (!user) throw new ForbiddenException('Utilisateur non authentifié');
  if (user.role !== 'ADMIN' && reservation.user._id.toString() !== user.id)
    throw new ForbiddenException('Accès interdit');

  return this.generatePdf(reservation);  
}


 generatePdf(reservation): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    doc.fontSize(18).text('Ticket de réservation');
    doc.moveDown();

    doc.text(`Participant: ${reservation.user.name}`);
    doc.text(`Email: ${reservation.user.email}`);
    doc.text(`Événement: ${reservation.event.title}`);
    doc.text(`Date: ${reservation.event.date}`);
    doc.text(`Lieu: ${reservation.event.location}`);
    doc.text(`Confirmé le: ${reservation.confirmedAt}`);

    doc.end();
  });
}

}
