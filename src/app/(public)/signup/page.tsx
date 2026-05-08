import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';
import { Scissors } from 'lucide-react';

export const metadata = { title: 'Create Account — TailorHub' };

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="bg-brand-600 p-2 rounded-xl">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-black text-slate-900">TailorHub</span>
          </Link>
          <h1 className="text-3xl font-display font-black text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">Join TailorHub and transform your workshop</p>
          <SignupForm />
        </div>
      </div>
      <div className="hidden lg:block bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 gap-8">
          <div className="text-center">
            <div className="text-6xl font-display font-black text-white mb-4">500+</div>
            <div className="text-white/70 text-xl">Tailors trust TailorHub</div>
          </div>
        </div>
      </div>
    </div>
  );
}
