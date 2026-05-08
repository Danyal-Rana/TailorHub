'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { sendOtp, verifyOtp } from '@/lib/auth-helpers';
import { toast } from 'sonner';
import { Mail, Phone, Lock, ArrowRight, Smartphone, Mail as MailIcon } from 'lucide-react';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';

type Tab = 'email' | 'phone';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
      toast.success('OTP sent successfully');
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
      toast.error(e instanceof Error ? e.message : 'Invalid OTP code');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        <button
          type="button"
          onClick={() => setTab('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            tab === 'email' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MailIcon className="w-4 h-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setTab('phone')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            tab === 'phone' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Phone
        </button>
      </div>

      {tab === 'email' && (
        <form onSubmit={onEmailSubmit} className="space-y-5">
          <div className="space-y-4">
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
          
          <div className="text-right">
            <Link href="/forgot-password" size="sm" className="text-sm font-bold text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      )}

      {tab === 'phone' && (
        <div className="space-y-5">
          <div id="recaptcha-container" />
          {!confirmation ? (
            <>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={onSendOtp}
                disabled={otpLoading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {otpLoading ? 'Sending OTP…' : 'Send Verification Code'}
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full px-4 py-6 rounded-2xl border bg-slate-50 tracking-[1em] text-center text-3xl font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  maxLength={6}
                />
                <p className="text-center text-xs text-slate-500 font-medium">Enter the 6-digit code sent to your phone</p>
              </div>
              <button
                type="button"
                onClick={onVerifyOtp}
                disabled={otpLoading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {otpLoading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
              <button 
                type="button"
                onClick={() => setConfirmation(null)}
                className="w-full text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Change Phone Number
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">OR</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <GoogleButton />

      <p className="text-center text-slate-500 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
}
