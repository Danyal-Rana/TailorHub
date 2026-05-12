import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { Calendar, User } from 'lucide-react';
import type { Order } from '@/lib/types';

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/orders/${order.id}`} className="block group">
      <div className="glass-card p-5 hover:shadow-premium transition-all duration-200 group-hover:-translate-y-0.5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
              {order.dressType}
            </h3>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="truncate">Customer: {order.customerName || `${order.customerId.slice(0, 10)}...`}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span>{order.createdAt?.toDate().toLocaleDateString()}</span>
          </div>
        </div>

        {order.price != null && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">Total</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Rs. {order.price.toLocaleString()}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
