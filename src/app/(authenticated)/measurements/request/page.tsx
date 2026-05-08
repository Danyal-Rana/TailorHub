'use client';
import { MeasurementRequestForm } from '@/components/measurements/MeasurementRequestForm';
import { RoleGate } from '@/components/auth/RoleGate';

export default function MeasurementRequestPage() {
  return (
    <RoleGate allow={['customer']}>
      <div className="space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-display font-black text-slate-900">Request Measurement</h1>
          <p className="text-slate-500 mt-2">Need to update your measurements? Send a request to our master tailors.</p>
        </div>
        <MeasurementRequestForm />
      </div>
    </RoleGate>
  );
}
