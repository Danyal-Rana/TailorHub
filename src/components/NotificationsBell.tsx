'use client';
import { Bell, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { markAsRead, markAllAsRead } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';

export function NotificationsBell() {
  const { list, unread } = useNotifications();
  const { appUser } = useAuth();
  const [open, setOpen] = useState(false);

  const handleMarkAll = async () => {
    if (appUser) await markAllAsRead(appUser.uid);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-slate-100 rounded-lg">
        <Bell className="w-5 h-5 text-slate-600" />
        {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-premium z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            {unread > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3"/> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {list.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No notifications yet.</div>
            ) : (
              list.slice(0, 5).map(n => (
                <div key={n.id} onClick={() => !n.isRead && markAsRead(n.id)} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-brand-50/30' : ''}`}>
                  <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.body}</p>
                  {n.link && <Link href={n.link} className="text-xs text-brand-600 hover:underline mt-2 inline-block">View details</Link>}
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <Link href="/notifications" onClick={() => setOpen(false)} className="text-sm font-bold text-brand-600 hover:text-brand-700">
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
