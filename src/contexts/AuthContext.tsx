'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
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
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      try {
        setFbUser(u);
        if (u) {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            setAppUser(snap.data() as AppUser);
          } else {
            setAppUser(null);
          }
        } else {
          setAppUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUpEmail = async (
    email: string,
    password: string,
    displayName: string,
    role: Role
  ) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const status = role === 'tailor' || role === 'delivery' ? 'pending_approval' : 'active';
      const userData: Partial<AppUser> = {
        uid: cred.user.uid,
        email,
        phone: null,
        displayName,
        photoURL: null,
        role,
        status,
        authProviders: ['password'],
        address: null,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        approvedBy: null,
        approvedAt: null,
      };
      await setDoc(doc(db, 'users', cred.user.uid), userData);
      setAppUser(userData as AppUser);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const ref = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        const userData: Partial<AppUser> = {
          uid: cred.user.uid,
          email: cred.user.email,
          phone: null,
          displayName: cred.user.displayName ?? '',
          photoURL: cred.user.photoURL,
          role: 'customer',
          status: 'active',
          authProviders: ['google.com'],
          address: null,
          createdAt: serverTimestamp() as any,
          updatedAt: serverTimestamp() as any,
          approvedBy: null,
          approvedAt: null,
        };
        await setDoc(ref, userData);
        setAppUser(userData as AppUser);
      } else {
        setAppUser(snap.data() as AppUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
  
  const signOut = async () => {
    setLoading(true);
    try {
      await fbSignOut(auth);
      setFbUser(null);
      setAppUser(null);
    } finally {
      setLoading(false);
    }
  };

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
