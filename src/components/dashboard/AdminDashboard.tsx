'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAdminStats } from '@/services/adminService';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, ShoppingBag, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    getAdminStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
    borderRadius: '12px',
    border: 'none',
    boxShadow: isDark
      ? '0 10px 30px -5px rgba(0,0,0,0.5)'
      : '0 10px 30px -5px rgba(0,0,0,0.1)',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#f1f5f9' : '#0f172a',
  };

  const summaryCards = [
    { label: 'Total Revenue',     value: `Rs. ${stats.revenue.toLocaleString()}`, icon: DollarSign,    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Total Orders',      value: stats.totalOrders,                        icon: ShoppingBag,   color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Customers',         value: stats.totalCustomers,                     icon: Users,         color: 'text-brand-600 dark:text-brand-400',     bg: 'bg-brand-100 dark:bg-brand-900/30' },
    { label: 'Pending Approvals', value: stats.pendingApprovals,                   icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  const orderData = [
    { name: 'Week 1', orders: Math.floor(stats.totalOrders * 0.1) },
    { name: 'Week 2', orders: Math.floor(stats.totalOrders * 0.2) },
    { name: 'Week 3', orders: Math.floor(stats.totalOrders * 0.3) },
    { name: 'Week 4', orders: stats.totalOrders - Math.floor(stats.totalOrders * 0.6) },
  ];

  const statusData = [
    { name: 'Pending',     value: stats.pendingOrders },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Delivered',   value: stats.delivered },
  ];
  const COLORS = ['#f59e0b', '#6366f1', '#10b981'];

  return (
    <div className="space-y-6">
      <h1 className="page-title">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className={`p-3.5 rounded-2xl ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="section-title mb-6">Orders Over Time</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: isDark ? '#1e293b' : '#fff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Order Statuses</h2>
          <div className="h-56 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-2">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
