'use client';
import { useState } from 'react';
import { updateDeliveryStatus, assignDelivery } from '@/services/deliveryService';
import { AvatarUpload } from '@/components/shared/AvatarUpload';
import { toast } from 'sonner';
import { Loader2, X, MapPin, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function DeliveryDetailModal({ delivery, onClose, onUpdated }: { delivery: any; onClose: () => void; onUpdated: () => void }) {
  const { appUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [proof, setProof] = useState<string | null>(delivery.proofImageURL || null);

  const handleStatus = async (status: string) => {
    if (status === 'completed' && !proof) {
      toast.error('Proof image is required to complete.');
      return;
    }
    setBusy(true);
    try {
      await updateDeliveryStatus(delivery.id, status, proof);
      toast.success('Status updated');
      onUpdated();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setBusy(false);
    }
  };

  const handleSelfAssign = async () => {
    if (!appUser) return;
    setBusy(true);
    try {
      await assignDelivery(delivery.id, appUser.uid);
      toast.success('Assigned to you');
      onUpdated();
    } catch {
      toast.error('Failed to assign');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Delivery #{delivery.id.slice(0,8)}</h2>
            <p className="text-sm text-slate-500 capitalize">{delivery.type}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {delivery.type === 'pickup' ? 'Pickup Address' : 'Drop Address'}
              </p>
              <p className="font-medium text-slate-900">{delivery.type === 'pickup' ? delivery.pickupAddress : delivery.dropAddress}</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.type === 'pickup' ? delivery.pickupAddress : delivery.dropAddress)}`} 
                 target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-1 text-sm text-blue-600 mt-2 font-medium hover:underline">
                <Navigation className="w-4 h-4"/> Open in Maps
              </a>
            </div>
          </div>

          {delivery.status !== 'completed' && appUser?.role === 'delivery' && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-700">Update Status</p>
              {delivery.status === 'unassigned' ? (
                <button onClick={handleSelfAssign} disabled={busy} className="btn-primary w-full py-3">Assign to Me</button>
              ) : delivery.status === 'assigned' ? (
                <button onClick={() => handleStatus('in_transit')} disabled={busy} className="btn-primary w-full py-3">Start Journey</button>
              ) : delivery.status === 'in_transit' ? (
                <div className="space-y-4 border border-emerald-200 bg-emerald-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-emerald-800 mb-2">Upload Proof Photo</p>
                  <div className="flex justify-center bg-white p-4 rounded-xl border border-emerald-100">
                    <AvatarUpload value={proof} onChange={setProof} folder="proofs" />
                  </div>
                  <button onClick={() => handleStatus('completed')} disabled={busy || !proof} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold disabled:opacity-50">
                    {busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Mark as Completed'}
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {delivery.status === 'completed' && delivery.proofImageURL && (
            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">Proof of Delivery</p>
              <img src={delivery.proofImageURL} alt="Proof" className="w-full h-48 object-cover rounded-xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
