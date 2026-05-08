'use client';
import { OrderForm } from '@/components/orders/OrderForm';
import { RoleGate } from '@/components/auth/RoleGate';

export default function NewOrderPage() {
  return (
    <RoleGate allow={['admin', 'tailor', 'customer']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-display font-black text-slate-900">New Order</h1>
        <OrderForm />
      </div>
    </RoleGate>
  );
}
