'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMeasurementsForCustomer } from '@/services/measurementService';
import { getCustomer } from '@/services/customerService';
import { MeasurementCard } from '@/components/measurements/MeasurementCard';
import { MeasurementForm } from '@/components/measurements/MeasurementForm';
import { RoleGate } from '@/components/auth/RoleGate';
import { Loader2 } from 'lucide-react';

export default function CustomerMeasurementsPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const [customer, setCustomer] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [cust, meas] = await Promise.all([
      getCustomer(customerId),
      getMeasurementsForCustomer(customerId)
    ]);
    setCustomer(cust);
    setMeasurements(meas);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [customerId]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-slate-900">Measurements: {customer?.name}</h1>
        <p className="text-slate-500">{customer?.phone}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {measurements.length > 0 ? (
            measurements.map((m, i) => (
              <div key={m.id} className="relative">
                {i === 0 && <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">Latest</span>}
                <MeasurementCard measurement={m} />
              </div>
            ))
          ) : (
            <div className="glass-card p-10 text-center text-slate-500">No measurements recorded yet.</div>
          )}
        </div>

        <div>
          <RoleGate allow={['admin', 'tailor']}>
            <MeasurementForm customerId={customerId} existing={measurements[0]} onSaved={loadData} />
          </RoleGate>
        </div>
      </div>
    </div>
  );
}
