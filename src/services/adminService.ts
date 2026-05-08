import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getAdminStats() {
  const [users, orders, customers, inventory] = await Promise.all([
    getDocs(collection(db,'users')),
    getDocs(collection(db,'orders')),
    getDocs(collection(db,'customers')),
    getDocs(collection(db,'inventory')),
  ]);
  const orderDocs = orders.docs.map(d => d.data());
  return {
    totalUsers: users.size,
    totalCustomers: customers.size,
    pendingApprovals: users.docs.filter(d => d.data().status === 'pending_approval').length,
    totalOrders: orders.size,
    pendingOrders: orderDocs.filter(o => o.status === 'pending').length,
    inProgress: orderDocs.filter(o => o.status === 'in_progress').length,
    delivered: orderDocs.filter(o => o.status === 'delivered').length,
    revenue: orderDocs.filter(o => o.status === 'delivered').reduce((s,o) => s + (o.price || 0), 0),
    lowStock: inventory.docs.filter(d => d.data().stock <= d.data().minStock).length,
  };
}

export async function listPendingApprovals() {
  const snap = await getDocs(query(collection(db,'users'), where('status','==','pending_approval')));
  return snap.docs.map(d => ({ uid: d.id, ...(d.data() as any) }));
}

export async function approveUser(uid: string, approverUid: string) {
  await updateDoc(doc(db,'users',uid), { status: 'active', approvedBy: approverUid, approvedAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function rejectUser(uid: string) {
  await updateDoc(doc(db,'users',uid), { status: 'rejected', updatedAt: serverTimestamp() });
}
