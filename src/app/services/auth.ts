import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db } from '../lib/firebase';

function requireAuth() {
  if (!app) throw new Error('Firebase não está configurado neste ambiente.');
  return getAuth(app);
}

export async function loginAdmin(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(requireAuth(), email, password);
  return credential.user;
}

export async function logoutAdmin() {
  await signOut(requireAuth());
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(requireAuth(), callback);
}

export async function isUserAdmin(uid: string): Promise<boolean> {
  if (!db) return false;
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}
