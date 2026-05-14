'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification } from '@/lib/types';
import type { Timestamp } from 'firebase/firestore';

function makeTimestamp(seconds: number): Timestamp {
  return { toDate: () => new Date(seconds * 1000), seconds, nanoseconds: 0 } as unknown as Timestamp;
}

export function useNotifications() {
  const { fbUser } = useAuth();
  const [list, setList] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  // Firestore snapshot — source of truth for read/unread state
  useEffect(() => {
    if (!fbUser) return;
    const q = query(
      collection(db, 'notifications'),
      where('recipientUid', '==', fbUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    return onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Notification[];
      setList(docs);
      setUnread(docs.filter(n => !n.isRead).length);
    });
  }, [fbUser]);

  // SSE stream — delivers new notifications via Redis before Firestore propagates
  useEffect(() => {
    if (!fbUser) return;

    let es: EventSource;

    function connect() {
      es = new EventSource(`/api/notifications/stream?uid=${fbUser!.uid}`);

      es.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data) as Record<string, unknown>;
          const notif: Notification = {
            ...(raw as unknown as Notification),
            // Reconstruct a Timestamp-compatible object from the plain seconds value
            createdAt: makeTimestamp((raw.createdAt as { seconds: number }).seconds),
          };
          setList(prev => {
            if (prev.some(n => n.id === notif.id)) return prev; // already in list via onSnapshot
            return [notif, ...prev];
          });
          setUnread(c => c + 1);
        } catch {
          // ignore malformed events
        }
      };

      // Auto-reconnect when the 25s session closes
      es.onerror = () => {
        es.close();
        setTimeout(connect, 1000);
      };
    }

    connect();
    return () => es?.close();
  }, [fbUser]);

  return { list, unread };
}
