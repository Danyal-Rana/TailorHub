import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Scissors } from 'lucide-react';

export const metadata = { title: 'Sign In — TailorHub' };

export default function LoginPage() {
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
          <h1 className="text-3xl font-display font-black text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to your workspace</p>
          <LoginForm />
        </div>
      </div>
      <div className="hidden lg:block bg-gradient-to-br from-brand-900 via-brand-700 to-accent-gold relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <blockquote className="text-white/90 text-3xl font-display font-bold leading-relaxed">
            &ldquo;Where every stitch tells a story of craftsmanship and care.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
