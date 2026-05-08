'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listOrdersForRole } from '@/services/orderService';
import { OrderCard } from '@/components/orders/OrderCard';
import { Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { appUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    listOrdersForRole(appUser.role, appUser.uid).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, [appUser]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-black text-slate-900">Orders</h1>
        {(appUser?.role === 'admin' || appUser?.role === 'tailor' || appUser?.role === 'customer') && (
          <Link href="/orders/new" className="btn-primary px-4 py-2 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> New Order
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-20 text-center text-slate-500">
          No orders found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
