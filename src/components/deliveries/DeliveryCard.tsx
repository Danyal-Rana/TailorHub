import { MapPin, Package, Clock, CheckCircle } from 'lucide-react';
import { StatusBadge } from '@/components/orders/StatusBadge';

export function DeliveryCard({ delivery, onClick }: { delivery: any; onClick: () => void }) {
  const isCompleted = delivery.status === 'completed';
  return (
    <div className="glass-card p-6 cursor-pointer hover:shadow-premium transition-all" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${delivery.type === 'pickup' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
            {delivery.type}
          </span>
          <h3 className="font-bold text-slate-900 mt-2">Order #{delivery.orderId.slice(0,8).toUpperCase()}</h3>
        </div>
        <StatusBadge status={delivery.status as any} />
      </div>
      
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="line-clamp-2">{delivery.type === 'pickup' ? delivery.pickupAddress : delivery.dropAddress}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <p>{delivery.scheduledAt?.toDate().toLocaleString()}</p>
        </div>
        {isCompleted && delivery.completedAt && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            <p>Completed: {delivery.completedAt.toDate().toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
