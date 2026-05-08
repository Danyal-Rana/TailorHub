'use client';
import Link from 'next/link';
import { ArrowRight, Scissors, Ruler, Truck, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Scissors className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              TailorHub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-slate-600 font-semibold hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6">
              <Star className="w-4 h-4 fill-current" />
              Revolutionizing Custom Tailoring
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              Where <span className="text-indigo-600">Threads</span> Meet Excellence.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Experience the future of bespoke fashion. Manage measurements, track orders, and connect with expert tailors in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group">
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex -space-x-3 items-center px-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
                <div className="pl-6 text-sm text-slate-500">
                  <span className="font-bold text-slate-900 block">500+ Tailors</span>
                  Joined already
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-indigo-600 overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 w-full">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-white">
                      <p className="text-sm opacity-80">Latest Order</p>
                      <p className="text-2xl font-bold">Bespoke Navy Suit</p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold border border-green-500/30">
                      In Progress
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-white/40 rounded-full w-[${30 * i}%]`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border animate-bounce">
              <Ruler className="text-indigo-600 w-8 h-8" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border">
              <Truck className="text-indigo-600 w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Precision in Every Stitch</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Our platform handles the complexity so you can focus on the craftsmanship.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Ruler, title: 'Smart Measurements', desc: 'Precision digital measurement records with history tracking.' },
              { icon: Truck, title: 'Reliable Delivery', desc: 'Dedicated delivery network for seamless fabric pickup and drop-off.' },
              { icon: ShieldCheck, title: 'Secure Payments', desc: 'Integrated payment processing with advance and final settlements.' },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
