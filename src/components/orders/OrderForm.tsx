'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/services/orderService';
import { MultiImageUpload } from '@/components/shared/MultiImageUpload';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function OrderForm() {
  const { appUser } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm();
  
  const fabricImages = watch('fabricImages') || [];
  const designImages = watch('designImages') || [];

  const onSubmit = handleSubmit(async (data) => {
    if (!appUser) return;
    try {
      await createOrder({
        customerId: appUser.role === 'customer' ? appUser.uid : data.customerId,
        customerUid: appUser.role === 'customer' ? appUser.uid : null,
        measurementId: null,
        assignedTailor: null,
        dressType: data.dressType,
        fabricDetails: data.fabricDetails,
        fabricImages: data.fabricImages || [],
        designImages: data.designImages || [],
        price: Number(data.price) || 0,
        advancePaid: Number(data.advancePaid) || 0,
        status: 'pending',
        pickupDate: null,
        pickupBy: null,
        deliveryDate: null,
        deliveryBy: null,
        notes: data.notes || '',
      });
      toast.success('Order created successfully!');
      router.push('/orders');
    } catch (e: any) {
      toast.error('Failed to create order.');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Order Details</h2>
        
        {appUser?.role !== 'customer' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer ID</label>
            <input {...register('customerId', { required: true })} className="input-base w-full border rounded-lg px-4 py-2" placeholder="Enter customer ID" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Dress Type</label>
          <select {...register('dressType', { required: true })} className="input-base w-full border rounded-lg px-4 py-2">
            <option value="Shalwar Kameez">Shalwar Kameez</option>
            <option value="Suit">Suit</option>
            <option value="Kurta">Kurta</option>
            <option value="Pant Shirt">Pant Shirt</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fabric Details</label>
          <textarea {...register('fabricDetails')} className="input-base w-full border rounded-lg px-4 py-2 min-h-[100px]" placeholder="Describe the fabric..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fabric Images</label>
            <MultiImageUpload value={fabricImages} onChange={urls => setValue('fabricImages', urls)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Design References</label>
            <MultiImageUpload value={designImages} onChange={urls => setValue('designImages', urls)} />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Pricing & Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Price (Rs.)</label>
            <input type="number" {...register('price')} className="input-base w-full border rounded-lg px-4 py-2" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Advance Paid (Rs.)</label>
            <input type="number" {...register('advancePaid')} className="input-base w-full border rounded-lg px-4 py-2" placeholder="0" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
          <textarea {...register('notes')} className="input-base w-full border rounded-lg px-4 py-2 min-h-[100px]" placeholder="Any special instructions..." />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-3 flex items-center gap-2">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isSubmitting ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}
