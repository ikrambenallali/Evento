import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Routes publiques
  const publicRoutes = ['/', '/events', '/login', '/register'];
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  // Routes par rôle
  const isAdminRoute = pathname.startsWith('/admin');
  const isParticipantRoute =
    pathname.startsWith('/my-reservations') ||
    pathname.startsWith('/tickets');

  // 🚫 Pas connecté
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔐 Vérification rôle
  if (token) {
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/events', request.url));
      }

      if (isParticipantRoute && payload.role !== 'participant') {
        return NextResponse.redirect(new URL('/events', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/my-reservations/:path*',
    '/tickets/:path*',
  ],
};
