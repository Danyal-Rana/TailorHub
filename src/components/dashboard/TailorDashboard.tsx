'use client';
import { motion } from 'framer-motion';
import { ShoppingBag, Scissors, Users, AlertCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function TailorDashboard() {
  const stats = [
    { label: 'Active Orders', value: '12', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: "This Week's Pickups", value: '5', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Pending Measurements', value: '3', icon: Scissors, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Inventory Alerts', value: '2', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-black text-slate-900">Tailor Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/orders/new" className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Order
          </Link>
          <Link href="/customers" className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900">
            <Users className="w-4 h-4" /> Add Customer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Orders</h2>
          <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            <p>No recent orders found.</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Awaiting Measurement</h2>
          <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            <p>No customers awaiting measurement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
