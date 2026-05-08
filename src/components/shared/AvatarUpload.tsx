'use client';
import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Image from 'next/image';

interface AvatarUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  folder?: 'profiles' | 'dresses' | 'inventory';
}

export function AvatarUpload({ value, onChange, folder = 'profiles' }: AvatarUploadProps) {
  const [busy, setBusy] = useState(false);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setBusy(true);
    try {
      const r = await uploadToCloudinary(f, folder);
      onChange(r.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <label className="relative group cursor-pointer block w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-premium">
      {value ? (
        <Image src={value} alt="Avatar" fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <Camera className="w-8 h-8" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
        {busy ? (
          <Loader2 className="text-white animate-spin w-8 h-8" />
        ) : (
          <Camera className="text-white w-8 h-8" />
        )}
      </div>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={onPick} 
        disabled={busy} 
      />
    </label>
  );
}
