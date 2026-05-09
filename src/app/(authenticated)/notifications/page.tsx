'use client';
import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { markAsRead, markAllAsRead } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { list, unread } = useNotifications();
  const { appUser } = useAuth();

  // Auto-mark all unread as read when user opens this page
  useEffect(() => {
    if (appUser?.uid) {
      markAllAsRead(appUser.uid);
    }
  }, [appUser?.uid]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={() => appUser && markAllAsRead(appUser.uid)}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <CheckCircle className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
        {list.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">No notifications yet.</p>
            </div>
          </div>
        ) : (
          list.map(n => (
            <div
              key={n.id}
              className={`p-5 flex items-start gap-4 transition-colors ${
                !n.isRead
                  ? 'bg-brand-50/40 dark:bg-brand-900/10'
                  : 'hover:bg-slate-50/60 dark:hover:bg-slate-700/30'
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                !n.isRead
                  ? 'bg-brand-100 dark:bg-brand-800/40 text-brand-600 dark:text-brand-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <h3 className={`text-sm leading-snug ${
                    !n.isRead
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'font-medium text-slate-700 dark:text-slate-300'
                  }`}>
                    {n.title}
                    {!n.isRead && (
                      <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-brand-500 align-middle" />
                    )}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                    <Clock className="w-3 h-3" />
                    {n.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.body}</p>
                <div className="mt-2.5 flex gap-4 items-center">
                  {n.link && (
                    <Link href={n.link} className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                      View →
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
