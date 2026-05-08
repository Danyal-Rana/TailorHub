'use client';
import { useForm } from 'react-hook-form';
import { createMeasurement, updateMeasurement } from '@/services/measurementService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function MeasurementForm({ customerId, existing, onSaved }: { customerId: string, existing?: any, onSaved: () => void }) {
  const { appUser } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: existing || { unit: 'inches' } });
  const fields = ['chest', 'waist', 'hips', 'shoulder', 'sleeves', 'length', 'inseam', 'neck'];

  const onSubmit = handleSubmit(async (data) => {
    if (!appUser) return;
    try {
      const payload = {
        customerId,
        takenBy: appUser.uid,
        unit: data.unit,
        notes: data.notes || '',
        ...Object.fromEntries(fields.map(f => [f, data[f] ? Number(data[f]) : null]))
      } as any;
      
      if (existing) {
        await updateMeasurement(existing.id, payload, existing.version);
        toast.success('Measurements updated!');
      } else {
        await createMeasurement(payload);
        toast.success('Measurements recorded!');
      }
      onSaved();
    } catch (e: any) {
      toast.error('Failed to save measurements');
    }
  });

  return (
    <form onSubmit={onSubmit} className="glass-card p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Record Measurements</h2>
        <select {...register('unit')} className="input-base px-4 py-2 border rounded-lg">
          <option value="inches">Inches</option>
          <option value="cm">Centimeters</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fields.map(f => (
          <div key={f}>
            <label className="block text-xs font-medium text-slate-500 capitalize mb-1">{f}</label>
            <input type="number" step="0.25" {...register(f)} className="input-base w-full border rounded-lg px-3 py-2 text-center" placeholder="0" />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea {...register('notes')} className="input-base w-full border rounded-lg px-4 py-2" placeholder="Fit preferences..." />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2 flex items-center gap-2">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Measurements
        </button>
      </div>
    </form>
  );
}
