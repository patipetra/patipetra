'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';

const MOCK_NOTIFS = [
  { id:1, type:'listing',  icon:'📢', title:'İlanınız incelemeye alındı',     desc:'Pamuk ilanınız admin tarafından inceleniyor.',     time:'2 sa önce',  read:false },
  { id:2, type:'system',   icon:'🎉', title:'Patıpetra\'ya hoş geldiniz!',    desc:'Platformu keşfetmeye başlayın.',                   time:'1 gün önce', read:false },
  { id:3, type:'premium',  icon:'✦',  title:'Premium\'u keşfedin',            desc:'Sınırsız pet profili ve daha fazlası için.',        time:'2 gün önce', read:true  },
];

export default function BildirimlerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      if (!u) { router.push('/giris'); return; }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>;

  const unread = notifs.filter(n=>!n.read).length;

  return (
    <div className="min-h-screen bg-[#F7F2EA]">
      <div className="lg:ml-[260px] p-6 max-w-[700px]">
        <Link href="/panel" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Dashboard</Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl font-semibold text-[#2F2622]">🔔 Bildirimler {unread>0&&<span className="text-sm font-normal text-[#C9832E] ml-2">({unread} yeni)</span>}</h1>
          {unread>0&&<button onClick={()=>setNotifs(prev=>prev.map(n=>({...n,read:true})))} className="text-sm text-[#C9832E] hover:underline">Tümünü okundu işaretle</button>}
        </div>
        <div className="flex flex-col gap-3">
          {notifs.map(n=>(
            <div key={n.id} className={`bg-white rounded-[16px] border p-4 flex items-start gap-4 transition-all ${n.read?'border-[rgba(196,169,107,.1)] opacity-70':'border-[rgba(201,131,46,.2)] shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${n.read?'bg-[#F7F2EA]':'bg-[rgba(201,131,46,.1)]'}`}>{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[#2F2622] mb-1">{n.title}</div>
                <div className="text-xs text-[#7A7368] leading-relaxed">{n.desc}</div>
                <div className="text-[11px] text-[#9A9188] mt-2">{n.time}</div>
              </div>
              {!n.read&&<div className="w-2 h-2 rounded-full bg-[#C9832E] flex-shrink-0 mt-2"/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
