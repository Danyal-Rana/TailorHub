'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listOrdersForRole } from '@/services/orderService';
import { OrderCard } from '@/components/orders/OrderCard';
import { Loader2, PlusCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
  const { appUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    listOrdersForRole(appUser.role, appUser.uid).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, [appUser]);

  const canCreate = appUser?.role === 'admin' || appUser?.role === 'tailor' || appUser?.role === 'customer';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">{appUser?.role === 'customer' ? 'My Orders' : 'Orders'}</h1>
        {canCreate && (
          <Link href="/orders/new" className="btn-primary px-4 py-2.5 text-sm">
            <PlusCircle className="w-4 h-4" /> New Order
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-20 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">No orders yet</p>
            {canCreate && (
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                <Link href="/orders/new" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                  Create your first order
                </Link>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
