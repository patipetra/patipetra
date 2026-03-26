import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            "AIzaSyAXjSthJEAqg5wqZ-2BScC1vsFwU02XJSk",
  authDomain:        "patipetra-dec35.firebaseapp.com",
  projectId:         "patipetra-dec35",
  storageBucket:     "patipetra-dec35.firebasestorage.app",
  messagingSenderId: "154426577840",
  appId:             "1:154426577840:web:c273b6e8aba66ed658bc75",
};

const app    = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
