import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();

export async function registerWithEmail(email: string, password: string, name: string, surname: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: `${name} ${surname}` });
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid, name, surname, email,
    role: 'user', plan: 'free',
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return user;
}

export async function loginWithEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function loginWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider);
  const ref = doc(db, 'users', user.uid);
  if (!(await getDoc(ref)).exists()) {
    const parts = (user.displayName || '').split(' ');
    await setDoc(ref, {
      id: user.uid, name: parts[0] || '', surname: parts.slice(1).join(' ') || '',
      email: user.email, avatarUrl: user.photoURL,
      role: 'user', plan: 'free',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
  }
  return user;
}

export const logout      = () => signOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const onAuthChange  = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb);

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
