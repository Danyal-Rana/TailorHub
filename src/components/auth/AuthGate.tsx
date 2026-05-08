'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { fbUser, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!fbUser) {
      router.replace('/login');
      return;
    }
    if (!appUser) return;
    if (appUser.status === 'pending_approval') {
      router.replace('/pending-approval');
      return;
    }
    if (appUser.status === 'rejected' || appUser.status === 'suspended') {
      router.replace('/login');
    }
  }, [fbUser, appUser, loading, router]);

  if (loading || !fbUser || !appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (appUser.status !== 'active') return null;

  return <>{children}</>;
}
