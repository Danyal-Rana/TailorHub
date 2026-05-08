'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';
import type { Role } from '@/lib/types';

const schema = z.object({
  displayName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  role: z.enum(['customer', 'tailor'] as const),
});
type Fields = z.infer<typeof schema>;

export function SignupForm() {
  const { signUpEmail } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUpEmail(data.email, data.password, data.displayName, data.role as Role);
      if (data.role === 'tailor') {
        router.push('/pending-approval');
      } else {
        router.push('/dashboard');
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Sign-up failed');
    }
  });

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            {...register('displayName')}
            placeholder="Full name"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          {errors.displayName && <p className="text-rose-500 text-sm mt-1">{errors.displayName.message}</p>}
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            {...register('email')}
            type="email"
            placeholder="you@email.com"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          {errors.password && <p className="text-rose-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-600 mb-2">I am a…</p>
          <div className="grid grid-cols-2 gap-3">
            {(['customer', 'tailor'] as const).map((r) => (
              <label
                key={r}
                className="relative flex items-center justify-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition-all has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
              >
                <input {...register('role')} type="radio" value={r} className="sr-only" />
                <span className="font-semibold capitalize text-slate-700">{r}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Creating account…' : 'Create Account'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-slate-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <GoogleButton />

      <p className="text-center text-slate-500 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
