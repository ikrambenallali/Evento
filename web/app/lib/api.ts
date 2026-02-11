import { notFound } from 'next/navigation';
import api from './axios';
import { IEvent } from '../types/event';
import { ReservationStatus } from '@/app/types/ReservationStatus';



// Événements publiés
export const getPublishedEvents = async (): Promise<IEvent[]> => {
  const res = await api.get('/events/published');
  return res.data;
};

// Event par ID
export const getEventById = async (id: string) => {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      notFound();
    }
    throw err;
  }
};

 

export const getAllEventsAdmin = async (token: string): Promise<IEvent[]> => {
  const res = await api.get('/events', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createEvent = async (payload: FormData | Record<string, any>, token: string) => {
  if (payload instanceof FormData) {
    const res = await api.post('/events', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  const res = await api.post('/events', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const updateEventStatus = async (
  id: string,
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELED',
  token: string,
) => {
  const res = await api.put(
    `/events/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
export const updateEvent = async (id: string, payload: FormData | Record<string, any>, token: string) => {
  if (payload instanceof FormData) {
    const res = await api.put(`/events/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  const res = await api.put(`/events/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deleteEvent = async (id: string, token: string) => {
  await api.delete(`/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const createReservation = async (
  eventId: string,
  token: string,
) => {
  const res = await api.post(
    '/reservations',
    { eventId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getMyReservations = async (token: string) => {
  const res = await api.get('/reservations/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const cancelReservation = async (
  reservationId: string,
  token: string,
) => {
  const res = await api.patch(
    `/reservations/${reservationId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};



export const getAllReservations = async (token: string) => {
  const res = await api.get('/reservations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateReservationStatus = async (
  reservationId: string,
  status: ReservationStatus,
  token: string,
) => {
  const res = await api.patch(
    `/reservations/${reservationId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};


