'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp, verifyOtp } from '@/lib/auth-helpers';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';

export function PhoneAuthForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [confirmation, setConfirmation] = useState<Awaited<ReturnType<typeof sendOtp>> | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    setLoading(true);
    try {
      const c = await sendOtp(phone);
      setConfirmation(c);
      toast.success('OTP sent to ' + phone);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!confirmation) return;
    setLoading(true);
    try {
      await verifyOtp(confirmation, otp, 'User');
      router.push('/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <button onClick={onSend} disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Sending…' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="w-full px-4 py-4 rounded-2xl border bg-slate-50 tracking-widest text-center text-2xl"
          />
          <button onClick={onVerify} disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Verifying…' : 'Verify & Sign In'}
          </button>
        </>
      )}
    </div>
  );
}
