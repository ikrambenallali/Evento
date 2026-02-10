import { getEventById } from '../../lib/api';
import Link from 'next/link';
import { Playfair_Display, Cinzel } from 'next/font/google';
import Navbar from '@/app/components/Navbar';
import ReserveButton from '../../components/ReserveButton';


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

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailsPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);

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
          {/* Header avec navigation */}
          <div className="container mx-auto px-4 pt-6 pb-4">
            <Link
              href="/events"
              className={`inline-flex items-center gap-2 text-xs text-orange-100/60 hover:text-orange-200 transition-colors mb-4 ${cinzel.className}`}
              style={{ letterSpacing: '0.1em' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              RETOUR AUX ÉVÉNEMENTS
            </Link>
          </div>

          {/* Main Content */}
          <main className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl mx-auto">
              {/* Card principale */}
              <div className="bg-linear-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-2xl shadow-2xl overflow-hidden">

                {/* Image */}
                {event.photoUrl && (
                  <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${event.photoUrl}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay linear */}
                    <div className="absolute inset-0 bg-linear-to-t from-amber-950/80 via-transparent to-transparent"></div>

                    {/* Title overlay sur l'image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <h1
                        className={`text-3xl sm:text-4xl md:text-5xl font-bold text-orange-100 ${playfairDisplay.className}`}
                      >
                        {event.title}
                      </h1>
                    </div>
                  </div>
                )}

                {/* Si pas d'image, afficher le titre normalement */}
                {!event.photoUrl && (
                  <div className="p-6 sm:p-8 border-b border-orange-200/20">
                    <h1
                      className={`text-3xl sm:text-4xl md:text-5xl font-bold text-orange-100 ${playfairDisplay.className}`}
                    >
                      {event.title}
                    </h1>
                  </div>
                )}

                {/* Informations principales */}
                <div className="p-6 sm:p-8">
                  {/* Lieu et Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Lieu */}
                    <div className="flex items-start gap-3 bg-amber-950/30 border border-orange-200/20 rounded-lg p-4">
                      <svg
                        className="w-5 h-5 text-orange-200 flex-shrink-0 mt-0.5"
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
                      <div>
                        <p
                          className={`text-xs text-orange-200/70 uppercase mb-1 ${cinzel.className}`}
                          style={{ letterSpacing: '0.1em' }}
                        >
                          Lieu
                        </p>
                        <p className="text-orange-100 text-sm">{event.location}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-start gap-3 bg-amber-950/30 border border-orange-200/20 rounded-lg p-4">
                      <svg
                        className="w-5 h-5 text-orange-200 flex-shrink-0 mt-0.5"
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
                      <div>
                        <p
                          className={`text-xs text-orange-200/70 uppercase mb-1 ${cinzel.className}`}
                          style={{ letterSpacing: '0.1em' }}
                        >
                          Date
                        </p>
                        <p className="text-orange-100 text-sm">
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-orange-100/60 text-xs mt-0.5">
                          {new Date(event.date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-orange-200/20 mb-6"></div>

                  {/* Description */}
                  <div>
                    <h2
                      className={`text-lg text-orange-200 mb-3 uppercase ${cinzel.className}`}
                      style={{ letterSpacing: '0.15em' }}
                    >
                      Description
                    </h2>
                    <p className="text-orange-100/80 leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 flex justify-center">
                    {/* <button
                  
                    className={`px-8 py-3 bg-orange-200 text-amber-950 rounded-full font-light 
                             hover:bg-orange-300 transition-all duration-300 
                             shadow-lg hover:shadow-orange-300/40
                             ${cinzel.className}`}
                    style={{ letterSpacing: '0.2em' }}
                  >
                    RÉSERVER
                    
                  </button> */}
                    <ReserveButton eventId={event._id} />

                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}