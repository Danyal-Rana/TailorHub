import { collection, doc, updateDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const col = collection(db,'deliveries');

export async function listDeliveries(role: string, uid: string) {
  let q;
  if (role === 'admin') q = query(col, orderBy('createdAt', 'desc'));
  else q = query(col, where('riderId', '==', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateDeliveryStatus(id: string, status: string, proofImageURL: string | null = null) {
  const payload: any = { status, updatedAt: serverTimestamp() };
  if (status === 'completed') payload.completedAt = serverTimestamp();
  if (proofImageURL) payload.proofImageURL = proofImageURL;
  return updateDoc(doc(col,id), payload);
}

export async function assignDelivery(id: string, riderId: string) {
  return updateDoc(doc(col,id), { riderId, status: 'assigned', updatedAt: serverTimestamp() });
}
