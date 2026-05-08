'use client';
import { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Save, Loader2 } from 'lucide-react';
import { Customer } from '@/lib/types';
import { AvatarUpload } from '../shared/AvatarUpload';

interface CustomerFormProps {
  initialData?: Customer | null;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  busy?: boolean;
}

export function CustomerForm({ initialData, onSubmit, onClose, busy }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    photoURL: initialData?.photoURL || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-display font-black text-slate-900">
            {initialData ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex justify-center mb-4">
            <AvatarUpload 
              value={formData.photoURL} 
              onChange={(url) => setFormData(prev => ({ ...prev, photoURL: url }))} 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  value={formData.phone} 
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                  placeholder="customer@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  value={formData.address} 
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                  placeholder="City, Area"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={busy}
              className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 shadow-premium hover:-translate-y-0.5 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <><Save className="w-5 h-5" /> Save Customer</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
