import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function updateMyProfile(uid: string, data: { displayName?: string; photoURL?: string; address?: string }) {
  await updateDoc(doc(db, 'users', uid), { 
    ...data, 
    updatedAt: serverTimestamp() 
  });
}
