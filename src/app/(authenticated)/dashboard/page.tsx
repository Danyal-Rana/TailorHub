'use client';
import { useAuth } from '@/contexts/AuthContext';
import { TailorDashboard } from '@/components/dashboard/TailorDashboard';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { DeliveryDashboard } from '@/components/dashboard/DeliveryDashboard';

export default function DashboardPage() {
  const { appUser } = useAuth();
  if (!appUser) return null;
  switch (appUser.role) {
    case 'admin':    return <AdminDashboard />;
    case 'tailor':   return <TailorDashboard />;
    case 'customer': return <CustomerDashboard />;
    case 'delivery': return <DeliveryDashboard />;
    default:         return <div>Role not recognized</div>;
  }
}
