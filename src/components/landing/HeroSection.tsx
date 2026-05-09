'use client';
import Link from 'next/link';
import { ArrowRight, Star, Play, Scissors } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const PROGRESS_STEPS = [
  { label: 'Cutting', pct: 100 },
  { label: 'Stitching', pct: 65 },
  { label: 'Finishing', pct: 20 },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-16 pb-24 px-4 overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent-gold/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left — copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-bold mb-6">
            <Star className="w-4 h-4 fill-current" />
            #1 Tailoring Management Platform
          </motion.div>

          <motion.h1 variants={item} className="text-5xl lg:text-[4.25rem] font-display font-black text-slate-900 leading-[1.05] mb-6">
            Where{' '}
            <span className="relative inline-block text-brand-600">
              Threads
              <motion.span
                className="absolute left-0 h-[3px] bg-brand-600 rounded-full w-full"
                style={{ bottom: '-2px', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
              />
            </span>
            {' '}Meet Excellence.
          </motion.h1>

          <motion.p variants={item} className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
            The complete platform for tailors, customers, and delivery partners. Manage measurements, track orders, and grow your business — all in one place.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-2 group"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white text-slate-800 rounded-2xl font-bold hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center gap-2 shadow-sm">
              <Play className="w-4 h-4 text-brand-600 fill-current" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-6 mt-10 pt-10 border-t border-slate-100">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-brand-200 to-brand-400 overflow-hidden">
                  <img src={`https://i.pravatar.cc/80?u=th${i}`} alt="" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />)}
              </div>
              <p className="text-sm text-slate-600">
                <strong className="text-slate-900">500+ tailors</strong> already joined
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — app mockup */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <div className="relative bg-gradient-to-br from-brand-600 to-brand-900 rounded-3xl p-8 overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-4">
              <div className="flex justify-between items-start mb-5">
                <div className="text-white">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Latest Order</p>
                  <p className="text-lg font-bold mt-1">Bespoke Navy Suit</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/30">
                  In Progress
                </span>
              </div>
              <div className="space-y-3">
                {PROGRESS_STEPS.map((step) => (
                  <div key={step.label}>
                    <div className="flex justify-between text-xs text-white/60 mb-1.5">
                      <span>{step.label}</span><span>{step.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white/60 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${step.pct}%` }}
                        transition={{ duration: 1.2, delay: 0.6 + step.pct * 0.004, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 relative">
              {[{ label: 'Orders', value: '128' }, { label: 'Customers', value: '84' }, { label: 'Revenue', value: '₨2.4M' }].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
                  <p className="text-white font-bold">{stat.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -top-5 -right-5 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">New Order</p>
              <p className="text-sm font-bold text-slate-900">Sherwani</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Rating received</p>
              <p className="text-sm font-bold text-slate-900">5.0 ⭐</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
