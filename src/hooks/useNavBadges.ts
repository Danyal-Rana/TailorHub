'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

type BadgeCounts = Record<string, number>;

export function useNavBadges(): BadgeCounts {
  const { appUser } = useAuth();
  const [counts, setCounts] = useState<BadgeCounts>({});

  useEffect(() => {
    if (!appUser) return;

    const unsubs: (() => void)[] = [];

    const update = (key: string, n: number) =>
      setCounts(prev => ({ ...prev, [key]: n }));

    // Unread notifications — every role
    unsubs.push(
      onSnapshot(
        query(
          collection(db, 'notifications'),
          where('recipientUid', '==', appUser.uid),
          where('isRead', '==', false),
        ),
        snap => update('/notifications', snap.size),
      ),
    );

    if (appUser.role === 'admin' || appUser.role === 'tailor') {
      unsubs.push(
        onSnapshot(
          query(collection(db, 'orders'), where('status', '==', 'pending')),
          snap => update('/orders', snap.size),
        ),
      );
      unsubs.push(
        onSnapshot(
          query(collection(db, 'measurementRequests'), where('status', '==', 'pending')),
          snap => update('/measurements', snap.size),
        ),
      );
    }

    if (appUser.role === 'customer') {
      unsubs.push(
        onSnapshot(
          query(
            collection(db, 'orders'),
            where('customerUid', '==', appUser.uid),
            where('status', '==', 'pending'),
          ),
          snap => update('/orders', snap.size),
        ),
      );
    }

    if (appUser.role === 'admin') {
      unsubs.push(
        onSnapshot(
          query(collection(db, 'users'), where('status', '==', 'pending_approval')),
          snap => update('/admin/approvals', snap.size),
        ),
      );
    }

    if (appUser.role === 'delivery') {
      unsubs.push(
        onSnapshot(
          query(
            collection(db, 'deliveries'),
            where('riderId', '==', appUser.uid),
            where('status', 'in', ['assigned', 'in_transit']),
          ),
          snap => update('/deliveries', snap.size),
        ),
      );
    }

    return () => unsubs.forEach(u => u());
  }, [appUser?.uid, appUser?.role]);

  return counts;
}
