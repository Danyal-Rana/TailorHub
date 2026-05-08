'use client';
import { motion } from 'framer-motion';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PendingApprovalPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-amber-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-premium p-12 max-w-lg w-full text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-block bg-amber-100 p-6 rounded-full mb-6"
        >
          <Clock className="w-16 h-16 text-amber-600" />
        </motion.div>
        <h1 className="text-3xl font-display font-black text-slate-900 mb-3">Approval Pending</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Your account is awaiting admin approval. We&apos;ll notify you the moment you&apos;re
          cleared to enter the workshop.
        </p>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
