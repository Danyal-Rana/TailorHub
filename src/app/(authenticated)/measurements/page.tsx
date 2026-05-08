'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyMeasurements } from '@/services/measurementService';
import { listCustomers } from '@/services/customerService';
import { MeasurementCard } from '@/components/measurements/MeasurementCard';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MeasurementsPage() {
  const { appUser } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    
    if (appUser.role === 'customer') {
      getMyMeasurements(appUser.uid).then(m => {
        setData(m);
        setLoading(false);
      });
    } else {
      listCustomers().then(c => {
        setData(c);
        setLoading(false);
      });
    }
  }, [appUser]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>;

  if (appUser?.role === 'customer') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-black text-slate-900">My Measurements</h1>
          <Link href="/measurements/request" className="btn-primary px-4 py-2">Request Update</Link>
        </div>
        {data.length === 0 ? (
          <div className="glass-card p-20 text-center text-slate-500">No measurements on file.</div>
        ) : (
          <div className="grid gap-6">
            {data.map(m => <MeasurementCard key={m.id} measurement={m} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-black text-slate-900">Customer Measurements</h1>
      <div className="glass-card overflow-hidden">
        {data.length === 0 ? (
          <div className="p-20 text-center text-slate-500">No customers found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{c.name}</td>
                  <td className="p-4 text-slate-500">{c.phone}</td>
                  <td className="p-4 text-right">
                    <Link href={`/measurements/${c.id}`} className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
                      View / Edit <Plus className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
