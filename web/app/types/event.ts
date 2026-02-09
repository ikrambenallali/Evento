import { EventStatus } from "./EventStatus";

export interface IEvent {
  
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

