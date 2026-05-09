import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

let recaptchaInstance: RecaptchaVerifier | null = null;

function clearRecaptcha() {
  if (recaptchaInstance) {
    try { recaptchaInstance.clear(); } catch { /* already cleared */ }
    recaptchaInstance = null;
  }
}

export async function sendOtp(phone: string): Promise<ConfirmationResult> {
  // Always start with a fresh verifier — reusing a used/errored one silently fails
  clearRecaptcha();
  recaptchaInstance = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
  try {
    return await signInWithPhoneNumber(auth, phone, recaptchaInstance);
  } catch (e) {
    clearRecaptcha();
    throw e;
  }
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
