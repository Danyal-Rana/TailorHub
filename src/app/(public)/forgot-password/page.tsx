'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Scissors, Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-premium border border-slate-100">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="bg-brand-600 p-2 rounded-xl">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-black text-slate-900">TailorHub</span>
        </Link>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Check your inbox</h2>
            <p className="text-slate-500 mb-6">
              We sent a reset link to <strong className="text-slate-700">{email}</strong>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-display font-black text-slate-900 mb-2">Reset password</h1>
            <p className="text-slate-500 mb-8">Enter your email and we&apos;ll send a reset link.</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <Link
              href="/login"
              className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mt-6 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
