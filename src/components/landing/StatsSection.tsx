'use client';
import { motion } from 'framer-motion';

const STATS = [
  { value: '500+', label: 'Expert Tailors', color: 'from-brand-500 to-brand-700' },
  { value: '12K+', label: 'Happy Customers', color: 'from-emerald-500 to-emerald-700' },
  { value: '85K+', label: 'Orders Completed', color: 'from-amber-500 to-orange-600' },
  { value: '4.9/5', label: 'Average Rating', color: 'from-rose-500 to-pink-600' },
];

export function StatsSection() {
  return (
    <section className="py-16 px-4 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className={`text-4xl font-display font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
              {stat.value}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
