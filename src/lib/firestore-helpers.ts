import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export const COLLECTIONS = {
  users:               'users',
  customers:           'customers',
  measurements:        'measurements',
  measurementRequests: 'measurementRequests',
  orders:              'orders',
  inventory:           'inventory',
  deliveries:          'deliveries',
  notifications:       'notifications',
} as const;

export const ts = () => serverTimestamp();
export const colRef = (name: string) => collection(db, name);
export const docRef = (name: string, id: string) => doc(db, name, id);

export {
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
};
