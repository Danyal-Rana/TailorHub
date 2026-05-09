import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Scissors, Star, Ruler, Truck, ShieldCheck } from 'lucide-react';

export const metadata = { title: 'Sign In — TailorHub' };

const PERKS = [
  { icon: Ruler, text: 'Digital measurement records' },
  { icon: Truck, text: 'Real-time delivery tracking' },
  { icon: ShieldCheck, text: 'Secure payment processing' },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex items-center justify-center p-8 bg-white">
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

      {/* Right — visual panel */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 relative overflow-hidden p-14">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/15 rounded-full blur-3xl" />

        <div className="relative z-10">
          <blockquote className="text-white/90 text-3xl font-display font-bold leading-snug mb-12">
            &ldquo;Where every stitch tells a story of craftsmanship and care.&rdquo;
          </blockquote>

          <ul className="space-y-4 mb-12">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/80">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-300" />
                </div>
                <span className="font-medium">{text}</span>
              </li>
            ))}
          </ul>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/60?u=login${i}`}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-brand-700 object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />)}
              </div>
              <p className="text-white/80 text-sm">
                <strong className="text-white">500+</strong> tailors trust TailorHub
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
