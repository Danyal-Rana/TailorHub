'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Clock, Package, Loader2 } from 'lucide-react';
import { listDeliveries } from '@/services/deliveryService';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const STATUS_LABEL: Record<string, string> = {
  unassigned: 'Unassigned',
  assigned: 'Assigned',
  in_transit: 'In Transit',
  completed: 'Completed',
  failed: 'Failed',
};

const STATUS_COLOR: Record<string, string> = {
  unassigned: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  assigned: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  in_transit: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  completed: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  failed: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
};

export function DeliveryDashboard() {
  const { appUser } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    listDeliveries(appUser.role, appUser.uid)
      .then(setDeliveries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [appUser]);

  const pending = deliveries.filter(d => d.status !== 'completed' && d.status !== 'failed');
  const completed = deliveries.filter(d => d.status === 'completed');
  const inTransit = deliveries.filter(d => d.status === 'in_transit');

  const stats = [
    { label: 'Assigned to Me', value: deliveries.length, icon: Package,     color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'In Transit',     value: inTransit.length,  icon: Truck,       color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Pending',        value: pending.length,    icon: Clock,       color: 'text-brand-600 dark:text-brand-400',     bg: 'bg-brand-100 dark:bg-brand-900/30' },
    { label: 'Completed',      value: completed.length,  icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white">Delivery Dashboard</h1>
        <Link href="/deliveries" className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-2">
          <Truck className="w-4 h-4" /> All Deliveries
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Pending Deliveries</h2>
          <Link href="/deliveries" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            View all →
          </Link>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <Truck className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No pending deliveries.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.slice(0, 6).map((d: any) => (
              <div key={d.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[d.status] ?? STATUS_COLOR.unassigned}`}>
                      {STATUS_LABEL[d.status] ?? d.status}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">{d.type}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{d.dropAddress}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">From: {d.pickupAddress}</p>
                </div>
                {d.scheduledAt && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {d.scheduledAt?.toDate?.().toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
