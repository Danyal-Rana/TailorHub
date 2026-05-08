'use client';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export function InventoryTable({ items, onEdit, onDelete }: { items: any[], onEdit: (i: any) => void, onDelete: (id: string) => void }) {
  if (items.length === 0) return <div className="p-20 text-center text-slate-500">No inventory items found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-4 font-semibold">Item</th>
            <th className="p-4 font-semibold">Category</th>
            <th className="p-4 font-semibold">Stock</th>
            <th className="p-4 font-semibold">Price</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map(item => {
            const isLowStock = item.stock <= item.minStock;
            return (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="p-4 flex items-center gap-3">
                  {item.imageURL ? (
                    <Image src={item.imageURL} alt="" width={40} height={40} className="rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.supplier}</p>
                  </div>
                </td>
                <td className="p-4"><span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium text-xs">{item.category}</span></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                      {item.stock} {item.unit}
                    </span>
                    {isLowStock && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                  </div>
                </td>
                <td className="p-4 text-slate-500">Rs. {item.pricePerUnit}</td>
                <td className="p-4 text-right">
                  <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => { if(confirm('Delete this item?')) onDelete(item.id); }} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
