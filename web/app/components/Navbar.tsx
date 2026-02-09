'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/authSlice';
import { Cinzel } from 'next/font/google';
import { useEffect } from 'react';
import { loginSuccess } from '../features/authSlice';
import { useRouter } from 'next/navigation';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export default function Navbar() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const Router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Router.push('/events');
    };

    return (
<nav className="sticky fixed top-0 right-0 w-full flex justify-end p-2 z-50 bg-orange-200">
            <div className="flex gap-4 md:gap-6">
                {!user ? (
                    <>
                        <Link href="/login">
                            <button className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>
                                Connexion
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 shadow-xl ${cinzel.className}`}>
                                S'inscrire
                            </button>
                        </Link>
                    </>
                ) : user.role?.toUpperCase() === 'PARTICIPANT' ? (
                    <>
                        <Link href="/events"><button className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Événements</button></Link>
                        <Link href="/my-reservations"><button className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Mes réservations</button></Link>
                        <button onClick={handleLogout} className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Logout</button>
                    </>
                ) : user.role?.toUpperCase() === 'ADMIN' ? (
                    <>
                        <Link href="/events"><button className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Événements</button></Link>
                        <Link href="/admin/events"><button className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Gestion des événements</button></Link>
                        <Link href="/admin/reservations"><button className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Liste des réservations</button></Link>
                        <button onClick={handleLogout} className={`px-6 py-2 text-amber-950 font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Logout</button>
                    </>
                ) : null}
            </div>
        </nav>
    );
}
