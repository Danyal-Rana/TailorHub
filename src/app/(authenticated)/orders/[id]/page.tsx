'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrder, updateOrderStatus } from '@/services/orderService';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function OrderDetailPage() {
  const params = useParams();
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>;
  if (!order) return <div className="p-20 text-center text-slate-500">Order not found.</div>;

  const handleStatusChange = async (newStatus: any) => {
    await updateOrderStatus(id, newStatus);
    setOrder({ ...order, status: newStatus });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900">Order #{id.slice(0,8).toUpperCase()}</h1>
          <p className="text-slate-500">{order.dressType}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 font-medium">Customer ID</p>
                <p className="text-slate-900">{order.customerId}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Created At</p>
                <p className="text-slate-900">{order.createdAt?.toDate().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Total Price</p>
                <p className="text-slate-900">Rs. {order.price}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Advance Paid</p>
                <p className="text-slate-900">Rs. {order.advancePaid}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <p className="text-slate-500 font-medium mb-1">Fabric Details</p>
              <p className="text-slate-900 whitespace-pre-wrap">{order.fabricDetails || 'N/A'}</p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-slate-500 font-medium mb-1">Notes</p>
              <p className="text-slate-900 whitespace-pre-wrap">{order.notes || 'N/A'}</p>
            </div>
          </div>

          {(order.fabricImages?.length > 0 || order.designImages?.length > 0) && (
            <div className="glass-card p-6 space-y-6">
              {order.fabricImages?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Fabric Images</h2>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.fabricImages.map((img: string, i: number) => (
                      <div key={i} className="relative min-w-[120px] h-[120px] rounded-xl overflow-hidden border border-slate-200">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {order.designImages?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Design References</h2>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.designImages.map((img: string, i: number) => (
                      <div key={i} className="relative min-w-[120px] h-[120px] rounded-xl overflow-hidden border border-slate-200">
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
            <h2 className="text-xl font-bold text-slate-800 mb-4">Timeline</h2>
            <OrderTimeline orderId={id} />
          </div>

          {(appUser?.role === 'admin' || appUser?.role === 'tailor') && (
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Actions</h2>
              <select 
                value={order.status} 
                onChange={e => handleStatusChange(e.target.value)}
                className="input-base w-full border rounded-lg px-4 py-2 capitalize"
              >
                <option value="pending">Pending</option>
                <option value="measurement_needed">Measurement Needed</option>
                <option value="in_progress">In Progress</option>
                <option value="ready">Ready</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
