'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (requireAdmin && user.role !== 'admin') {
        router.replace('/events');
      }
    }
  }, [user, loading, requireAdmin, router]);

  // ⏳ Pendant la récupération Redux
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#84a98c]" />
      </div>
    );
  }

  // 🚫 Accès refusé
  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null;
  }

  // ✅ Accès autorisé
  return <>{children}</>;
}
