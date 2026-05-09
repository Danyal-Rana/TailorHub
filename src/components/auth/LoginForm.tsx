'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { sendOtp, verifyOtp } from '@/lib/auth-helpers';
import { toast } from 'sonner';
import { Mail, Phone, Lock, ArrowRight, Smartphone } from 'lucide-react';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';

type Tab = 'email' | 'phone';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type EmailFields = z.infer<typeof emailSchema>;

function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  const handleChange = (i: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1);
    const arr = digits.map((d, idx) => (idx === i ? char : d === ' ' ? '' : d));
    onChange(arr.join('').trimEnd());
    if (char && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i]?.trim() && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-between" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d.trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          maxLength={1}
          inputMode="numeric"
          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none ${
            d.trim()
              ? 'border-brand-600 bg-brand-50 text-brand-800'
              : 'border-slate-200 bg-slate-50 focus:border-brand-400 focus:bg-white'
          }`}
        />
      ))}
    </div>
  );
}

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
  const [displayName, setDisplayName] = useState('');
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
    if (!phone.trim()) { toast.error('Enter your phone number'); return; }
    setOtpLoading(true);
    try {
      const c = await sendOtp(phone);
      setConfirmation(c);
      toast.success('Code sent to ' + phone);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to send code');
    } finally {
      setOtpLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!confirmation || otp.length < 6) return;
    setOtpLoading(true);
    try {
      await verifyOtp(confirmation, otp, displayName || 'User');
      router.push('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Invalid code — try again');
      setOtp('');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* recaptcha anchor — must stay in DOM whenever phone auth is possible */}
      <div id="recaptcha-container" />

      {/* Tab switcher */}
      <div className="flex bg-slate-100 rounded-2xl p-1">
        {(['email', 'phone'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              tab === t ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'email' ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            {t === 'email' ? 'Email' : 'Phone'}
          </button>
        ))}
      </div>

      {tab === 'email' && (
        <form onSubmit={onEmailSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@email.com"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all"
            />
            {errors.email && <p className="text-rose-500 text-sm mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all"
              />
            </div>
            {errors.password && <p className="text-rose-500 text-sm mt-1 ml-1">{errors.password.message}</p>}
            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-sm font-semibold text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      )}

      {tab === 'phone' && (
        <div className="space-y-4">
          {!confirmation ? (
            <>
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Your name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={onSendOtp}
                disabled={otpLoading}
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50"
              >
                {otpLoading ? 'Sending…' : 'Send Verification Code'}
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-slate-700 font-semibold">Enter the 6-digit code</p>
                <p className="text-slate-500 text-sm mt-1">Sent to <span className="font-medium">{phone}</span></p>
              </div>
              <OtpBoxes value={otp} onChange={setOtp} />
              <button
                type="button"
                onClick={onVerifyOtp}
                disabled={otpLoading || otp.length < 6}
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50"
              >
                {otpLoading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setConfirmation(null); setOtp(''); }}
                className="w-full text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Change phone number
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <GoogleButton />

      <p className="text-center text-slate-500 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-brand-600 font-bold hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
}
