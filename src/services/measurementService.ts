import { collection, doc, addDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notifyAdmins, createNotification } from '@/services/notificationService';
import type { Measurement } from '@/lib/types';

const col = collection(db, 'measurements');
const reqCol = collection(db, 'measurementRequests');

export async function createMeasurement(data: Omit<Measurement, 'id' | 'version' | 'createdAt' | 'updatedAt'>) {
  return addDoc(col, { ...data, version: 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateMeasurement(id: string, data: Partial<Measurement>, currentVersion: number) {
  return updateDoc(doc(col, id), { ...data, version: currentVersion + 1, updatedAt: serverTimestamp() });
}

export async function getMeasurementsForCustomer(customerId: string) {
  const snap = await getDocs(query(col, where('customerId', '==', customerId), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Measurement[];
}

export async function getMyMeasurements(uid: string) {
  const custSnap = await getDocs(query(collection(db, 'customers'), where('linkedUserId', '==', uid)));
  if (custSnap.empty) return [];
  return getMeasurementsForCustomer(custSnap.docs[0].id);
}

export async function createMeasurementRequest(data: { requestedBy: string; reason: string; message: string }) {
  const custSnap = await getDocs(query(collection(db, 'customers'), where('linkedUserId', '==', data.requestedBy)));
  const customerId = custSnap.empty ? null : custSnap.docs[0].id;

  const ref = await addDoc(reqCol, {
    customerId,
    requestedBy: data.requestedBy,
    reason: data.reason,
    message: data.message,
    status: 'pending',
    scheduledFor: null,
    assignedTailor: null,
    createdAt: serverTimestamp(),
  });

  notifyAdmins(
    'measurement_request',
    'New Measurement Request',
    `A customer has requested a measurement: ${data.reason.replace(/_/g, ' ')}`,
    '/measurements'
  ).catch(() => {});

  return ref;
}

export async function updateMeasurementRequest(id: string, data: {
  status?: string;
  assignedTailor?: string | null;
  scheduledFor?: string | null;
}) {
  return updateDoc(doc(reqCol, id), data);
}

export async function assignMeasurementRequest(
  id: string,
  tailorUid: string,
  scheduledFor: string | null
) {
  await updateDoc(doc(reqCol, id), {
    assignedTailor: tailorUid,
    scheduledFor: scheduledFor || null,
    status: 'scheduled',
  });
  createNotification({
    recipientUid: tailorUid,
    type: 'measurement_request',
    title: 'Measurement Request Assigned',
    body: `You have been assigned a measurement request${scheduledFor ? ` scheduled for ${new Date(scheduledFor).toLocaleDateString()}` : ''}`,
    link: '/measurements',
  }).catch(() => {});
}

export async function listPendingRequests() {
  const snap = await getDocs(query(reqCol, where('status', '==', 'pending'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function listAllRequests() {
  const snap = await getDocs(query(reqCol, orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
}
