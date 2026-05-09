'use client';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { createMeasurementRequest } from '@/services/measurementService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MeasurementRequestForm() {
  const { appUser } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ reason: string; message: string }>({
    defaultValues: { reason: 'first_time', message: '' }
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!appUser) return;
    try {
      await createMeasurementRequest({
        requestedBy: appUser.uid,
        reason: data.reason,
        message: data.message || '',
      });
      toast.success('Request sent successfully!');
      router.push('/measurements');
    } catch (e: any) {
      toast.error('Failed to send request');
    }
  });

  return (
    <form onSubmit={onSubmit} className="glass-card p-6 space-y-6 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
            <input type="radio" value="first_time" {...register('reason')} className="w-4 h-4 text-brand-600" />
            <span className="font-medium">First Time Measurement</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
            <input type="radio" value="update" {...register('reason')} className="w-4 h-4 text-brand-600" />
            <span className="font-medium">Update My Measurements</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
            <input type="radio" value="retake" {...register('reason')} className="w-4 h-4 text-brand-600" />
            <span className="font-medium">Retake (Issues with previous fit)</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Additional Message</label>
        <textarea {...register('message')} className="input-base w-full border rounded-lg px-4 py-2 min-h-[100px]" placeholder="Preferred time or specific concerns..." />
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null} Submit Request
      </button>
    </form>
  );
}
