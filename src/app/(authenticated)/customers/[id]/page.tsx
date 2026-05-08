'use client';
import { useState, useEffect, use } from 'react';
import { getCustomer, updateCustomer } from '@/services/customerService';
import { Customer } from '@/lib/types';
import { RoleGate } from '@/components/auth/RoleGate';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { User, Phone, Mail, MapPin, Calendar, Edit2, Loader2, ArrowLeft, Scissors, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'measurements' | 'orders'>('profile');

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const data = await getCustomer(id);
      setCustomer(data);
    } catch (error) {
      toast.error('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async (data: any) => {
    setBusy(true);
    try {
      await updateCustomer(id, data);
      toast.success('Customer updated successfully');
      setIsModalOpen(false);
      fetchCustomer();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update customer');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
    </div>
  );

  if (!customer) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-slate-900">Customer not found</h2>
      <Link href="/customers" className="text-brand-600 hover:underline mt-4 inline-block">Back to customers</Link>
    </div>
  );

  return (
    <RoleGate allow={['admin', 'tailor']}>
      <div className="space-y-8">
        <Link href="/customers" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>

        <div className="glass-card p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0 border-4 border-white shadow-premium">
              {customer.photoURL ? (
                <Image src={customer.photoURL} alt={customer.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-display font-black text-slate-900">{customer.name}</h1>
                  <p className="text-slate-500 flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" /> Added on {new Date(customer.createdAt.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-3 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 rounded-2xl transition"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="font-semibold">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="font-semibold">{customer.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</p>
                    <p className="font-semibold truncate max-w-[200px]">{customer.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200 gap-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'measurements', label: 'Measurements', icon: Scissors },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 flex items-center gap-2 font-bold transition-all relative ${
                activeTab === tab.id ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="py-4">
          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Customer Information</h3>
                <div className="space-y-3">
                  <p className="text-slate-600"><span className="font-semibold">Linked User ID:</span> {customer.linkedUserId || 'None'}</p>
                  <p className="text-slate-600"><span className="font-semibold">Created By:</span> {customer.createdBy}</p>
                  <p className="text-slate-600"><span className="font-semibold">Last Updated:</span> {new Date(customer.updatedAt.seconds * 1000).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'measurements' && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Scissors className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">Measurement History</h3>
              <p className="text-slate-500 mt-1">Measurements module will be implemented in Phase 10.</p>
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">Order History</h3>
              <p className="text-slate-500 mt-1">Orders module will be implemented in Phase 9.</p>
            </div>
          )}
        </div>

        {isModalOpen && (
          <CustomerForm 
            initialData={customer}
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleUpdateCustomer}
            busy={busy}
          />
        )}
      </div>
    </RoleGate>
  );
}
