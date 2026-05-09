import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';

const ADMIN_PASSWORD = 'TH!l0rHub@Adm#2025';
const DEFAULT_PASSWORD = 'SeedUser@123';

const KEY_FILE = './serviceAccountKey.json';
const FALLBACK_KEY = './tailorhub-505-firebase-adminsdk-fbsvc-1e88ec6eaa.json';
const keyPath = fs.existsSync(KEY_FILE) ? KEY_FILE : FALLBACK_KEY;
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const data = JSON.parse(fs.readFileSync('./scripts/seed-data.json', 'utf8'));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const auth = getAuth();

async function ensureAuthUser(u) {
  const password = u.role === 'admin' ? ADMIN_PASSWORD : DEFAULT_PASSWORD;
  try {
    await auth.getUser(u.uid);
    await auth.updateUser(u.uid, { password });
    console.log(`  Updated auth: ${u.email}`);
  } catch {
    await auth.createUser({ uid: u.uid, email: u.email, displayName: u.displayName, password });
    console.log(`  Created auth: ${u.email}`);
  }
}

async function seed() {
  console.log('\n── Users ──────────────────────────────');
  for (const u of data.users) {
    await ensureAuthUser(u);
    await db.collection('users').doc(u.uid).set({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      status: u.status,
      phone: null,
      photoURL: null,
      authProviders: ['password'],
      address: null,
      approvedBy: null,
      approvedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: users/${u.uid}`);
  }

  console.log('\n── Customers ───────────────────────────');
  for (const c of data.customers) {
    await db.collection('customers').doc(c.id).set({
      ...c,
      photoURL: null,
      createdBy: 'admin_seed_01',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: customers/${c.id}`);
  }

  console.log('\n── Measurements ────────────────────────');
  for (const m of data.measurements) {
    await db.collection('measurements').doc(m.id).set({
      ...m,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: measurements/${m.id}`);
  }

  console.log('\n── Orders ──────────────────────────────');
  for (const o of data.orders) {
    await db.collection('orders').doc(o.id).set({
      ...o,
      pickupDate: null,
      pickupBy: null,
      deliveryDate: null,
      deliveryBy: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: orders/${o.id}`);
  }

  console.log('\n── Inventory ───────────────────────────');
  for (const i of data.inventory) {
    await db.collection('inventory').doc(i.id).set({
      ...i,
      imageURL: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: inventory/${i.id}`);
  }

  console.log('\n── Deliveries ──────────────────────────');
  for (const d of data.deliveries) {
    await db.collection('deliveries').doc(d.id).set({
      ...d,
      scheduledAt: Timestamp.fromDate(new Date(d.scheduledAt)),
      completedAt: null,
      proofImageURL: null,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: deliveries/${d.id}`);
  }

  console.log('\n── Measurement Requests ────────────────');
  for (const mr of data.measurementRequests) {
    await db.collection('measurementRequests').doc(mr.id).set({
      ...mr,
      scheduledFor: null,
      assignedTailor: null,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: measurementRequests/${mr.id}`);
  }

  console.log('\n── Notifications ───────────────────────');
  for (const n of data.notifications) {
    await db.collection('notifications').doc(n.id).set({
      ...n,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Firestore: notifications/${n.id}`);
  }

  console.log('\n────────────────────────────────────────');
  console.log('Seed complete.\n');
  console.log('Admin credentials:');
  console.log(`  Email:    admin@tailorhub.dev`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('\nOther seed users password:', DEFAULT_PASSWORD);
}

seed().catch(e => { console.error(e); process.exit(1); });
