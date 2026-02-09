'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('ADMIN' | 'PARTICIPANT')[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = ['ADMIN', 'PARTICIPANT'], // par défaut tout le monde peut accéder
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Utilisateur non connecté
        router.replace('/login');
      } else if (!allowedRoles.includes(user.role)) {
        // Utilisateur connecté mais rôle non autorisé
        router.replace('/events'); // Redirection générique pour rôle non autorisé
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#84a98c]" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
