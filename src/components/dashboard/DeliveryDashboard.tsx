'use client';
import { motion } from 'framer-motion';

export function DeliveryDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-black text-slate-900">Delivery Dashboard</h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <p className="text-slate-500">Today's assigned pickups and deliveries will appear here.</p>
      </motion.div>
    </div>
  );
}
