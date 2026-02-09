import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Cinzel } from 'next/font/google';
import Navbar from './components/Navbar';

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
export default function WelcomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background Image with Opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image1.png"
          alt="Elegant Palace Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Overlay for opacity and better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center text-center px-4 ">
          <div className="text-orange-200">
            <h1
              className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[6rem] tracking-wide ${playfairDisplay.className}`}
            >
              𝓔𝓥𝓔𝓝𝓣𝓞
            </h1>
            <p className={`text-xs md:text-sm text-white/80 mt-2 tracking-widest uppercase font-light ${cinzel.className}`} style={{ letterSpacing: '0.1em' }}>
              La plateforme qui transforme chaque événement en une expérience d’exception, alliant élégance.
            </p>
            <div>
              <Link href="/events">
                <button
                  className={`mt-10 px-8 py-3 bg-orange-200 text-amber-950 rounded-full font-light hover:bg-orange-300 transition-all duration-300 shadow-lg hover:shadow-orange-300/40 ${cinzel.className}`}
                  style={{ letterSpacing: '0.2em' }}
                >
                  LES ÉVÉNEMENTS
                </button>

              </Link>
            </div>
          </div>


        </div>


      </div>
    </div>
  );
}