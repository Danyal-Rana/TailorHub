'use client';
import { useNotifications } from '@/hooks/useNotifications';
import { markAsRead, markAllAsRead } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { list, unread } = useNotifications();
  const { appUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-black text-slate-900">Notifications</h1>
        {unread > 0 && (
          <button onClick={() => appUser && markAllAsRead(appUser.uid)} className="btn-ghost px-4 py-2 bg-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4"/> Mark all read
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden divide-y divide-slate-100">
        {list.length === 0 ? (
          <div className="p-20 text-center text-slate-500 flex flex-col items-center">
            <Bell className="w-12 h-12 text-slate-300 mb-4" />
            <p>You're all caught up!</p>
          </div>
        ) : (
          list.map(n => (
            <div key={n.id} className={`p-6 flex items-start gap-4 transition-colors ${!n.isRead ? 'bg-brand-50/30' : 'hover:bg-slate-50'}`}>
              <div className={`p-3 rounded-full shrink-0 ${!n.isRead ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{n.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 mt-1">{n.body}</p>
                <div className="mt-3 flex gap-4">
                  {n.link && <Link href={n.link} className="text-sm font-bold text-brand-600 hover:text-brand-700">View Action</Link>}
                  {!n.isRead && <button onClick={() => markAsRead(n.id)} className="text-sm text-slate-500 hover:text-slate-700">Mark as read</button>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
