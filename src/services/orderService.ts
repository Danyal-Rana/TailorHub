import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notifyStaff, createNotification } from '@/services/notificationService';
import { ORDER_CACHE_KEYS } from '@/lib/redis';
import type { Order, OrderStatus } from '@/lib/types';

const col = collection(db, 'orders');

// ── Timestamp serialization ───────────────────────────────────────────────────

function serializeOrder(order: Order): Record<string, unknown> {
  const toIso = (t: Timestamp | null | undefined) => t?.toDate?.()?.toISOString() ?? null;
  return {
    ...order,
    createdAt: toIso(order.createdAt),
    updatedAt: toIso(order.updatedAt),
    pickupDate: toIso(order.pickupDate),
    deliveryDate: toIso(order.deliveryDate),
  };
}

function makeTimestamp(iso: string | null): Timestamp | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  return { toDate: () => new Date(iso), seconds: Math.floor(ms / 1000), nanoseconds: 0 } as unknown as Timestamp;
}

function deserializeOrder(raw: Record<string, unknown>): Order {
  return {
    ...(raw as unknown as Order),
    createdAt: makeTimestamp(raw.createdAt as string | null) as Timestamp,
    updatedAt: makeTimestamp(raw.updatedAt as string | null) as Timestamp,
    pickupDate: makeTimestamp(raw.pickupDate as string | null),
    deliveryDate: makeTimestamp(raw.deliveryDate as string | null),
  };
}

// ── Cache helpers ─────────────────────────────────────────────────────────────

function cacheKeyForRole(role: string, uid: string): string {
  if (role === 'admin' || role === 'tailor') return ORDER_CACHE_KEYS.all;
  if (role === 'customer') return ORDER_CACHE_KEYS.customer(uid);
  return ORDER_CACHE_KEYS.delivery(uid);
}

async function readCache(key: string): Promise<Order[] | null> {
  try {
    const res = await fetch(`/api/orders/cache?key=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const { data } = await res.json() as { data: Record<string, unknown>[] | null };
    if (!data) return null;
    return data.map(deserializeOrder);
  } catch {
    return null;
  }
}

function writeCache(key: string, orders: Order[]): void {
  fetch('/api/orders/cache', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, data: orders.map(serializeOrder) }),
  }).catch(() => {});
}

function invalidateCache(...keys: string[]): void {
  keys.forEach(key =>
    fetch(`/api/orders/cache?key=${encodeURIComponent(key)}`, { method: 'DELETE' }).catch(() => {})
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function listOrdersForRole(role: string, uid: string): Promise<Order[]> {
  const cacheKey = cacheKeyForRole(role, uid);
  const cached = await readCache(cacheKey);
  if (cached) return cached;

  let q;
  if (role === 'admin' || role === 'tailor') q = query(col, orderBy('createdAt', 'desc'));
  else if (role === 'customer') q = query(col, where('customerUid', '==', uid), orderBy('createdAt', 'desc'));
  else q = query(col, where('deliveryBy', '==', uid), orderBy('createdAt', 'desc'));

  const snap = await getDocs(q);
  const orders = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) })) as Order[];

  writeCache(cacheKey, orders);
  return orders;
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(col, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

  invalidateCache(ORDER_CACHE_KEYS.all);
  if (data.customerUid) invalidateCache(ORDER_CACHE_KEYS.customer(data.customerUid));

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

  const keysToInvalidate: string[] = [ORDER_CACHE_KEYS.all];
  if (customerUid) keysToInvalidate.push(ORDER_CACHE_KEYS.customer(customerUid));
  invalidateCache(...keysToInvalidate);

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
  return s.exists() ? { id: s.id, ...(s.data() as Omit<Order, 'id'>) } as Order : null;
}

export async function listOrdersByCustomer(customerId: string) {
  const snap = await getDocs(query(col, where('customerId', '==', customerId), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) })) as Order[];
}
