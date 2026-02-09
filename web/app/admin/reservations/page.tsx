'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    getAllReservations,
    updateReservationStatus,
} from '../../lib/api';
import { Reservation } from '@/app/types/Reservation';
import { ReservationStatus } from '@/app/types/ReservationStatus';
import { Playfair_Display, Cinzel } from 'next/font/google';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '@/app/components/ProtectedRoute';

// Configuration des polices classiques
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

export default function AdminReservationsPage() {
    const token = useSelector((state: any) => state.auth.token);
    console.log('AdminReservationsPage - Token:', token);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchReservations();
        }
    }, [token]);

    const fetchReservations = async () => {
        try {
            const data = await getAllReservations(token);
            setReservations(data);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (
        id: string,
        status: ReservationStatus,
    ) => {
        await updateReservationStatus(id, status, token);
        fetchReservations();
    };
    useEffect(() => {
        if (!token) return;
        fetchReservations();
    }, [token]);


    return (
        <>


            <div className="relative min-h-screen w-full overflow-hidden ">
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
                        <div className="text-center">
                            <Link href="/">
                                <h1
                                    className={`text-4xl sm:text-5xl  tracking-wide text-orange-200 cursor-pointer hover:text-orange-300 transition-colors mb-2 ${playfairDisplay.className}`}
                                >
                                    𝓔𝓥𝓔𝓝𝓣𝓞
                                </h1>
                            </Link>
                            <h2
                                className={`text-lg sm:text-xl text-orange-100 tracking-wide ${cinzel.className}`}
                                style={{ letterSpacing: '0.15em' }}
                            >
                                GESTION DES RÉSERVATIONS
                            </h2>
                            <div className="w-16 h-0.5 bg-orange-200 mx-auto mt-2"></div>
                        </div>
                    </div>

                    {/* Reservations Table */}
                    <main className="container mx-auto px-4 py-8">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="bg-gradient-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-xl p-8 max-w-md mx-auto">
                                    <div className="w-12 h-12 border-4 border-orange-200/30 border-t-orange-200 rounded-full animate-spin mx-auto mb-3"></div>
                                    <p
                                        className={`text-orange-100/80 ${cinzel.className}`}
                                        style={{ letterSpacing: '0.1em' }}
                                    >
                                        Chargement...
                                    </p>
                                </div>
                            </div>
                        ) : reservations.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gradient-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-xl p-8 max-w-md mx-auto">
                                    <svg
                                        className="w-12 h-12 text-orange-200/50 mx-auto mb-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <p
                                        className={`text-orange-100/80 ${cinzel.className}`}
                                        style={{ letterSpacing: '0.1em' }}
                                    >
                                        Aucune réservation disponible
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-orange-200/20">
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>UTILISATEUR</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>ÉVÉNEMENT</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>DATE</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>LIEU</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>STATUT</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservations.map((r) => (
                                                <tr
                                                    key={r._id}
                                                    className="border-b border-orange-200/10 hover:bg-orange-200/5 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-orange-100/90">{r.user?.email}</td>
                                                    <td className="px-6 py-4 text-orange-100/90">
                                                        {r.event?.title ?? (
                                                            <span className="italic text-orange-100/50">Événement supprimé</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-orange-100/80">
                                                        {r.event
                                                            ? new Date(r.event.date).toLocaleDateString()
                                                            : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-orange-100/80">{r.event?.location ?? '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${cinzel.className} ${r.status === ReservationStatus.CONFIRMED
                                                            ? 'bg-green-900/40 text-green-200 border border-green-200/30'
                                                            : r.status === ReservationStatus.REFUSED
                                                                ? 'bg-red-900/40 text-red-200 border border-red-200/30'
                                                                : r.status === ReservationStatus.PENDING
                                                                    ? 'bg-amber-900/40 text-amber-200 border border-amber-200/30'
                                                                    : 'bg-gray-900/40 text-gray-200 border border-gray-200/30'
                                                            }`}>
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {r.status === ReservationStatus.PENDING ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleUpdateStatus(r._id, ReservationStatus.CONFIRMED)
                                                                    }
                                                                    className={`px-3 py-1.5 bg-green-900/40 text-green-200 border border-green-200/30 rounded-lg hover:bg-green-900/60 transition-colors text-xs ${cinzel.className}`}
                                                                >
                                                                    Confirmer
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleUpdateStatus(r._id, ReservationStatus.REFUSED)
                                                                    }
                                                                    className={`px-3 py-1.5 bg-red-900/40 text-red-200 border border-red-200/30 rounded-lg hover:bg-red-900/60 transition-colors text-xs ${cinzel.className}`}
                                                                >
                                                                    Refuser
                                                                </button>
                                                            </div>
                                                        ) : r.status === ReservationStatus.CONFIRMED ? (
                                                            <span
                                                                className={`inline-block px-3 py-1 rounded-lg text-xs bg-green-900/30 text-green-200 border border-green-200/20 ${cinzel.className}`}
                                                            >
                                                                ✔ Déjà confirmée
                                                            </span>
                                                        ) : r.status === ReservationStatus.REFUSED ? (
                                                            <span
                                                                className={`inline-block px-3 py-1 rounded-lg text-xs bg-red-900/30 text-red-200 border border-red-200/20 ${cinzel.className}`}
                                                            >
                                                                ✖ Refusée
                                                            </span>
                                                        ) : (
                                                            <span className="text-orange-100/50 text-xs italic">
                                                                Action indisponible
                                                            </span>
                                                        )}
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Back to Home */}
                    <div className="text-center pb-8">
                        <Link
                            href="/"
                            className={`text-xs text-orange-100/60 hover:text-orange-200 transition-colors inline-flex items-center gap-2 ${cinzel.className}`}
                            style={{ letterSpacing: '0.1em' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            RETOUR À L'ACCUEIL
                        </Link>
                    </div>
                </div>
            </div>

        </>
    );
}