'use client';
import { useState, useEffect, use } from 'react';
import { getCustomer, updateCustomer } from '@/services/customerService';
import { getMeasurementsForCustomer } from '@/services/measurementService';
import { listOrdersByCustomer } from '@/services/orderService';
import type { Customer, Measurement, Order } from '@/lib/types';
import { RoleGate } from '@/components/auth/RoleGate';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { MeasurementCard } from '@/components/measurements/MeasurementCard';
import { MeasurementForm } from '@/components/measurements/MeasurementForm';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { User, Phone, Mail, MapPin, Calendar, Edit2, Loader2, ArrowLeft, Scissors, ShoppingBag, PlusCircle, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'measurements' | 'orders'>('profile');

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [cust, meas, ords] = await Promise.all([
        getCustomer(id),
        getMeasurementsForCustomer(id),
        listOrdersByCustomer(id),
      ]);
      setCustomer(cust);
      setMeasurements(meas);
      setOrders(ords);
    } catch {
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
      fetchAll();
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
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer not found</h2>
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
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 border-4 border-white dark:border-slate-600 shadow-premium">
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
                  <h1 className="text-3xl font-display font-black text-slate-900 dark:text-white">{customer.name}</h1>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" /> Added on {new Date(customer.createdAt.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-3 bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 rounded-2xl transition"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="font-semibold">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="font-semibold">{customer.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
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

        <div className="flex border-b border-slate-200 dark:border-slate-700 gap-8">
          {[
            { id: 'profile',      label: 'Profile',      icon: User,        count: null },
            { id: 'measurements', label: 'Measurements', icon: Scissors,    count: measurements.length },
            { id: 'orders',       label: 'Orders',       icon: ShoppingBag, count: orders.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 flex items-center gap-2 font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="ml-1 text-xs bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="py-2">
          {activeTab === 'profile' && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Customer Information</h3>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Customer ID:</span>{' '}
                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{id}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Linked App Account:</span> {customer.linkedUserId || 'Not linked'}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Last Updated:</span> {new Date(customer.updatedAt.seconds * 1000).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'measurements' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                {measurements.length === 0 ? (
                  <div className="glass-card p-12 text-center flex flex-col items-center gap-3">
                    <Ruler className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No measurements recorded yet</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Use the form on the right to record measurements</p>
                  </div>
                ) : (
                  measurements.map((m, i) => (
                    <div key={m.id} className="relative">
                      {i === 0 && (
                        <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
                          Latest
                        </span>
                      )}
                      <MeasurementCard measurement={m} />
                    </div>
                  ))
                )}
              </div>
              <div>
                <MeasurementForm customerId={id} onSaved={fetchAll} />
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} total
                </p>
                <Link href="/orders/new" className="inline-flex items-center gap-2 btn-primary text-sm px-4 py-2">
                  <PlusCircle className="w-4 h-4" /> New Order
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="glass-card p-12 text-center flex flex-col items-center gap-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No orders yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Place the first order for this customer</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                      <div className="glass-card p-5 hover:shadow-premium transition-all group-hover:-translate-y-0.5 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white">{order.dressType}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {order.createdAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Rs. {order.price?.toLocaleString()}
                          </p>
                          {order.advancePaid > 0 && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                              Adv: Rs. {order.advancePaid?.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
