// app/types/Reservation.ts
import { ReservationStatus } from './ReservationStatus';
import { IEvent } from '../types/event';

export interface Reservation {
  _id: string;
  status: ReservationStatus;
  createdAt: string;
  confirmedAt?: string;
  canceledAt?: string;
  event: IEvent | null;

  user?: any; // utile côté admin
}
