'use client';
import { Customer } from '@/lib/types';
import { User, Phone, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link 
      href={`/customers/${customer.id}`}
      className="glass-card p-6 block hover:shadow-glow transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
          {customer.photoURL ? (
            <Image src={customer.photoURL} alt={customer.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-brand-600 transition">
              {customer.name}
            </h3>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-400 transition transform group-hover:translate-x-1" />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="w-3.5 h-3.5" />
              <span>{customer.phone}</span>
            </div>
            {customer.address && (
              <div className="flex items-center gap-2 text-sm text-slate-500 truncate">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{customer.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">
          Added {new Date(customer.createdAt.seconds * 1000).toLocaleDateString()}
        </span>
        {customer.linkedUserId && (
          <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
            App User
          </span>
        )}
      </div>
    </Link>
  );
}
