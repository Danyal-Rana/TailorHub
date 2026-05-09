'use client';
import { UserPlus, MessageSquare, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    desc: 'Sign up as a customer, tailor, or delivery partner. Set up your workspace in under two minutes.',
    color: 'bg-brand-600',
    shadow: 'shadow-brand-200',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Connect & Collaborate',
    desc: 'Customers browse tailors, place orders, and share precise digital measurements instantly.',
    color: 'bg-violet-600',
    shadow: 'shadow-violet-200',
  },
  {
    number: '03',
    icon: PackageCheck,
    title: 'Track & Deliver',
    desc: 'Real-time order tracking from stitch to doorstep, with integrated payments and delivery management.',
    color: 'bg-emerald-600',
    shadow: 'shadow-emerald-200',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
            Up and running in minutes
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Three simple steps to transform your tailoring business.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-brand-200 via-violet-200 to-emerald-200 z-0" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className={`w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center mb-6 shadow-xl ${step.shadow}`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <span className="text-xs font-black text-slate-400 tracking-widest uppercase mb-2">{step.number}</span>
              <h3 className="text-2xl font-display font-black text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
