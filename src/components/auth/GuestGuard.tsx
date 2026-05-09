'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { fbUser, appUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!fbUser || !appUser) return;
    if (appUser.status === 'pending_approval' && pathname !== '/pending-approval') {
      router.replace('/pending-approval');
    } else if (appUser.status === 'active') {
      router.replace('/dashboard');
    }
  }, [fbUser, appUser, loading, router, pathname]);

  return <>{children}</>;
}
