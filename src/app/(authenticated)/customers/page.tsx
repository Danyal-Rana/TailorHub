'use client';
import { useState, useEffect } from 'react';
import { listCustomers, createCustomer } from '@/services/customerService';
import { Customer } from '@/lib/types';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { RoleGate } from '@/components/auth/RoleGate';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersPage() {
  const { appUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await listCustomers();
      setCustomers(data);
    } catch (error: any) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (data: any) => {
    setBusy(true);
    try {
      await createCustomer({
        ...data,
        createdBy: appUser?.uid || '',
        linkedUserId: null,
      });
      toast.success('Customer created successfully');
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create customer');
    } finally {
      setBusy(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <RoleGate allow={['admin', 'tailor']}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-600" /> Customers
            </h1>
            <p className="text-slate-500 mt-2">Manage your customer database and measurement history.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-6 py-3 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Customer
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border bg-white shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none transition"
          />
        </div>

        {loading ? (
          <div className="flex flex-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No customers found</h3>
            <p className="text-slate-500 mt-1">Try a different search or add a new customer.</p>
          </div>
        )}

        {isModalOpen && (
          <CustomerForm 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleCreateCustomer}
            busy={busy}
          />
        )}
      </div>
    </RoleGate>
  );
}
