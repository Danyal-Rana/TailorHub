'use client';
import { AuthGate } from '@/components/auth/AuthGate';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-slate-50/50">
        {children}
      </div>
    </AuthGate>
  );
}
