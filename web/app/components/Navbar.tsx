import Link from 'next/link';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export default function Navbar() {
  return (
    <nav className="w-full flex justify-end items-center p-6 md:p-8 bg-transparent absolute top-0 z-20">
      <div className="flex gap-4 md:gap-6">
        <Link href="/login">
          <button
            className={`px-6 py-2  text-white font-light rounded-full hover:bg-white/10 hover:border-1 hover:border-orange-300  text-sm tracking-wider ${cinzel.className}`}
            style={{ letterSpacing: '0.15em' }}
          >
            Connexion
          </button>
        </Link>
        <Link href="/register">
          <button
            className={`px-6 py-2    text-white font-light rounded-full   hover:bg-white/10 hover:border-1 hover:border-orange-300 shadow-xl  text-sm tracking-wider ${cinzel.className}`}
            style={{ letterSpacing: '0.15em' }}
          >
            S'inscrire  
          </button>
        </Link>
      </div>
    </nav>
  );
}
