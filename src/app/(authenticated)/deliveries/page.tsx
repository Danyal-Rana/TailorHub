'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listDeliveries } from '@/services/deliveryService';
import { DeliveryCard } from '@/components/deliveries/DeliveryCard';
import { DeliveryDetailModal } from '@/components/deliveries/DeliveryDetailModal';
import { RoleGate } from '@/components/auth/RoleGate';
import { Loader2 } from 'lucide-react';

export default function DeliveriesPage() {
  const { appUser } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');

  const fetchDeliveries = async () => {
    if (!appUser) return;
    setLoading(true);
    const data = await listDeliveries(appUser.role, appUser.uid);
    setDeliveries(data);
    setLoading(false);
  };

  useEffect(() => { fetchDeliveries(); }, [appUser]);

  const pending = deliveries.filter(d => d.status !== 'completed');
  const completed = deliveries.filter(d => d.status === 'completed');
  const activeList = tab === 'pending' ? pending : completed;

  return (
    <RoleGate allow={['admin', 'delivery']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-black text-slate-900">Deliveries</h1>
        
        <div className="flex bg-slate-100 rounded-xl p-1 max-w-sm">
          <button onClick={() => setTab('pending')} className={`flex-1 py-2 rounded-lg font-semibold transition-all ${tab==='pending'?'bg-white shadow text-brand-700':'text-slate-500'}`}>Pending ({pending.length})</button>
          <button onClick={() => setTab('completed')} className={`flex-1 py-2 rounded-lg font-semibold transition-all ${tab==='completed'?'bg-white shadow text-brand-700':'text-slate-500'}`}>Completed</button>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
        ) : activeList.length === 0 ? (
          <div className="glass-card p-20 text-center text-slate-500">No {tab} deliveries found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeList.map(d => (
              <DeliveryCard key={d.id} delivery={d} onClick={() => setSelected(d)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <DeliveryDetailModal 
          delivery={selected} 
          onClose={() => setSelected(null)} 
          onUpdated={() => { setSelected(null); fetchDeliveries(); }} 
        />
      )}
    </RoleGate>
  );
}
