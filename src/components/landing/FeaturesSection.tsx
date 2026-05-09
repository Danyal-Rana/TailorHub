'use client';
import { Ruler, Truck, ShieldCheck, LayoutDashboard, Bell, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: Ruler,
    title: 'Smart Measurements',
    desc: 'Digital measurement records with full history, body profile tracking, and instant access across all devices.',
    color: 'bg-brand-100 text-brand-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Dashboard',
    desc: 'Role-specific dashboards for tailors, customers, and delivery partners — everyone sees exactly what they need.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Truck,
    title: 'Delivery Management',
    desc: 'Dedicated delivery network for seamless fabric pickup and garment drop-off with real-time tracking.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    desc: 'Integrated payment processing with advance and final settlement tracking, receipts, and payment history.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Automated alerts for order updates, delivery status, measurement requests, and payment milestones.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Users,
    title: 'Customer Profiles',
    desc: 'Complete customer records with measurements, order history, preferences, and communication logs.',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
            Precision in Every Stitch
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Our platform handles the complexity so you can focus on the craftsmanship.
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/50 transition-all cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${f.color} transition-transform group-hover:scale-110 duration-300`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
