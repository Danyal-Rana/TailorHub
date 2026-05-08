'use client';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/lib/types';

interface Props {
  allow: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allow, children, fallback = null }: Props) {
  const { appUser } = useAuth();
  if (!appUser) return null;
  if (!allow.includes(appUser.role)) return <>{fallback}</>;
  return <>{children}</>;
}
