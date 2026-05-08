'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowRight, Truck, Scissors, ShoppingBag } from 'lucide-react';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';
import type { Role } from '@/lib/types';

const schema = z.object({
  displayName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  role: z.enum(['customer', 'tailor', 'delivery'] as const),
});
type Fields = z.infer<typeof schema>;

const ROLE_CONFIG = [
  { id: 'customer', label: 'Customer', icon: ShoppingBag, desc: 'I want to order custom clothes' },
  { id: 'tailor', label: 'Tailor', icon: Scissors, desc: 'I want to manage my tailoring shop' },
  { id: 'delivery', label: 'Delivery', icon: Truck, desc: 'I want to deliver packages' },
] as const;

export function SignupForm() {
  const { signUpEmail } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  });

  const selectedRole = watch('role');

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUpEmail(data.email, data.password, data.displayName, data.role as Role);
      if (data.role === 'tailor' || data.role === 'delivery') {
        router.push('/pending-approval');
      } else {
        router.push('/dashboard');
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Sign-up failed');
    }
  });

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('displayName')}
              placeholder="Full name"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            {errors.displayName && <p className="text-rose-500 text-sm mt-1 ml-2">{errors.displayName.message}</p>}
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@email.com"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            {errors.email && <p className="text-rose-500 text-sm mt-1 ml-2">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            {errors.password && <p className="text-rose-500 text-sm mt-1 ml-2">{errors.password.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 ml-2 mb-3 block">I want to join as a…</label>
          <div className="grid gap-3">
            {ROLE_CONFIG.map((r) => (
              <label
                key={r.id}
                className={`group relative flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                  selectedRole === r.id 
                  ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <input {...register('role')} type="radio" value={r.id} className="sr-only" />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedRole === r.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  <r.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${selectedRole === r.id ? 'text-indigo-900' : 'text-slate-900'}`}>{r.label}</p>
                  <p className="text-xs text-slate-500">{r.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === r.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'
                }`}>
                  {selectedRole === r.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account…' : 'Create Account'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">OR</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <GoogleButton />

      <p className="text-center text-slate-500 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
