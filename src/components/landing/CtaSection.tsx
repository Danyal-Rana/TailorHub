'use client';
import Link from 'next/link';
import { ArrowRight, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

export function CtaSection() {
  return (
    <section className="py-28 px-4 bg-brand-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-700/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-8 shadow-xl shadow-brand-800">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-display font-black text-white mb-6 leading-tight">
            Ready to elevate your craft?
          </h2>
          <p className="text-brand-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join 500+ tailors who are already running smarter workshops with TailorHub. It&apos;s free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-brand-900 rounded-2xl font-bold hover:bg-brand-50 transition-all flex items-center justify-center gap-2 group shadow-xl"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-brand-800 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all border border-brand-700 flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
          <p className="text-brand-500 text-sm mt-6">No credit card required · Free forever for customers</p>
        </motion.div>
      </div>
    </section>
  );
}
