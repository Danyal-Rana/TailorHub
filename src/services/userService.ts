import { doc, updateDoc, getDocs, query, collection, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function updateMyProfile(uid: string, data: { displayName?: string; photoURL?: string; address?: string }) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function listActiveTailors(): Promise<{ uid: string; displayName: string }[]> {
  const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'tailor'), where('status', '==', 'active')));
  return snap.docs.map(d => ({ uid: d.id, displayName: (d.data() as any).displayName || 'Tailor' }));
}
