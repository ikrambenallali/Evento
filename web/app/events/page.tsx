import { getPublishedEvents } from '../lib/api';
import EventCard from '../components/EventCard';
import { Playfair_Display, Cinzel } from 'next/font/google';
import Link from 'next/link';
import Navbar from '../components/Navbar';

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

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
        
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
        {/* Header Section - Plus compact */}
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
              ÉVÉNEMENTS DISPONIBLES
            </h2>
            <div className="w-16 h-0.5 bg-orange-200 mx-auto mt-2"></div>
          </div>
        </div>

        {/* Events Grid - Plus compact */}
        <main className="container mx-auto px-4 py-8">
          {events.length === 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
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