import type { Measurement } from '@/lib/types';
import { Ruler, Calendar } from 'lucide-react';

export function MeasurementCard({ measurement }: { measurement: Measurement }) {
  const fields = ['chest', 'waist', 'hips', 'shoulder', 'sleeves', 'length', 'inseam', 'neck'] as const;
  
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-100 text-brand-600 rounded-lg"><Ruler className="w-5 h-5"/></div>
          <div>
            <h3 className="font-bold text-slate-900">Version {measurement.version}</h3>
            <p className="text-xs text-slate-500 capitalize">{measurement.unit}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{measurement.createdAt?.toDate().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fields.map(f => (
          measurement[f] != null && (
            <div key={f} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
              <p className="text-xs text-slate-500 capitalize">{f}</p>
              <p className="font-bold text-slate-900">{measurement[f]}</p>
            </div>
          )
        ))}
      </div>
      
      {measurement.notes && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-1">Notes</p>
          <p className="text-sm text-slate-700 italic">"{measurement.notes}"</p>
        </div>
      )}
    </div>
  );
}
