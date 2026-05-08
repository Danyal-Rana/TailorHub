'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { sendOtp, verifyOtp } from '@/lib/auth-helpers';
import { toast } from 'sonner';
import { Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';

type Tab = 'email' | 'phone';

const emailSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});
type EmailFields = z.infer<typeof emailSchema>;

export function LoginForm() {
  const [tab, setTab] = useState<Tab>('email');
  const { signInEmail } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFields>({ resolver: zodResolver(emailSchema) });

  const [phone, setPhone] = useState('');
  const [confirmation, setConfirmation] = useState<Awaited<ReturnType<typeof sendOtp>> | null>(null);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const onEmailSubmit = handleSubmit(async (data) => {
    try {
      await signInEmail(data.email, data.password);
      router.push('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Sign-in failed');
    }
  });

  const onSendOtp = async () => {
    setOtpLoading(true);
    try {
      const c = await sendOtp(phone);
      setConfirmation(c);
      toast.success('OTP sent');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!confirmation) return;
    setOtpLoading(true);
    try {
      await verifyOtp(confirmation, otp, 'New User');
      router.push('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-100 rounded-xl p-1">
        {(['email', 'phone'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg font-semibold capitalize transition-all ${
              tab === t ? 'bg-white shadow text-brand-700' : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'email' && (
        <form onSubmit={onEmailSubmit} className="space-y-4">
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
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      )}

      {tab === 'phone' && (
        <div className="space-y-4">
          <div id="recaptcha-container" />
          {!confirmation ? (
            <>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+923001234567"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50"
                />
              </div>
              <button
                onClick={onSendOtp}
                disabled={otpLoading}
                className="btn-primary w-full py-4"
              >
                {otpLoading ? 'Sending…' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                className="w-full px-4 py-4 rounded-2xl border bg-slate-50 tracking-widest text-center text-2xl"
                maxLength={6}
              />
              <button
                onClick={onVerifyOtp}
                disabled={otpLoading}
                className="btn-primary w-full py-4"
              >
                {otpLoading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-slate-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <GoogleButton />

      <p className="text-center text-slate-500 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-brand-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
