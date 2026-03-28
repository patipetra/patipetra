'use client';
import { useState, useEffect } from 'react';
import { onAuthChange } from '@/lib/auth';
import {
  doc, setDoc, deleteDoc, getDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Props {
  targetId:   string;
  targetType: 'listing' | 'vet' | 'service';
  targetName: string;
}

export default function FavoriteButton({ targetId, targetType, targetName }: Props) {
  const router = useRouter();
  const [user,     setUser]     = useState<any>(null);
  const [isFav,    setIsFav]    = useState(false);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async u => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db,'favorites',`${u.uid}_${targetId}`));
        setIsFav(snap.exists());
      }
    });
    return () => unsub();
  }, [targetId]);

  async function toggle() {
    if (!user) { router.push('/giris'); return; }
    setLoading(true);
    try {
      const ref = doc(db,'favorites',`${user.uid}_${targetId}`);
      if (isFav) {
        await deleteDoc(ref);
        setIsFav(false);
      } else {
        await setDoc(ref, {
          userId:     user.uid,
          targetId,
          targetType,
          targetName,
          createdAt:  serverTimestamp(),
        });
        setIsFav(true);
      }
    } finally { setLoading(false); }
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all border ${isFav?'bg-red-50 text-red-500 border-red-200 hover:bg-red-100':'bg-white text-[#7A7368] border-[#E3D9C6] hover:border-[#C9832E] hover:text-[#C9832E]'} disabled:opacity-60`}>
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
      ) : (
        <span className="text-base">{isFav ? '❤️' : '🤍'}</span>
      )}
      <span>{isFav ? 'Favorilendi' : 'Favorile'}</span>
    </button>
  );
}
