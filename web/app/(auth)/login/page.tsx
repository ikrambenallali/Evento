'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../features/authSlice';
import { RootState } from '../../features/store';
import api from '../../lib/axios';
import Link from 'next/link';
import { Playfair_Display, Cinzel } from 'next/font/google';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';



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

export default function LoginPage() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const token = response.data.access_token;
            const decoded: any = jwtDecode(token);

            const user = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
            };

            dispatch(
                loginSuccess({
                    user,
                    token,
                })
            );

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('token apres login :', token);
            router.push('/events');
        } catch (err: any) {
            dispatch(
                loginFailure(
                    err.response?.data?.message || 'Email ou mot de passe incorrect'
                )
            );
        }
    };


    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background avec dégradé inspiré du palais */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950">
                {/* Motifs décoratifs subtils */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
                </div>

                {/* Texture overlay */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                {/* Login Card */}
                <div className="w-full max-w-md">
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <Link href="/">
                            <h1
                                className={`text-5xl sm:text-6xl md:text-7xl tracking-wide text-orange-200 cursor-pointer hover:text-orange-300 transition-colors ${playfairDisplay.className}`}
                            >
                                𝓔𝓥𝓔𝓝𝓣𝓞
                            </h1>
                        </Link>

                    </div>

                    {/* Form Card */}
                    <form
                        onSubmit={handleLogin}
                        className="bg-gradient-to-b from-amber-900/40 to-amber-950/40 backdrop-blur-xl border-2 border-orange-200/30 rounded-2xl shadow-2xl p-8 sm:p-10"
                    >
                        {/* Email Field */}
                        <div className="mb-6">
                            <label
                                className={`block text-orange-100 text-sm mb-2 tracking-wide ${cinzel.className}`}
                                style={{ letterSpacing: '0.1em' }}
                            >
                                EMAIL
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-amber-950/50 border-2 border-orange-200/30 rounded-lg 
                         text-orange-50 placeholder-orange-200/40 
                         focus:outline-none focus:border-orange-200 focus:ring-2 focus:ring-orange-200/20
                         transition-all duration-300"
                                placeholder="votre@email.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label
                                className={`block text-orange-100 text-sm mb-2 tracking-wide ${cinzel.className}`}
                                style={{ letterSpacing: '0.1em' }}
                            >
                                MOT DE PASSE
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-amber-950/50 border-2 border-orange-200/30 rounded-lg 
                           text-orange-50 placeholder-orange-200/40 
                           focus:outline-none focus:border-orange-200 focus:ring-2 focus:ring-orange-200/20
                           transition-all duration-300 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-200/60 hover:text-orange-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-900/40 border-2 border-red-400/40 rounded-lg backdrop-blur-sm">
                                <p className="text-red-200 text-sm text-center">{error}</p>
                            </div>
                        )}


                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 bg-orange-200 text-amber-950 rounded-full font-light 
                       hover:bg-orange-300 transition-all duration-300 
                       shadow-lg hover:shadow-orange-300/40
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${cinzel.className}`}
                            style={{ letterSpacing: '0.2em' }}
                        >
                            {loading ? 'CONNEXION...' : 'SE CONNECTER'}
                        </button>

                        {/* Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-1 border-t border-orange-200/30"></div>
                            <span className="px-4 text-orange-200/60 text-xs">OU</span>
                            <div className="flex-1 border-t border-orange-200/30"></div>
                        </div>

                        {/* Sign Up Link */}
                        <p className={`text-center text-orange-100/70 text-sm ${cinzel.className}`}>
                            Vous n'avez pas de compte ?{' '}
                            <Link
                                href="/register"
                                className="text-orange-200 hover:text-orange-300 transition-colors font-medium"
                            >
                                S'inscrire
                            </Link>
                        </p>
                    </form>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
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
        </div>
    );
}