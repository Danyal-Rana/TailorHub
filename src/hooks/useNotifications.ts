'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification } from '@/lib/types';

export function useNotifications() {
  const { fbUser } = useAuth();
  const [list, setList] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!fbUser) return;
    const q = query(collection(db,'notifications'),
      where('recipientUid','==',fbUser.uid),
      orderBy('createdAt','desc'), limit(50));
    return onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Notification[];
      setList(docs);
      setUnread(docs.filter(n => !n.isRead).length);
    });
  }, [fbUser]);

  return { list, unread };
}
