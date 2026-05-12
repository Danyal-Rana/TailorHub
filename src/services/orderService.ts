import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notifyStaff, createNotification } from '@/services/notificationService';
import type { Order, OrderStatus } from '@/lib/types';

const col = collection(db, 'orders');

export async function listOrdersForRole(role: string, uid: string) {
  let q;
  if (role === 'admin' || role === 'tailor') q = query(col, orderBy('createdAt', 'desc'));
  else if (role === 'customer') q = query(col, where('customerUid', '==', uid), orderBy('createdAt', 'desc'));
  else q = query(col, where('deliveryBy', '==', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Order[];
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(col, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  notifyStaff(
    'new_order',
    'New Order Received',
    `New ${data.dressType} order${data.customerName ? ` from ${data.customerName}` : ''}`,
    `/orders/${ref.id}`
  ).catch(() => {});
  return ref;
}

export async function updateOrderStatus(id: string, status: OrderStatus, customerUid?: string | null) {
  await updateDoc(doc(col, id), { status, updatedAt: serverTimestamp() });

  addDoc(collection(doc(col, id), 'statusHistory'), {
    status,
    timestamp: serverTimestamp(),
  }).catch(() => {});

  if (customerUid) {
    createNotification({
      recipientUid: customerUid,
      type: 'order_status',
      title: 'Order Status Updated',
      body: `Your order status has changed to: ${status.replace(/_/g, ' ')}`,
      link: `/orders/${id}`,
    }).catch(() => {});
  }
}

export async function getOrder(id: string) {
  const s = await getDoc(doc(col, id));
  return s.exists() ? { id: s.id, ...(s.data() as any) } as Order : null;
}

export async function listOrdersByCustomer(customerId: string) {
  const snap = await getDocs(query(col, where('customerId', '==', customerId), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Order[];
}
