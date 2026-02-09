'use client';

import { useState } from 'react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

interface Props {
  reservationId: string;
}

export default function DownloadTicketButton({ reservationId }: Props) {
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/reservation/${reservationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${reservationId}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={download}
      disabled={downloading}
      className={`inline-flex items-center gap-2 px-6 py-2.5 bg-orange-200 text-amber-950 rounded-full font-light 
                 hover:bg-orange-300 transition-all duration-300 
                 shadow-lg hover:shadow-orange-300/40
                 disabled:opacity-50 disabled:cursor-not-allowed
                 ${cinzel.className}`}
      style={{ letterSpacing: '0.15em' }}
    >
      {downloading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
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
          <span className="text-sm">TÉLÉCHARGEMENT...</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-sm">TÉLÉCHARGER LE TICKET</span>
        </>
      )}
    </button>
  );
}