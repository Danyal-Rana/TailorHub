import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';
import { Scissors, Ruler, Star, Users, TrendingUp } from 'lucide-react';

export const metadata = { title: 'Create Account — TailorHub' };

const STATS = [
  { icon: Users, value: '500+', label: 'Expert Tailors' },
  { icon: TrendingUp, value: '85K+', label: 'Orders Completed' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
];

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
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

      {/* Right — visual panel */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 relative overflow-hidden p-14">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-bold mb-8">
            <Ruler className="w-4 h-4 text-brand-300" />
            Built for the tailoring industry
          </div>

          <h2 className="text-4xl font-display font-black text-white mb-6 leading-tight">
            Everything your workshop needs in one place.
          </h2>

          <p className="text-brand-200 text-lg mb-12 leading-relaxed">
            Manage orders, track measurements, coordinate deliveries, and grow your business with tools designed specifically for tailors.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <Icon className="w-5 h-5 text-brand-300 mx-auto mb-2" />
                <p className="text-2xl font-display font-black text-white">{value}</p>
                <p className="text-white/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <p className="text-white/80 text-sm italic mb-3">
              &ldquo;TailorHub made managing my shop so much easier. I handle 3× the orders with half the effort.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/60?u=signup_tailor" alt="" className="w-8 h-8 rounded-full border-2 border-brand-600 object-cover" />
              <div>
                <p className="text-white text-sm font-bold">Hamza Sheikh</p>
                <p className="text-white/50 text-xs">Master Tailor, Lahore</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
