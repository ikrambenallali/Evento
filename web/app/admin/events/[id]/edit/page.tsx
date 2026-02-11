'use client';

import { useEffect, useState } from 'react';
import { getEventById, updateEvent, updateEventStatus, deleteEvent } from '../../../../lib/api';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Playfair_Display, Cinzel } from 'next/font/google';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { EventStatus } from '@/app/types/EventStatus';

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

export default function EditEventPage() {
  const token = useSelector((state: any) => state.auth.token);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEventById(id).then((data) => {
        setForm(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      location: form.location,
      capacity: Number(form.capacity),
    };

    try {
      await updateEvent(id, payload, token);
      router.push('/admin/events');
    } catch (err: any) {
      console.error('Update failed', err.response?.data || err.message || err);
      throw err;
    }
  };

  const handleStatus = async (status: string) => {
    await updateEventStatus(id, status as EventStatus, token);
    getEventById(id).then(setForm);
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      await deleteEvent(id, token);
      router.push('/admin/events');
    }
  };

  return (
    <>

      <div className="relative min-h-screen w-full overflow-hidden">
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
                MODIFIER L'ÉVÉNEMENT
              </h2>
              <div className="w-16 h-0.5 bg-orange-200 mx-auto mt-2"></div>
            </div>
          </div>

          {/* Form Section */}
          <main className="container mx-auto px-4 py-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="bg-linear-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-xl p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 border-4 border-orange-200/30 border-t-orange-200 rounded-full animate-spin mx-auto mb-3"></div>
                  <p
                    className={`text-orange-100/80 ${cinzel.className}`}
                    style={{ letterSpacing: '0.1em' }}
                  >
                    Chargement...
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-linear-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-xl shadow-2xl p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Titre */}
                    <div>
                      <label
                        className={`block text-orange-100 text-sm mb-2 ${cinzel.className}`}
                        style={{ letterSpacing: '0.1em' }}
                      >
                        TITRE
                      </label>
                      <input
                        type="text"
                        placeholder="Nom de l'événement"
                        value={form.title || ''}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-amber-950/50 border border-orange-200/30 rounded-lg text-orange-100 placeholder-orange-100/40 focus:outline-none focus:border-orange-200/60 focus:ring-2 focus:ring-orange-200/20 transition-all"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className={`block text-orange-100 text-sm mb-2 ${cinzel.className}`}
                        style={{ letterSpacing: '0.1em' }}
                      >
                        DESCRIPTION
                      </label>
                      <textarea
                        placeholder="Description de l'événement"
                        value={form.description || ''}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-amber-950/50 border border-orange-200/30 rounded-lg text-orange-100 placeholder-orange-100/40 focus:outline-none focus:border-orange-200/60 focus:ring-2 focus:ring-orange-200/20 transition-all resize-none"
                      />
                    </div>

                    {/* Date et Capacité - Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Date */}
                      <div>
                        <label
                          className={`block text-orange-100 text-sm mb-2 ${cinzel.className}`}
                          style={{ letterSpacing: '0.1em' }}
                        >
                          DATE
                        </label>
                        <input
                          type="date"
                          value={form.date?.split('T')[0] || ''}
                          onChange={e => setForm({ ...form, date: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-amber-950/50 border border-orange-200/30 rounded-lg text-orange-100 focus:outline-none focus:border-orange-200/60 focus:ring-2 focus:ring-orange-200/20 transition-all"
                        />
                      </div>

                      {/* Capacité */}
                      <div>
                        <label
                          className={`block text-orange-100 text-sm mb-2 ${cinzel.className}`}
                          style={{ letterSpacing: '0.1em' }}
                        >
                          CAPACITÉ
                        </label>
                        <input
                          type="number"
                          placeholder="Nombre de places"
                          value={form.capacity || ''}
                          onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                          required
                          min="1"
                          className="w-full px-4 py-3 bg-amber-950/50 border border-orange-200/30 rounded-lg text-orange-100 placeholder-orange-100/40 focus:outline-none focus:border-orange-200/60 focus:ring-2 focus:ring-orange-200/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Lieu */}
                    <div>
                      <label
                        className={`block text-orange-100 text-sm mb-2 ${cinzel.className}`}
                        style={{ letterSpacing: '0.1em' }}
                      >
                        LIEU
                      </label>
                      <input
                        type="text"
                        placeholder="Adresse de l'événement"
                        value={form.location || ''}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-amber-950/50 border border-orange-200/30 rounded-lg text-orange-100 placeholder-orange-100/40 focus:outline-none focus:border-orange-200/60 focus:ring-2 focus:ring-orange-200/20 transition-all"
                      />
                    </div>

                    {/* Statut actuel */}
                    <div>
                      <label
                        className={`block text-orange-100 text-sm mb-2 ${cinzel.className}`}
                        style={{ letterSpacing: '0.1em' }}
                      >
                        STATUT ACTUEL
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm ${cinzel.className} ${form.status === 'PUBLISHED'
                          ? 'bg-amber-700/50 text-amber-100 border border-amber-200/40'
                          : form.status === 'CANCELED'
                            ? 'bg-orange-900/50 text-orange-100 border border-orange-200/40'
                            : 'bg-amber-900/40 text-amber-200 border border-amber-200/30'
                          }`}>
                          {form.status || 'DRAFT'}
                        </span>
                      </div>
                    </div>

                    {/* Buttons - Save */}
                    <div className="pt-4 border-t border-orange-200/20">
                      <button
                        type="submit"
                        className={`w-full px-6 py-3 bg-linear-to-r from-amber-700 to-orange-700 text-orange-50 font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200/50 transition-all shadow-lg hover:shadow-xl border border-orange-200/30 ${cinzel.className}`}
                        style={{ letterSpacing: '0.1em' }}
                      >
                        💾 ENREGISTRER LES MODIFICATIONS
                      </button>
                    </div>

                    {/* Status Actions */}
                    <div className="pt-4 border-t border-orange-200/20">
                      <p className={`text-orange-100/60 text-sm mb-3 ${cinzel.className}`} style={{ letterSpacing: '0.05em' }}>
                        ACTIONS DE STATUT
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleStatus('PUBLISHED')}
                          className={`px-4 py-2.5 bg-linear-to-r from-amber-700/50 to-amber-600/50 text-amber-100 border border-amber-200/40 rounded-lg hover:from-amber-600/60 hover:to-amber-500/60 hover:border-amber-200/60 transition-all text-sm ${cinzel.className}`}
                          style={{ letterSpacing: '0.05em' }}
                        >
                          ✓ Publier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatus('CANCELED')}
                          className={`px-4 py-2.5 bg-linear-to-r from-orange-800/50 to-orange-700/50 text-orange-100 border border-orange-200/40 rounded-lg hover:from-orange-700/60 hover:to-orange-600/60 hover:border-orange-200/60 transition-all text-sm ${cinzel.className}`}
                          style={{ letterSpacing: '0.05em' }}
                        >
                          ⊗ Annuler
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t border-orange-200/20">
                      <p className={`text-orange-100/50 text-sm mb-3 ${cinzel.className}`} style={{ letterSpacing: '0.05em' }}>
                        ZONE DANGEREUSE
                      </p>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className={`w-full px-4 py-2.5 bg-linear-to-r from-amber-950/60 to-orange-950/60 text-orange-100 border border-orange-200/40 rounded-lg hover:from-amber-900/70 hover:to-orange-900/70 hover:border-orange-200/60 transition-all text-sm ${cinzel.className}`}
                        style={{ letterSpacing: '0.05em' }}
                      >
                        🗑️ SUPPRIMER L'ÉVÉNEMENT
                      </button>
                    </div>

                    {/* Cancel Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => router.push('/admin/events')}
                        className={`w-full px-6 py-3 bg-amber-950/50 border border-orange-200/30 text-orange-100 rounded-lg hover:bg-amber-950/70 hover:border-orange-200/60 focus:outline-none focus:ring-2 focus:ring-orange-200/20 transition-all ${cinzel.className}`}
                        style={{ letterSpacing: '0.1em' }}
                      >
                        ← RETOUR SANS ENREGISTRER
                      </button>
                    </div>
                  </form>
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