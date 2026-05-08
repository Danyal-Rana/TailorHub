'use client';
import { useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Image from 'next/image';

export function MultiImageUpload({ value = [], onChange, folder = 'dresses' }: {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: 'profiles' | 'dresses' | 'inventory';
}) {
  const [busy, setBusy] = useState(false);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const urls = [...value];
      for (let i = 0; i < files.length; i++) {
        const r = await uploadToCloudinary(files[i], folder);
        urls.push(r.secure_url);
      }
      onChange(urls);
    } finally {
      setBusy(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {value.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
            <Image src={url} alt="" fill className="object-cover" />
            <button type="button" onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <label className="relative w-24 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50 cursor-pointer transition">
          {busy ? <Loader2 className="w-6 h-6 text-brand-500 animate-spin" /> : <Camera className="w-6 h-6 text-slate-400" />}
          <span className="text-xs text-slate-500 mt-1">Add Image</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={onPick} disabled={busy} />
        </label>
      </div>
    </div>
  );
}
