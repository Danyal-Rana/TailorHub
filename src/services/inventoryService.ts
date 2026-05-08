import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { InventoryItem } from '@/lib/types';

const col = collection(db,'inventory');

export async function listInventory() {
  const snap = await getDocs(query(col, orderBy('createdAt','desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as InventoryItem[];
}

export async function createInventoryItem(data: Omit<InventoryItem,'id'|'createdAt'|'updatedAt'>) {
  return addDoc(col, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateInventoryItem(id: string, data: Partial<InventoryItem>) {
  return updateDoc(doc(col,id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteInventoryItem(id: string) {
  return deleteDoc(doc(col,id));
}
