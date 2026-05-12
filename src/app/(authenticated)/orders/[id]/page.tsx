'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrder, updateOrderStatus } from '@/services/orderService';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import type { OrderStatus } from '@/lib/types';

const STATUS_OPTIONS: OrderStatus[] = [
  'pending', 'measurement_needed', 'in_progress', 'ready',
  'out_for_delivery', 'delivered', 'cancelled',
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { appUser } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(data => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
    </div>
  );
  if (!order) return (
    <div className="glass-card p-20 text-center text-slate-500 dark:text-slate-400">Order not found.</div>
  );

  const handleStatusChange = async (newStatus: OrderStatus) => {
    await updateOrderStatus(id, newStatus, order.customerUid);
    setOrder({ ...order, status: newStatus });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">
            Order #{id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{order.dressType}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="section-title">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="label-muted">Customer</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium mt-0.5">{order.customerName || order.customerId}</p>
              </div>
              <div>
                <p className="label-muted">Created</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium mt-0.5">
                  {order.createdAt?.toDate().toLocaleString()}
                </p>
              </div>
              <div>
                <p className="label-muted">Total Price</p>
                <p className="text-slate-900 dark:text-slate-100 font-semibold mt-0.5">Rs. {order.price?.toLocaleString()}</p>
              </div>
              <div>
                <p className="label-muted">Advance Paid</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Rs. {order.advancePaid?.toLocaleString()}</p>
              </div>
            </div>

            {order.fabricDetails && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="label-muted mb-1">Fabric Details</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{order.fabricDetails}</p>
              </div>
            )}
            {order.notes && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="label-muted mb-1">Notes</p>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>

          {(order.fabricImages?.length > 0 || order.designImages?.length > 0) && (
            <div className="glass-card p-6 space-y-6">
              {order.fabricImages?.length > 0 && (
                <div>
                  <h2 className="section-title mb-4">Fabric Images</h2>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.fabricImages.map((img: string, i: number) => (
                      <div key={i} className="relative min-w-[110px] h-[110px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {order.designImages?.length > 0 && (
                <div>
                  <h2 className="section-title mb-4">Design References</h2>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.designImages.map((img: string, i: number) => (
                      <div key={i} className="relative min-w-[110px] h-[110px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="section-title mb-4">Timeline</h2>
            <OrderTimeline orderId={id} />
          </div>

          {(appUser?.role === 'admin' || appUser?.role === 'tailor') && (
            <div className="glass-card p-6 space-y-3">
              <h2 className="section-title">Update Status</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Changing status will notify the customer.</p>
              <select
                value={order.status}
                onChange={e => handleStatusChange(e.target.value as OrderStatus)}
                className="input-base w-full capitalize"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
