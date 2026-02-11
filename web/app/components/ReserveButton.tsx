'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

interface Props {
  eventId: string;
}

export default function ReserveButton({ eventId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReserve = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur réservation');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/my-reservations');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {/* Bouton principal */}
      <button
        onClick={handleReserve}
        disabled={loading || success}
        className={`w-full sm:w-auto px-10 py-3.5 bg-orange-200 text-amber-950 rounded-full font-light 
                   hover:bg-orange-300 transition-all duration-300 
                   shadow-lg hover:shadow-orange-300/40
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2
                   ${cinzel.className}`}
        style={{ letterSpacing: '0.2em' }}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
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
            <span>RÉSERVATION...</span>
          </>
        ) : success ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>RÉSERVÉ !</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <span>RÉSERVER</span>
          </>
        )}
      </button>

      {/* Message de succès */}
      {success && (
        <div className="mt-4 p-4 bg-green-900/40 border-2 border-green-400/40 rounded-lg backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-green-300 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-green-200 font-medium">
                Réservation confirmée !
              </p>
              <p className="text-green-200/70 text-sm mt-0.5">
                Redirection vers vos réservations...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/40 border-2 border-red-400/40 rounded-lg backdrop-blur-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-red-200 font-medium">Erreur de réservation</p>
              <p className="text-red-200/80 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info supplémentaire */}
      {!success && !error && (
        <p className="text-orange-100/50 text-xs text-center mt-3">
          Vous serez redirigé vers vos réservations après confirmation
        </p>
      )}
    </div>
  );
}