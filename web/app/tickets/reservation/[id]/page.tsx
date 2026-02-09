'use client';

import { useEffect, useState } from 'react';

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(setReservations);
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>

            {reservations.map((r: any) => (
                <div key={r._id} className="border p-4 rounded mb-4">
                    <h2 className="font-semibold">{r.event.title}</h2>
                    <p>Statut : {r.status}</p>

                    {r.status === 'CONFIRMED' && (
                        <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/tickets/reservation/${r._id}`}
                            className="text-blue-600 underline"
                        >
                            Télécharger le ticket PDF
                        </a>

                    )}
                </div>
            ))}
        </div>
    );
}
