import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return false;
    return snap.data()?.role === 'admin';
  } catch {
    return false;
  }
}

export async function setAdminRole(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { role: 'admin' });
}

export async function removeAdminRole(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { role: 'user' });
}
