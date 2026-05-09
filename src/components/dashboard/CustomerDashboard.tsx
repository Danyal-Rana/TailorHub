'use client';
import { motion } from 'framer-motion';
import { ShoppingBag, Scissors, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export function CustomerDashboard() {
  const { appUser } = useAuth();

  const stats = [
    { label: 'Total Orders', value: '4', icon: ShoppingBag, color: 'text-blue-600 dark:text-blue-400',        bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Pending',      value: '1', icon: Clock,        color: 'text-amber-600 dark:text-amber-400',      bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Completed',    value: '3', icon: CheckCircle,  color: 'text-emerald-600 dark:text-emerald-400',  bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 bg-gradient-to-r from-brand-50/80 to-transparent dark:from-brand-900/20 dark:to-transparent">
        {appUser?.photoURL ? (
          <Image
            src={appUser.photoURL}
            alt=""
            width={72}
            height={72}
            className="rounded-full border-4 border-white dark:border-slate-700 shadow-premium flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-200 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 text-2xl font-bold shadow-premium flex-shrink-0">
            {appUser?.displayName?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-white">
            Welcome back, {appUser?.displayName?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Ready to design your next masterpiece?</p>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/orders/new" className="btn-primary flex-1 md:flex-none text-sm px-5 py-2.5 text-center">
            Place New Order
          </Link>
          <Link
            href="/measurements/request"
            className="flex-1 md:flex-none px-5 py-2.5 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 font-bold text-slate-700 dark:text-slate-200 text-sm transition-all"
          >
            Request Measurement
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className={`p-3.5 rounded-2xl ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Orders</h2>
            <Link href="/orders" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View all →
            </Link>
          </div>
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-500">No recent orders.</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Measurements</h2>
            <Scissors className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <Scissors className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-500">No measurements on file.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
