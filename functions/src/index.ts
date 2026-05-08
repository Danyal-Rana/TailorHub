import * as functions from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = getFirestore();

export const onUserApproved = functions.onDocumentUpdated('users/{uid}', async (e) => {
  const before = e.data?.before.data();
  const after = e.data?.after.data();
  if (!before || !after) return;
  if (before.status === 'pending_approval' && after.status === 'active') {
    await db.collection('notifications').add({
      recipientUid: e.params.uid,
      type: 'approval_status',
      title: 'Account Approved!',
      body: 'Your account has been approved. You can now access your dashboard.',
      link: '/dashboard',
      isRead: false,
      metadata: {},
      createdAt: FieldValue.serverTimestamp(),
    });
  }
});

export const onOrderCreated = functions.onDocumentCreated('orders/{id}', async (e) => {
  const data = e.data?.data();
  if (!data) return;
  
  // Notify admins
  const admins = await db.collection('users').where('role', '==', 'admin').get();
  const promises = admins.docs.map(admin => 
    db.collection('notifications').add({
      recipientUid: admin.id,
      type: 'new_order',
      title: 'New Order Received',
      body: `A new ${data.dressType} order has been placed.`,
      link: `/orders/${e.params.id}`,
      isRead: false,
      metadata: { orderId: e.params.id },
      createdAt: FieldValue.serverTimestamp(),
    })
  );
  await Promise.all(promises);
});

export const onOrderStatusChanged = functions.onDocumentUpdated('orders/{id}', async (e) => {
  const before = e.data?.before.data();
  const after = e.data?.after.data();
  if (!before || !after || before.status === after.status) return;
  
  if (after.customerUid) {
    await db.collection('notifications').add({
      recipientUid: after.customerUid,
      type: 'order_status',
      title: 'Order Update',
      body: `Your order is now: ${after.status.replace(/_/g, ' ')}`,
      link: `/orders/${e.params.id}`,
      isRead: false,
      metadata: { orderId: e.params.id, newStatus: after.status },
      createdAt: FieldValue.serverTimestamp(),
    });
  }
});

export const onMeasurementRequest = functions.onDocumentCreated('measurementRequests/{id}', async (e) => {
  const data = e.data?.data();
  if (!data) return;
  
  const tailors = await db.collection('users').where('role', '==', 'tailor').get();
  const promises = tailors.docs.map(tailor => 
    db.collection('notifications').add({
      recipientUid: tailor.id,
      type: 'measurement_request',
      title: 'New Measurement Request',
      body: `A customer requested a measurement update.`,
      link: `/measurements`,
      isRead: false,
      metadata: { requestId: e.params.id },
      createdAt: FieldValue.serverTimestamp(),
    })
  );
  await Promise.all(promises);
});

export const onDeliveryAssigned = functions.onDocumentUpdated('deliveries/{id}', async (e) => {
  const before = e.data?.before.data();
  const after = e.data?.after.data();
  if (!before || !after || before.riderId === after.riderId) return;
  
  if (after.riderId) {
    await db.collection('notifications').add({
      recipientUid: after.riderId,
      type: 'pickup_assigned',
      title: 'New Delivery Assigned',
      body: `You have been assigned a new ${after.type}.`,
      link: `/deliveries`,
      isRead: false,
      metadata: { deliveryId: e.params.id },
      createdAt: FieldValue.serverTimestamp(),
    });
  }
});
