import { notFound } from 'next/navigation';
import { Event } from '../types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPublishedEvents(): Promise<Event[]> {
  const res = await fetch(`${API_URL}/events/published`, {
    cache: 'no-store', // SSR dynamique
  });

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  return res.json();
}

export async function getEventById(id: string) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    cache: 'no-store',
  });

  console.log('FETCH EVENT STATUS:', res.status);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error('Failed to fetch event');
  }

  return res.json();
}
