import type { OrderStatus } from '@/lib/types';

const COLORS: Record<OrderStatus,string> = {
  pending: 'bg-amber-100 text-amber-700',
  measurement_needed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  ready: 'bg-emerald-100 text-emerald-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${COLORS[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
