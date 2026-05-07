import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders'; // Will create next
import { AddOrder } from './pages/AddOrder';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Customers } from './pages/Customers';
import { AddMeasurement } from './pages/AddMeasurement';
import { Measurements } from './pages/Measurements';
import { Inventory } from './pages/Inventory';
import { Appointments } from './pages/Appointments';
import { Settings } from './pages/Settings';

import { useState } from 'react';
import { Menu } from 'lucide-react';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex selection:bg-indigo-100 selection:text-indigo-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <>
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

              <main className="flex-1 md:ml-64 transition-all duration-300 min-h-screen flex flex-col bg-slate-50/50">
                {/* Mobile Header */}
                <div className="md:hidden bg-indigo-900/95 backdrop-blur-md text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl hover:bg-indigo-800/50 transition-colors">
                      <Menu className="h-6 w-6" />
                    </button>
                    <span className="text-xl font-bold tracking-tight">Tailors Hub</span>
                  </div>
                </div>

                <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/add" element={<AddOrder />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/measurements" element={<Measurements />} />
                    <Route path="/measurements/add" element={<AddMeasurement />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
