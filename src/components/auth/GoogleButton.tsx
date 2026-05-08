'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function GoogleButton() {
  const { signInGoogle } = useAuth();
  const router = useRouter();

  const onClick = async () => {
    try {
      await signInGoogle();
      router.push('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Google sign-in failed');
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 hover:border-brand-300 transition-all"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        className="w-5 h-5"
        alt=""
      />
      Continue with Google
    </button>
  );
}
