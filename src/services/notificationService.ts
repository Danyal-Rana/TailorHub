import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function markAsRead(id: string) {
  return updateDoc(doc(db, 'notifications', id), { isRead: true });
}

export async function markAllAsRead(uid: string) {
  const q = query(collection(db, 'notifications'), where('recipientUid', '==', uid), where('isRead', '==', false));
  const snap = await getDocs(q);
  const promises = snap.docs.map(d => updateDoc(d.ref, { isRead: true }));
  return Promise.all(promises);
}
