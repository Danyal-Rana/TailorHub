import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer } from '@/lib/types';

const col = collection(db, 'customers');

export async function listCustomers(): Promise<Customer[]> {
  const snap = await getDocs(query(col, orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Customer[];
}

export async function getCustomer(id: string) {
  const s = await getDoc(doc(col, id));
  return s.exists() ? ({ id: s.id, ...(s.data() as any) } as Customer) : null;
}

export async function createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(col, { 
    ...data, 
    createdAt: serverTimestamp(), 
    updatedAt: serverTimestamp() 
  });
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  return updateDoc(doc(col, id), { 
    ...data, 
    updatedAt: serverTimestamp() 
  });
}

export async function deleteCustomer(id: string) {
  return deleteDoc(doc(col, id));
}

export async function findByLinkedUser(uid: string) {
  const q = query(col, where('linkedUserId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs[0] ? ({ id: snap.docs[0].id, ...(snap.docs[0].data() as any) } as Customer) : null;
}
