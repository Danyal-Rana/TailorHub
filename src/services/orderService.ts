import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus } from '@/lib/types';

const col = collection(db,'orders');

export async function listOrdersForRole(role: string, uid: string) {
  let q;
  if (role === 'admin' || role === 'tailor') q = query(col, orderBy('createdAt','desc'));
  else if (role === 'customer') q = query(col, where('customerUid','==',uid), orderBy('createdAt','desc'));
  else q = query(col, where('deliveryBy','==',uid), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Order[];
}

export async function createOrder(data: Omit<Order,'id'|'createdAt'|'updatedAt'>) {
  return addDoc(col, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export async function updateOrderStatus(id: string, status: OrderStatus) {
  return updateDoc(doc(col,id), { status, updatedAt: serverTimestamp() });
}
export async function getOrder(id: string) {
  const s = await getDoc(doc(col,id));
  return s.exists() ? { id: s.id, ...(s.data() as any) } as Order : null;
}
