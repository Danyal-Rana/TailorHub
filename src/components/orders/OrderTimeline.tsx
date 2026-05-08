'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle2, Clock } from 'lucide-react';

export function OrderTimeline({ orderId }: { orderId: string }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, `orders/${orderId}/statusHistory`), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [orderId]);

  if (history.length === 0) return <p className="text-sm text-slate-500">No timeline events yet.</p>;

  return (
    <div className="space-y-4">
      {history.map((event, i) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
              {i === history.length - 1 ? <Clock className="w-3 h-3 text-brand-600" /> : <CheckCircle2 className="w-3 h-3 text-brand-600" />}
            </div>
            {i !== history.length - 1 && <div className="w-px h-full bg-slate-200 my-1" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-semibold text-slate-900 capitalize">{event.status.replace(/_/g, ' ')}</p>
            <p className="text-xs text-slate-500">{event.timestamp?.toDate().toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
