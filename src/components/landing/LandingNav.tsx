'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scissors, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <Scissors className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-display font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
            TailorHub
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {(['#features', '#how-it-works', '#testimonials'] as const).map((href, i) => (
            <a
              key={href}
              href={href}
              className="text-slate-600 hover:text-brand-600 font-medium text-sm transition-colors"
            >
              {(['Features', 'How it works', 'Testimonials'] as const)[i]}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-md shadow-brand-200"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#testimonials', 'Testimonials']].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-700 font-medium py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {label}
                </a>
              ))}
              <div className="flex gap-3 pt-3 mt-2 border-t border-slate-100">
                <Link href="/login" className="flex-1 py-3 text-center border border-slate-200 rounded-xl font-semibold text-slate-700 text-sm">Sign In</Link>
                <Link href="/signup" className="flex-1 py-3 text-center bg-brand-600 text-white rounded-xl font-bold text-sm">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
