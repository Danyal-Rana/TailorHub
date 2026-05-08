'use client';
import { useForm } from 'react-hook-form';
import { AvatarUpload } from '@/components/shared/AvatarUpload';
import { createInventoryItem, updateInventoryItem } from '@/services/inventoryService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function InventoryForm({ existing, onSaved, onCancel }: { existing?: any; onSaved: () => void; onCancel: () => void }) {
  const { register, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm({ defaultValues: existing || { unit: 'meters', category: 'Fabric' } });
  
  const imageURL = watch('imageURL');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        name: data.name,
        category: data.category,
        stock: Number(data.stock),
        unit: data.unit,
        minStock: Number(data.minStock),
        pricePerUnit: Number(data.pricePerUnit),
        supplier: data.supplier || '',
        imageURL: data.imageURL || null,
      } as any;
      
      if (existing) {
        await updateInventoryItem(existing.id, payload);
        toast.success('Item updated');
      } else {
        await createInventoryItem(payload);
        toast.success('Item added');
      }
      onSaved();
    } catch (e: any) {
      toast.error('Failed to save item');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-center mb-6">
        <AvatarUpload value={imageURL} onChange={url => setValue('imageURL', url)} folder="inventory" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
          <input {...register('name', { required: true })} className="input-base w-full border rounded-lg px-4 py-2" placeholder="e.g. Silk Fabric" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select {...register('category')} className="input-base w-full border rounded-lg px-4 py-2">
            <option value="Fabric">Fabric</option>
            <option value="Button">Button</option>
            <option value="Thread">Thread</option>
            <option value="Zipper">Zipper</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
          <input type="number" {...register('stock', { required: true })} className="input-base w-full border rounded-lg px-4 py-2" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
          <select {...register('unit')} className="input-base w-full border rounded-lg px-4 py-2">
            <option value="meters">Meters</option>
            <option value="pieces">Pieces</option>
            <option value="spools">Spools</option>
            <option value="yards">Yards</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Min Stock Alert</label>
          <input type="number" {...register('minStock')} className="input-base w-full border rounded-lg px-4 py-2" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price per Unit (Rs.)</label>
          <input type="number" {...register('pricePerUnit')} className="input-base w-full border rounded-lg px-4 py-2" placeholder="0" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
          <input {...register('supplier')} className="input-base w-full border rounded-lg px-4 py-2" placeholder="Supplier Name..." />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 font-medium text-slate-500 hover:text-slate-700">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2 flex items-center gap-2">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Item
        </button>
      </div>
    </form>
  );
}
