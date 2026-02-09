'use client';

import ProtectedRoute from '../components/ProtectedRoute';

interface ParticipantLayoutProps {
  children: React.ReactNode;
}

export default function ParticipantLayout({ children }: ParticipantLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={['PARTICIPANT']}>
      <div className="">
        <main className="">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
