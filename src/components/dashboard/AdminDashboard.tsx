'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAdminStats } from '@/services/adminService';
import { Users, ShoppingBag, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>;
  }

  const summaryCards = [
    { label: 'Total Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-brand-600', bg: 'bg-brand-100' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const orderData = [
    { name: 'Week 1', orders: Math.floor(stats.totalOrders * 0.1) },
    { name: 'Week 2', orders: Math.floor(stats.totalOrders * 0.2) },
    { name: 'Week 3', orders: Math.floor(stats.totalOrders * 0.3) },
    { name: 'Week 4', orders: stats.totalOrders - Math.floor(stats.totalOrders * 0.6) },
  ];

  const statusData = [
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Delivered', value: stats.delivered },
  ];
  const COLORS = ['#f59e0b', '#6366f1', '#10b981'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-black text-slate-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${s.bg}`}>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Orders Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill:'#64748b'}} />
                <Tooltip contentStyle={{borderRadius:'16px',border:'none',boxShadow:'0 10px 30px -5px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={3} dot={{r:6,fill:'#6366f1',strokeWidth:2,stroke:'#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Order Statuses</h2>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius:'16px',border:'none',boxShadow:'0 10px 30px -5px rgba(0,0,0,0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                <span className="text-sm text-slate-600">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
