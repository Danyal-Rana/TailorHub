import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Ruler, ShoppingBag, DollarSign, LogOut } from 'lucide-react';
import { CustomersView } from './CustomersView';
import { MeasurementsView } from './MeasurementsView';
import { OrdersView } from './OrdersView';
import { PaymentsView } from './PaymentsView';

type View = 'customers' | 'measurements' | 'orders' | 'payments';

export function Dashboard() {
  const [activeView, setActiveView] = useState<View>('customers');
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 'customers' as View, label: 'Customers', icon: Users },
    { id: 'measurements' as View, label: 'Measurements', icon: Ruler },
    { id: 'orders' as View, label: 'Orders', icon: ShoppingBag },
    { id: 'payments' as View, label: 'Payments', icon: DollarSign },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'customers':
        return <CustomersView />;
      case 'measurements':
        return <MeasurementsView />;
      case 'orders':
        return <OrdersView />;
      case 'payments':
        return <PaymentsView />;
      default:
        return <CustomersView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tailors Hub</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition ${
                      activeView === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
}
