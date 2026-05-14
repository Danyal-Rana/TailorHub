import { doc, updateDoc, addDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Notification } from '@/lib/types';

async function publishToRedis(uid: string, notification: Record<string, unknown>): Promise<void> {
  fetch('/api/notifications/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, notification }),
  }).catch(() => {});
}

export async function createNotification(data: {
  recipientUid: string;
  type: Notification['type'];
  title: string;
  body: string;
  link: string | null;
  metadata?: Record<string, unknown>;
}) {
  const ref = await addDoc(collection(db, 'notifications'), {
    recipientUid: data.recipientUid,
    type: data.type,
    title: data.title,
    body: data.body,
    link: data.link,
    isRead: false,
    metadata: data.metadata ?? {},
    createdAt: serverTimestamp(),
  });

  // Push to Redis queue so the SSE stream delivers it without waiting for Firestore onSnapshot
  publishToRedis(data.recipientUid, {
    id: ref.id,
    recipientUid: data.recipientUid,
    type: data.type,
    title: data.title,
    body: data.body,
    link: data.link,
    isRead: false,
    metadata: data.metadata ?? {},
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
  });

  return ref;
}

async function getUidsByRole(...roles: string[]): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, 'users'), where('role', 'in', roles), where('status', '==', 'active'))
  );
  return snap.docs.map(d => d.id);
}

export async function notifyStaff(type: Notification['type'], title: string, body: string, link: string | null) {
  const uids = await getUidsByRole('admin', 'tailor');
  return Promise.all(uids.map(uid => createNotification({ recipientUid: uid, type, title, body, link })));
}

export async function notifyAdmins(type: Notification['type'], title: string, body: string, link: string | null) {
  const uids = await getUidsByRole('admin');
  return Promise.all(uids.map(uid => createNotification({ recipientUid: uid, type, title, body, link })));
}

export async function markAsRead(id: string) {
  return updateDoc(doc(db, 'notifications', id), { isRead: true });
}

export async function markAllAsRead(uid: string) {
  const snap = await getDocs(
    query(collection(db, 'notifications'), where('recipientUid', '==', uid), where('isRead', '==', false))
  );
  return Promise.all(snap.docs.map(d => updateDoc(d.ref, { isRead: true })));
}
