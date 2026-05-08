'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { AppUser, Role } from '../lib/types';

interface AuthContextValue {
  fbUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName: string, role: Role) => Promise<void>;
  signInGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setFbUser(u);
      if (u) {
        const snap = await getDoc(doc(db, 'users', u.uid));
        setAppUser(snap.exists() ? (snap.data() as AppUser) : null);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
  }, []);

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (
    email: string,
    password: string,
    displayName: string,
    role: Role
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const status = role === 'tailor' || role === 'delivery' ? 'pending_approval' : 'active';
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      phone: null,
      displayName,
      photoURL: null,
      role,
      status,
      authProviders: ['password'],
      address: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      approvedBy: null,
      approvedAt: null,
    });
  };

  const signInGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const ref = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: cred.user.uid,
        email: cred.user.email,
        phone: null,
        displayName: cred.user.displayName ?? '',
        photoURL: cred.user.photoURL,
        role: 'customer',
        status: 'active',
        authProviders: ['google.com'],
        address: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        approvedBy: null,
        approvedAt: null,
      });
    }
  };

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
  const signOut = () => fbSignOut(auth);

  return (
    <AuthContext.Provider
      value={{ fbUser, appUser, loading, signInEmail, signUpEmail, signInGoogle, resetPassword, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
