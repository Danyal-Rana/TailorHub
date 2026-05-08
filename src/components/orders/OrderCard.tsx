import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { Calendar, User } from 'lucide-react';
import type { Order } from '@/lib/types';

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/orders/${order.id}`} className="block">
      <div className="glass-card p-6 hover:shadow-premium transition-all hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-bold text-slate-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{order.dressType}</h3>
          </div>
          <StatusBadge status={order.status} />
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <User className="w-4 h-4 text-slate-400" />
            <span>Customer ID: {order.customerId}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Created: {order.createdAt?.toDate().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
