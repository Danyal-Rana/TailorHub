'use client';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Ahmed Raza',
    role: 'Master Tailor, Lahore',
    avatar: 'https://i.pravatar.cc/100?u=ahmed_raza',
    quote: 'TailorHub completely transformed my shop. Managing 50+ orders a week is now effortless. The measurement records alone saved me countless hours.',
    rating: 5,
  },
  {
    name: 'Sarah Khalid',
    role: 'Customer, Karachi',
    avatar: 'https://i.pravatar.cc/100?u=sarah_khalid',
    quote: "I love how easy it is to track my orders. The digital measurements are incredibly accurate — my clothes fit perfectly every single time.",
    rating: 5,
  },
  {
    name: 'Tariq Mahmood',
    role: 'Delivery Partner, Islamabad',
    avatar: 'https://i.pravatar.cc/100?u=tariq_mahmood',
    quote: 'The delivery management system is a game changer. My pickup rate increased by 40% and customers always know exactly when to expect their garments.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-brand-600 font-bold text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
            Loved by the craft community
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Hear from tailors, customers, and delivery partners who transformed their workflow with TailorHub.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-100/30 hover:-translate-y-1 transition-all"
            >
              <Quote className="w-8 h-8 text-brand-200 mb-4" />
              <p className="text-slate-700 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
