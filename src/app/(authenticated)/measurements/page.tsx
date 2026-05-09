'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyMeasurements } from '@/services/measurementService';
import { listCustomers } from '@/services/customerService';
import { MeasurementCard } from '@/components/measurements/MeasurementCard';
import { Loader2, Plus, Ruler } from 'lucide-react';
import Link from 'next/link';

export default function MeasurementsPage() {
  const { appUser } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    if (appUser.role === 'customer') {
      getMyMeasurements(appUser.uid).then(m => { setData(m); setLoading(false); });
    } else {
      listCustomers().then(c => { setData(c); setLoading(false); });
    }
  }, [appUser]);

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
    </div>
  );

  if (appUser?.role === 'customer') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="page-title">My Measurements</h1>
          <Link href="/measurements/request" className="btn-primary px-4 py-2.5 text-sm">
            Request Update
          </Link>
        </div>
        {data.length === 0 ? (
          <div className="glass-card p-20 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Ruler className="w-8 h-8 text-slate-300 dark:text-slate-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">No measurements on file</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                <Link href="/measurements/request" className="text-brand-600 dark:text-brand-400 hover:underline">
                  Request your first measurement
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {data.map(m => <MeasurementCard key={m.id} measurement={m} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Customer Measurements</h1>
      <div className="glass-card overflow-hidden">
        {data.length === 0 ? (
          <div className="p-20 text-center text-slate-500 dark:text-slate-400">No customers found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="table-header">
              <tr>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {data.map(c => (
                <tr key={c.id} className="table-row">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{c.phone}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/measurements/${c.id}`}
                      className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" /> View / Edit
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
