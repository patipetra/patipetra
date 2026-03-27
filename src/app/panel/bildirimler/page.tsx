'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import {
  collection, getDocs, query, where,
  orderBy, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

function timeAgo(date: any): string {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff/60000);
  if (m < 1) return 'az önce';
  if (m < 60) return `${m} dk önce`;
  if (m < 1440) return `${Math.floor(m/60)} sa önce`;
  return `${Math.floor(m/1440)} gün önce`;
}

const TYPE_ICON: Record<string,string> = {
  vet_answer:       '🩺',
  listing_approved: '📢',
  listing_rejected: '❌',
  system:           '🎉',
  premium:          '✦',
};

export default function BildirimlerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifs,  setNotifs]  = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthChange(async u => {
      if (!u) { router.push('/giris'); return; }
      try {
        const snap = await getDocs(query(
          collection(db,'notifications'),
          where('userId','==',u.uid),
          orderBy('createdAt','desc')
        ));
        setNotifs(snap.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e) { console.error(e); }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function markAllRead() {
    const unread = notifs.filter(n=>!n.isRead);
    for (const n of unread) {
      await updateDoc(doc(db,'notifications',n.id), {isRead:true});
    }
    setNotifs(prev=>prev.map(n=>({...n,isRead:true})));
  }

  async function markRead(id: string) {
    await updateDoc(doc(db,'notifications',id), {isRead:true});
    setNotifs(prev=>prev.map(n=>n.id===id?{...n,isRead:true}:n));
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  const unread = notifs.filter(n=>!n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F7F2EA]">
      <div className="lg:ml-[260px] p-6 max-w-[700px]">
        <Link href="/panel" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Dashboard</Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl font-semibold text-[#2F2622]">
            🔔 Bildirimler
            {unread>0&&<span className="text-sm font-normal text-[#C9832E] ml-2">({unread} yeni)</span>}
          </h1>
          {unread>0&&(
            <button onClick={markAllRead} className="text-sm text-[#C9832E] hover:underline">
              Tümünü okundu işaretle
            </button>
          )}
        </div>

        {notifs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[20px] border border-[rgba(196,169,107,.12)]">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Henüz bildirim yok</h3>
            <p className="text-sm text-[#7A7368]">Yeni bildirimler burada görünecek.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifs.map(n=>(
              <div key={n.id}
                onClick={()=>markRead(n.id)}
                className={`bg-white rounded-[16px] border p-4 flex items-start gap-4 transition-all cursor-pointer hover:shadow-md ${n.isRead?'border-[rgba(196,169,107,.1)] opacity-80':'border-[rgba(201,131,46,.2)] shadow-sm'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${n.isRead?'bg-[#F7F2EA]':'bg-[rgba(201,131,46,.1)]'}`}>
                  {TYPE_ICON[n.type]||'🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#2F2622] mb-1">{n.title}</div>
                  <div className="text-xs text-[#7A7368] leading-relaxed mb-2">{n.message}</div>
                  {n.vetSlug && (
                    <Link href={`/veterinerler/${n.vetSlug}`} onClick={e=>e.stopPropagation()}
                      className="text-xs text-[#C9832E] hover:underline">
                      Veteriner profiline git →
                    </Link>
                  )}
                  <div className="text-[11px] text-[#9A9188] mt-1">{timeAgo(n.createdAt)}</div>
                </div>
                {!n.isRead&&<div className="w-2 h-2 rounded-full bg-[#C9832E] flex-shrink-0 mt-2"/>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
