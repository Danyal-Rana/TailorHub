import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('./scripts/seed-data.json', 'utf8'));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const auth = getAuth();

async function ensureAuthUser(u) {
  try { await auth.getUser(u.uid); }
  catch {
    await auth.createUser({
      uid: u.uid, email: u.email, displayName: u.displayName,
      password: 'Password123!',
    });
  }
}

async function seed() {
  console.log('Seeding users...');
  for (const u of data.users) {
    await ensureAuthUser(u);
    await db.collection('users').doc(u.uid).set({
      ...u, phone: null, photoURL: null, authProviders: ['password'],
      address: null, approvedBy: null, approvedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  console.log('Seeding customers...');
  for (const c of data.customers) {
    await db.collection('customers').doc(c.id).set({
      ...c, photoURL: null, createdBy: 'admin_seed_01',
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
  }
  console.log('Seeding measurements...');
  for (const m of data.measurements) {
    await db.collection('measurements').doc(m.id).set({
      ...m, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
  }
  console.log('Seeding orders...');
  for (const o of data.orders) {
    await db.collection('orders').doc(o.id).set({
      ...o, pickupDate: null, pickupBy: null, deliveryDate: null, deliveryBy: null,
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
  }
  console.log('Seeding inventory...');
  for (const i of data.inventory) {
    await db.collection('inventory').doc(i.id).set({
      ...i, imageURL: null,
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
  }
  console.log('Done. Seed users password: Password123!');
}
seed().catch(e => { console.error(e); process.exit(1); });
