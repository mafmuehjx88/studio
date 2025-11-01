import React from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard isAuthPage={true}>
      <div className="flex min-h-full flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">AT Game HUB</h1>
        {children}
      </div>
    </AuthGuard>
  );
}
