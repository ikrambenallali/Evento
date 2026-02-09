'use client';

import ProtectedRoute from '../components/ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="">
        
        <main className="">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
