'use client';

import { useEffect, useState } from 'react';
import { getAllEventsAdmin, updateEventStatus, deleteEvent } from '../../lib/api';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { EventStatus } from '@/app/types/EventStatus';
import { IEvent } from '@/app/types/event';
import { Playfair_Display, Cinzel } from 'next/font/google';
import Link from 'next/link';
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

export default function AdminEventsPage() {
    const token = useSelector((state: any) => state.auth.token);

    const router = useRouter();
    const [events, setEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const data = await getAllEventsAdmin(token);
        setEvents(data);
    };

    const handleStatus = async (id: string, status: EventStatus) => {
        await updateEventStatus(id, status, token);
        fetchEvents();
    };

    const handleDelete = async (id: string) => {
        await deleteEvent(id, token);
        fetchEvents();
    };

    return (
        <>

            <div className="relative min-h-screen w-full overflow-hidden " >
                {/* Background avec dégradé inspiré du palais */}
                <div className="absolute inset-0 bg-linear-to-br from-amber-950 via-amber-900 to-orange-950">
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
                                    className={`text-4xl sm:text-5xl tracking-wide text-orange-200 cursor-pointer hover:text-orange-300 transition-colors mb-2 ${playfairDisplay.className}`}
                                >
                                    𝓔𝓥𝓔𝓝𝓣𝓞
                                </h1>
                            </Link>
                            <h2
                                className={`text-lg sm:text-xl text-orange-100 tracking-wide ${cinzel.className}`}
                                style={{ letterSpacing: '0.15em' }}
                            >
                                GESTION DES ÉVÉNEMENTS
                            </h2>
                            <div className="w-16 h-0.5 bg-orange-200 mx-auto mt-2"></div>
                        </div>
                    </div>

                    {/* Events Table */}
                    <main className="container mx-auto px-4 py-8">
                        {/* Bouton Créer un événement - À l'extérieur du tableau */}
                        <div className="mb-6 flex justify-end">
                            <button
                                onClick={() => router.push('/admin/events/create')}
                                className={`px-6 py-3 bg-linear-to-r from-amber-800/60 to-orange-800/60 text-orange-100 border-2 border-orange-200/40 rounded-lg hover:from-amber-700/70 hover:to-orange-700/70 hover:border-orange-200/60 transition-all shadow-lg hover:shadow-xl text-sm ${cinzel.className}`}
                                style={{ letterSpacing: '0.08em' }}
                            >
                                + CRÉER UN ÉVÉNEMENT
                            </button>
                        </div>

                        {events.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-linear-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-xl p-8 max-w-md mx-auto">
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
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p
                                        className={`text-orange-100/80 ${cinzel.className}`}
                                        style={{ letterSpacing: '0.1em' }}
                                    >
                                        Aucun événement disponible
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-linear-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-2xl overflow-hidden">
                                <div className="overflow-x-auto">

                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-orange-200/20">
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>TITRE</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>DATE</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>LIEU</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>CAPACITÉ</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>STATUT</th>
                                                <th className={`px-6 py-4 text-left text-sm text-orange-100 ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {events.map((e: IEvent) => (
                                                <tr
                                                    key={e._id}
                                                    className="border-b border-orange-200/10 hover:bg-orange-200/5 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-orange-100/90">{e.title}</td>
                                                    <td className="px-6 py-4 text-orange-100/80">{new Date(e.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-orange-100/80">{e.location}</td>
                                                    <td className="px-6 py-4 text-orange-100/80">{e.capacity}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${cinzel.className} ${e.status === EventStatus.PUBLISHED
                                                            ? 'bg-amber-700/50 text-amber-100 border border-amber-200/40'
                                                            : e.status === EventStatus.CANCELED
                                                                ? 'bg-orange-900/50 text-orange-100 border border-orange-200/40'
                                                                : 'bg-amber-900/40 text-amber-200 border border-amber-200/30'
                                                            }`}>
                                                            {e.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2 flex-wrap">
                                                            <button
                                                                onClick={() => router.push(`/admin/events/${e._id}/edit`)}
                                                                className={`px-3 py-1.5 bg-linear-to-r from-amber-800/50 to-orange-700/50 text-orange-100 border border-orange-200/30 rounded-lg hover:from-amber-700/60 hover:to-orange-600/60 hover:border-orange-200/50 transition-all text-xs ${cinzel.className}`}
                                                                style={{ letterSpacing: '0.05em' }}
                                                            >
                                                                Modifier
                                                            </button>

                                                            <button
                                                                onClick={() => handleStatus(e._id, EventStatus.PUBLISHED)}
                                                                className={`px-3 py-1.5 bg-linear-to-r from-amber-700/50 to-amber-600/50 text-amber-100 border border-amber-200/40 rounded-lg hover:from-amber-600/60 hover:to-amber-500/60 hover:border-amber-200/60 transition-all text-xs ${cinzel.className}`}
                                                                style={{ letterSpacing: '0.05em' }}
                                                            >
                                                                Publier
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatus(e._id, EventStatus.CANCELED)}
                                                                className={`px-3 py-1.5 bg-linear-to-r from-orange-800/50 to-orange-700/50 text-orange-100 border border-orange-200/40 rounded-lg hover:from-orange-700/60 hover:to-orange-600/60 hover:border-orange-200/60 transition-all text-xs ${cinzel.className}`}
                                                                style={{ letterSpacing: '0.05em' }}
                                                            >
                                                                Annuler
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(e._id)}
                                                                className={`px-3 py-1.5 bg-linear-to-r from-amber-950/60 to-orange-950/60 text-orange-100 border border-orange-200/40 rounded-lg hover:from-amber-900/70 hover:to-orange-900/70 hover:border-orange-200/60 transition-all text-xs ${cinzel.className}`}
                                                                style={{ letterSpacing: '0.05em' }}
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
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