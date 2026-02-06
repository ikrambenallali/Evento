'use client';

import { useEffect, useState } from 'react';
import DownloadTicketButton from '../components/DownloadTicketButton';
import Link from 'next/link';
import { Playfair_Display, Cinzel } from 'next/font/google';

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    display: 'swap',
});

const cinzel = Cinzel({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setReservations(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-900/40 border border-green-400/40 rounded-full text-green-200 text-xs font-medium">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        CONFIRMÉ
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-900/40 border border-amber-400/40 rounded-full text-amber-200 text-xs font-medium">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                            />
                        </svg>
                        EN ATTENTE
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/40 border border-red-400/40 rounded-full text-red-200 text-xs font-medium">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        ANNULÉ
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900/40 border border-gray-400/40 rounded-full text-gray-200 text-xs font-medium">
                        {status}
                    </span>
                );
        }
    };
    const cancelReservation = async (reservationId: string) => {
        const token = localStorage.getItem('token');

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/reservations/${reservationId}/cancel`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!res.ok) {
            const data = await res.json();
            alert(`Impossible d'annuler: ${data.message}`);
            return;
        }

        alert('Réservation annulée avec succès !');
        window.location.reload(); // recharge pour mettre à jour la liste
    };
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background avec dégradé inspiré du palais */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950">
                {/* Motifs décoratifs subtils */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
                </div>

                {/* Texture overlay */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header Section */}
                <div className="container mx-auto px-4 pt-6 pb-4">
                    <div className="text-center mb-6">
                        <Link href="/">
                            <h1
                                className={`text-4xl sm:text-5xl tracking-wide text-orange-200 cursor-pointer hover:text-orange-300 transition-colors mb-2 ${playfairDisplay.className}`}
                            >
                                𝓔𝓥𝓔𝓝𝓣𝓞
                            </h1>
                        </Link>
                        <h2
                            className={`text-lg sm:text-xl text-orange-100 tracking-wide ${cinzel.className}`}
                            style={{ letterSpacing: '0.15em' }}
                        >
                            MES RÉSERVATIONS
                        </h2>
                        <div className="w-16 h-0.5 bg-orange-200 mx-auto mt-2"></div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mb-6">
                        <Link
                            href="/events"
                            className={`inline-flex items-center gap-2 text-xs text-orange-100/60 hover:text-orange-200 transition-colors ${cinzel.className}`}
                            style={{ letterSpacing: '0.1em' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            ÉVÉNEMENTS
                        </Link>
                    </div>
                </div>

                {/* Reservations List */}
                <main className="container mx-auto px-4 pb-12">
                    <div className="max-w-4xl mx-auto">
                        {loading ? (
                            <div className="text-center py-20">
                                <svg
                                    className="animate-spin h-12 w-12 text-orange-200 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <p className="text-orange-100/70 mt-4">Chargement...</p>
                            </div>
                        ) : reservations.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="bg-gradient-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-xl p-12 max-w-md mx-auto">
                                    <svg
                                        className="w-16 h-16 text-orange-200/50 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                        />
                                    </svg>
                                    <p
                                        className={`text-orange-100/80 mb-6 ${cinzel.className}`}
                                        style={{ letterSpacing: '0.1em' }}
                                    >
                                        Aucune réservation pour le moment
                                    </p>
                                    <Link
                                        href="/events"
                                        className={`inline-block px-6 py-2.5 bg-orange-200 text-amber-950 rounded-full font-light 
                             hover:bg-orange-300 transition-all duration-300 
                             shadow-lg hover:shadow-orange-300/40
                             ${cinzel.className}`}
                                        style={{ letterSpacing: '0.15em' }}
                                    >
                                        DÉCOUVRIR LES ÉVÉNEMENTS
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reservations.map((r: any) => (
                                    <div
                                        key={r._id}
                                        className="bg-gradient-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-xl overflow-hidden hover:border-orange-200/50 transition-all duration-300"
                                    >
                                        <div className="p-6">
                                            {/* Header avec titre et status */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                                <h2
                                                    className={`text-xl font-semibold text-orange-100 ${cinzel.className}`}
                                                >
                                                    {r.event.title}
                                                </h2>
                                                {getStatusBadge(r.status)}
                                            </div>

                                            {/* Event details */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                {/* Location */}
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4 text-orange-200/60 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    <p className="text-sm text-orange-100/70">
                                                        {r.event.location}
                                                    </p>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4 text-orange-200/60 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <p className="text-sm text-orange-100/70">
                                                        {new Date(r.event.date).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>

                                            </div>

                                            {/* Divider */}
                                            <div className="flex gap-2 mt-4">
                                                {r.status === 'CONFIRMED' && (
                                                    <DownloadTicketButton reservationId={r._id} />
                                                )}
                                                {r.status !== 'CANCELED' && (
                                                    <button
                                                        onClick={() => cancelReservation(r._id)}
                                                        className="bg-orange-200 text-amber-950 px-3 py-0 rounded "
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
                                            </div>


                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}