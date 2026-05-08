'use client';
import { useEffect, useState } from 'react';
import { listInventory, deleteInventoryItem } from '@/services/inventoryService';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { InventoryForm } from '@/components/inventory/InventoryForm';
import { RoleGate } from '@/components/auth/RoleGate';
import { Loader2, PlusCircle, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<any>(false); // false | null (new) | item object

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await listInventory();
      setItems(data);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryItem(id);
      toast.success('Item deleted');
      fetchItems();
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const lowStockCount = items.filter(i => i.stock <= i.minStock).length;

  return (
    <RoleGate allow={['admin', 'tailor']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-black text-slate-900">Inventory</h1>
          {isEditing === false && (
            <button onClick={() => setIsEditing(null)} className="btn-primary px-4 py-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Add Item
            </button>
          )}
        </div>

        {isEditing !== false ? (
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{isEditing ? 'Edit Item' : 'New Item'}</h2>
            <InventoryForm 
              existing={isEditing} 
              onSaved={() => { setIsEditing(false); fetchItems(); }} 
              onCancel={() => setIsEditing(false)} 
            />
          </div>
        ) : (
          <>
            {lowStockCount > 0 && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-medium">You have <strong>{lowStockCount}</strong> items low on stock. Please restock soon.</p>
              </div>
            )}
            
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500/20" 
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
              ) : (
                <InventoryTable items={filteredItems} onEdit={setIsEditing} onDelete={handleDelete} />
              )}
            </div>
          </>
        )}
      </div>
    </RoleGate>
  );
}
