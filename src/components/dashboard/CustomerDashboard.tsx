'use client';
import { motion } from 'framer-motion';
import { ShoppingBag, Scissors, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export function CustomerDashboard() {
  const { appUser } = useAuth();
  
  const stats = [
    { label: 'Total Orders', value: '4', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: '1', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Completed', value: '3', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-brand-50 to-white">
        {appUser?.photoURL ? (
          <Image src={appUser.photoURL} alt="" width={80} height={80} className="rounded-full border-4 border-white shadow-premium" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-brand-200 flex items-center justify-center text-brand-600 text-2xl font-bold shadow-premium">
            {appUser?.displayName?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-display font-black text-slate-900">Welcome back, {appUser?.displayName?.split(' ')[0] || 'Guest'}!</h1>
          <p className="text-slate-500 mt-1">Ready to design your next masterpiece?</p>
        </div>
        <div className="flex-1" />
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/orders/new" className="btn-primary flex-1 md:flex-none px-6 py-3 text-center">Place New Order</Link>
          <Link href="/measurements/request" className="flex-1 md:flex-none px-6 py-3 text-center bg-white border border-slate-200 rounded-2xl hover:border-brand-400 hover:bg-slate-50 font-bold text-slate-700 transition-all">Request Measurement</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${s.bg}`}>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">My Recent Orders</h2>
          <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            <p>You haven't placed any orders recently.</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">My Measurements</h2>
            <Scissors className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            <p>No measurements on file.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
