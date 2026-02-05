export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELED';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  status: EventStatus;
  photoUrl?: string;
  createdBy: string;
}
