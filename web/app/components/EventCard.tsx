import Link from 'next/link';
import { Event } from '../types/event';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="group bg-gradient-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border border-orange-200/30 rounded-xl shadow-lg overflow-hidden hover:border-orange-200/50 transition-all duration-300 hover:shadow-orange-200/10 hover:scale-[1.02]">
      {/* Image - Plus petite */}
      {event.photoUrl && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${event.photoUrl}`}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Content - Plus compact */}
      <div className="p-4">
        {/* Title */}
        <h2
          className={`text-base font-semibold text-orange-100 mb-2 line-clamp-1 group-hover:text-orange-200 transition-colors ${cinzel.className}`}
        >
          {event.title}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2">
          <svg
            className="w-3.5 h-3.5 text-orange-200/60 flex-shrink-0"
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
          <p className="text-xs text-orange-200/70 line-clamp-1">{event.location}</p>
        </div>

        {/* Description */}
        <p className="text-xs text-orange-100/60 line-clamp-2 mb-3 leading-relaxed">
          {event.description}
        </p>

        {/* Link */}
        <Link
          href={`/events/${event._id}`}
          className={`inline-flex items-center gap-1.5 text-orange-200 hover:text-orange-300 font-medium transition-colors group/link ${cinzel.className}`}
          style={{ letterSpacing: '0.05em' }}
        >
          <span className="text-xs">DÉTAILS</span>
          <svg
            className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}