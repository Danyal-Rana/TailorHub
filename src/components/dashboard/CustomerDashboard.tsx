'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Scissors, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listOrdersForRole } from '@/services/orderService';
import { getMyMeasurements } from '@/services/measurementService';
import { StatusBadge } from '@/components/orders/StatusBadge';
import type { Order, Measurement } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export function CustomerDashboard() {
  const { appUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    if (!appUser) return;
    listOrdersForRole(appUser.role, appUser.uid).then(setOrders).catch(() => {});
    getMyMeasurements(appUser.uid).then(setMeasurements).catch(() => {});
  }, [appUser]);

  const total = orders.length;
  const pending = orders.filter(o => ['pending', 'in_progress', 'measurement_needed'].includes(o.status)).length;
  const completed = orders.filter(o => o.status === 'delivered').length;

  const stats = [
    { label: 'Total Orders', value: String(total),     icon: ShoppingBag, color: 'text-blue-600 dark:text-blue-400',        bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Pending',      value: String(pending),   icon: Clock,        color: 'text-amber-600 dark:text-amber-400',      bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Completed',    value: String(completed), icon: CheckCircle,  color: 'text-emerald-600 dark:text-emerald-400',  bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];
  const recentOrders = orders.slice(0, 5);
  const latestMeasurement = measurements[0] ?? null;

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
          {recentOrders.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No orders yet.</p>
              <Link href="/orders/new" className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline mt-1 inline-block">
                Place your first order →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{order.dressType}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Rs. {order.price?.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{order.createdAt?.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">My Measurements</h2>
            <Link href="/measurements" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View all →
            </Link>
          </div>
          {latestMeasurement ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                Latest — {latestMeasurement.createdAt?.toDate().toLocaleDateString()}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(['chest','waist','hips','shoulder','sleeves','length'] as const).map(field => (
                  latestMeasurement[field] != null && (
                    <div key={field} className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg text-center">
                      <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{field}</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{latestMeasurement[field]}</p>
                    </div>
                  )
                ))}
              </div>
              <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                Unit: {latestMeasurement.unit} · Version {latestMeasurement.version}
              </p>
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <Scissors className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No measurements on file.</p>
              <Link href="/measurements/request" className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline mt-1 inline-block">
                Request measurement →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
