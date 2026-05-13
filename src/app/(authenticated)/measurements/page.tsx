'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyMeasurements, listAllRequests, assignMeasurementRequest, updateMeasurementRequest } from '@/services/measurementService';
import { listCustomers } from '@/services/customerService';
import { listActiveTailors } from '@/services/userService';
import { MeasurementCard } from '@/components/measurements/MeasurementCard';
import { Loader2, Plus, Ruler, ClipboardList, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const REASON_LABELS: Record<string, string> = {
  first_time: 'First Time',
  retake: 'Retake',
  update: 'Update',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function MeasurementsPage() {
  const { appUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'customers'>('requests');
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [tailors, setTailors] = useState<{ uid: string; displayName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignState, setAssignState] = useState<Record<string, { tailorUid: string; scheduledFor: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!appUser) return;
    if (appUser.role === 'customer') {
      getMyMeasurements(appUser.uid).then(m => { setMeasurements(m); setLoading(false); });
    } else {
      const tailorsPromise = appUser.role === 'admin' ? listActiveTailors() : Promise.resolve([]);
      Promise.all([listAllRequests(), listCustomers(), tailorsPromise])
        .then(([reqs, custs, tailorList]) => {
          setRequests(reqs);
          setCustomers(custs);
          setTailors(tailorList);
          setLoading(false);
        });
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
        {measurements.length === 0 ? (
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
            {measurements.map(m => <MeasurementCard key={m.id} measurement={m} />)}
          </div>
        )}
      </div>
    );
  }

  const resolveCustomer = (customerId: string | null) =>
    customers.find(c => c.id === customerId);

  const pendingCount = requests.filter(r => r.status === 'pending' || r.status === 'scheduled').length;

  const handleAssign = async (requestId: string) => {
    const state = assignState[requestId];
    if (!state?.tailorUid) { toast.error('Select a tailor first.'); return; }
    setSaving(requestId);
    try {
      await assignMeasurementRequest(requestId, state.tailorUid, state.scheduledFor || null);
      setRequests(prev => prev.map(r => r.id === requestId
        ? { ...r, status: 'scheduled', assignedTailor: state.tailorUid, scheduledFor: state.scheduledFor || null }
        : r
      ));
      toast.success('Tailor assigned successfully.');
    } catch {
      toast.error('Failed to assign tailor.');
    } finally {
      setSaving(null);
    }
  };

  const handleMarkComplete = async (requestId: string) => {
    setSaving(requestId);
    try {
      await updateMeasurementRequest(requestId, { status: 'completed' });
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'completed' } : r));
      toast.success('Request marked as completed.');
    } catch {
      toast.error('Failed to update.');
    } finally {
      setSaving(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setSaving(requestId);
    try {
      await updateMeasurementRequest(requestId, { status: 'rejected' });
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
      toast.success('Request rejected.');
    } catch {
      toast.error('Failed to update.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="page-title">Measurements</h1>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Requests
          {pendingCount > 0 && (
            <span className="ml-1 bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-0.5 leading-none">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'customers'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Customers
          <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">({customers.length})</span>
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="glass-card p-20 text-center text-slate-500 dark:text-slate-400">
              No measurement requests yet.
            </div>
          ) : (
            requests.map(req => {
              const customer = resolveCustomer(req.customerId);
              const assignedTailorName = tailors.find(t => t.uid === req.assignedTailor)?.displayName;
              const isActive = req.status === 'pending' || req.status === 'scheduled';
              const currentAssign = assignState[req.id] || { tailorUid: req.assignedTailor || '', scheduledFor: '' };

              return (
                <div key={req.id} className="glass-card p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {customer?.name || 'Unknown Customer'}
                        </span>
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                          {REASON_LABELS[req.reason] || req.reason}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[req.status] || ''}`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {req.message && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{req.message}</p>
                      )}
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {req.createdAt?.toDate?.().toLocaleDateString()}
                        {assignedTailorName && ` · Assigned to: ${assignedTailorName}`}
                        {req.scheduledFor && ` · Scheduled: ${new Date(req.scheduledFor?.toDate?.() || req.scheduledFor).toLocaleDateString()}`}
                      </p>
                    </div>
                    {customer && (
                      <Link
                        href={`/measurements/${customer.id}`}
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline whitespace-nowrap flex-shrink-0"
                      >
                        View Measurements →
                      </Link>
                    )}
                  </div>

                  {isActive && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                      {appUser?.role === 'admin' && (
                        <>
                          <select
                            className="input-base border rounded-lg px-3 py-2 text-sm"
                            value={currentAssign.tailorUid}
                            onChange={e => setAssignState(prev => ({ ...prev, [req.id]: { ...currentAssign, tailorUid: e.target.value } }))}
                          >
                            <option value="">Select tailor...</option>
                            {tailors.map(t => (
                              <option key={t.uid} value={t.uid}>{t.displayName}</option>
                            ))}
                          </select>
                          <input
                            type="date"
                            className="input-base border rounded-lg px-3 py-2 text-sm"
                            value={currentAssign.scheduledFor}
                            onChange={e => setAssignState(prev => ({ ...prev, [req.id]: { ...currentAssign, scheduledFor: e.target.value } }))}
                          />
                        </>
                      )}
                      <div className="flex gap-2">
                        {appUser?.role === 'admin' && (
                          <button
                            onClick={() => handleAssign(req.id)}
                            disabled={saving === req.id}
                            className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-1"
                          >
                            {saving === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() => handleMarkComplete(req.id)}
                          disabled={saving === req.id}
                          className="flex-1 py-2 text-sm rounded-lg border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={saving === req.id}
                          className="px-3 py-2 text-sm rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="glass-card overflow-hidden">
          {customers.length === 0 ? (
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
                {customers.map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{c.phone}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/measurements/${c.id}`}
                        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium text-sm transition-colors"
                      >
                        <Plus className="w-4 h-4" /> View / Add
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
