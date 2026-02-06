'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/authSlice';
import { Cinzel } from 'next/font/google';
import { useEffect } from 'react';
import { loginSuccess } from '../features/authSlice';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export default function Navbar() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            dispatch(loginSuccess({ token, user: JSON.parse(user) }));
        }
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    console.log('User:', user, 'Token:', token); // pour debug

    return (
        <nav className="w-full flex justify-end items-center p-6 md:p-8 bg-transparent absolute top-0 z-20">
            <div className="flex gap-4 md:gap-6">
                {!user ? (
                    <>
                        <Link href="/login">
                            <button className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>
                                Connexion
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 shadow-xl ${cinzel.className}`}>
                                S'inscrire
                            </button>
                        </Link>
                    </>
                ) : user.role?.toUpperCase() === 'PARTICIPANT' ? (
                    <>
                        <Link href="/events"><button className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Événements</button></Link>
                        <Link href="/my-reservations"><button className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Mes réservations</button></Link>
                        <button onClick={handleLogout} className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Logout</button>
                    </>
                ) : user.role?.toUpperCase() === 'ADMIN' ? (
                    <>
                        <Link href="/events"><button className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Événements</button></Link>
                        <Link href="/reservations"><button className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Liste des réservations</button></Link>
                        <button onClick={handleLogout} className={`px-6 py-2 text-white font-light rounded-full hover:bg-white/10 ${cinzel.className}`}>Logout</button>
                    </>
                ) : null}
            </div>
        </nav>
    );
}
