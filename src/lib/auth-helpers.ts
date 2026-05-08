import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

let recaptcha: RecaptchaVerifier | null = null;

export function initRecaptcha(containerId: string): RecaptchaVerifier {
  if (!recaptcha) {
    recaptcha = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  }
  return recaptcha;
}

export async function sendOtp(phone: string): Promise<ConfirmationResult> {
  const verifier = initRecaptcha('recaptcha-container');
  return signInWithPhoneNumber(auth, phone, verifier);
}

export async function verifyOtp(
  confirmation: ConfirmationResult,
  code: string,
  displayName: string
) {
  const cred = await confirmation.confirm(code);
  const ref = doc(db, 'users', cred.user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: cred.user.uid,
      email: null,
      phone: cred.user.phoneNumber,
      displayName,
      photoURL: null,
      role: 'customer',
      status: 'active',
      authProviders: ['phone'],
      address: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      approvedBy: null,
      approvedAt: null,
    });
  }
  return cred;
}
