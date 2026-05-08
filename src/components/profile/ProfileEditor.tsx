'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateMyProfile } from '@/services/userService';
import { AvatarUpload } from '../shared/AvatarUpload';
import { toast } from 'sonner';
import { User, MapPin, Mail, Phone, Save } from 'lucide-react';
import Link from 'next/link';

export function ProfileEditor() {
  const { appUser, fbUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({
    displayName: appUser?.displayName || '',
    photoURL: appUser?.photoURL || '',
    address: appUser?.address || '',
  });

  if (!appUser) return null;

  const onSave = async () => {
    setBusy(true);
    try {
      await updateMyProfile(appUser.uid, formData);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <AvatarUpload 
            value={formData.photoURL} 
            onChange={(url) => setFormData(prev => ({ ...prev, photoURL: url }))} 
          />
          <p className="text-sm text-slate-500">Click to change avatar</p>
        </div>

        <div className="flex-1 space-y-6 w-full">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input 
                value={formData.displayName} 
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input 
                value={fbUser?.email || 'No email'} 
                disabled
                className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input 
                value={fbUser?.phoneNumber || 'No phone'} 
                disabled
                className="w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </label>
              <input 
                value={formData.address} 
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition"
                placeholder="Street address, City"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onSave}
              disabled={busy}
              className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
            >
              {busy ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>

      {appUser.role === 'customer' && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-amber-900">Need to update measurements?</h3>
            <p className="text-amber-700 text-sm">To ensure the perfect fit, please request a new measurement appointment.</p>
          </div>
          <Link 
            href="/measurements/request" 
            className="px-6 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition shadow-sm"
          >
            Request Update
          </Link>
        </div>
      )}
    </div>
  );
}
