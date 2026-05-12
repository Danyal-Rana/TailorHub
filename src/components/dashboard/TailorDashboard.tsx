'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Scissors, Users, AlertCircle, PlusCircle, Loader2 } from 'lucide-react';
import { listOrdersForRole } from '@/services/orderService';
import { listPendingRequests } from '@/services/measurementService';
import { listCustomers } from '@/services/customerService';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import type { Order } from '@/lib/types';
import Link from 'next/link';

export function TailorDashboard() {
  const { appUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingMeasurements, setPendingMeasurements] = useState<any[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    Promise.all([
      listOrdersForRole(appUser.role, appUser.uid),
      listPendingRequests(),
      listCustomers(),
    ]).then(([ords, reqs, customers]) => {
      setOrders(ords);
      setPendingMeasurements(reqs);
      setCustomerCount(customers.length);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [appUser]);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: 'Active Orders',       value: activeOrders.length,                             icon: ShoppingBag, color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Customers',     value: customerCount,                                    icon: Users,       color: 'text-brand-600 dark:text-brand-400',     bg: 'bg-brand-100 dark:bg-brand-900/30' },
    { label: 'Pending Measurements', value: pendingMeasurements.length,                     icon: Scissors,    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Ready for Pickup',    value: orders.filter(o => o.status === 'ready').length, icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-100 dark:bg-amber-900/30' },
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
        <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/orders/new" className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Order
          </Link>
          <Link href="/customers" className="px-4 py-2 text-sm inline-flex items-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-2xl font-bold transition">
            <Users className="w-4 h-4" /> Customers
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
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
                Create the first order →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map(order => (
                <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{order.dressType}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Rs. {order.price?.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {order.createdAt?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Measurement Requests</h2>
            <Link href="/measurements" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View all →
            </Link>
          </div>
          {pendingMeasurements.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <Scissors className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMeasurements.slice(0, 5).map((req: any) => (
                req.customerId ? (
                  <Link key={req.id} href={`/measurements/${req.customerId}`} className="block">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 hover:border-amber-300 transition-colors">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 capitalize">
                        {req.reason?.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{req.message || 'No message'}</p>
                    </div>
                  </Link>
                ) : (
                  <div key={req.id} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 capitalize">
                      {req.reason?.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{req.message || 'No message'}</p>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
