'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';

const PLANS = [
  { name:'Ücretsiz',      price:'₺0',   period:'/ ay',  feats:['1 Pet Profili','2 Aktif İlan','Temel rehberler'],                                                       featured:false, current:true,  cta:'Mevcut Plan'    },
  { name:'Premium',       price:'₺199', period:'/ ay',  feats:['Sınırsız Pet Profili','10 Aktif İlan','Tüm özel rehberler','İlan öne çıkarma','Ürünlerde %10 indirim'],  featured:true,  current:false, cta:"Premium'a Geç ✦"},
  { name:'Pro Yıllık',    price:'₺1.490',period:'/ yıl',feats:["Premium'un tümü","Sınırsız ilan","Öncelikli destek","%20 indirim","Veteriner önceliği"],                  featured:false, current:false, cta:"Pro'ya Geç →"   },
];

export default function PremiumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      if (!u) { router.push('/giris'); return; }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#F7F2EA]">
      <div className="lg:ml-[260px] p-6">
        <Link href="/panel" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Dashboard</Link>
        <div className="text-center mb-8">
          <div className="text-xs font-semibold tracking-[.14em] uppercase text-[#C9832E] mb-2">Patıpetra Premium</div>
          <h1 className="font-serif text-3xl font-light text-[#2F2622]">Dostunuz için en iyisini seçin</h1>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 max-w-[900px] mx-auto">
          {PLANS.map(p=>(
            <div key={p.name} className={`rounded-[24px] p-6 relative border hover:-translate-y-1 transition-all ${p.featured?'bg-[#5C4A32] border-transparent shadow-xl':'bg-white border-[rgba(196,169,107,.12)] hover:shadow-lg'}`}>
              {p.featured&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9832E] text-[#2F2622] text-[10px] font-bold tracking-[.1em] uppercase px-3 py-1 rounded-full whitespace-nowrap">En Popüler</div>}
              {p.current&&<div className="absolute -top-3 right-4 bg-[#6B7C5C] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">Mevcut Plan</div>}
              <div className={`text-[10px] font-semibold tracking-[.2em] uppercase mb-2 ${p.featured?'text-white/40':'text-[#9A9188]'}`}>Üyelik Planı</div>
              <div className={`font-serif text-2xl font-semibold mb-1 ${p.featured?'text-white':'text-[#2F2622]'}`}>{p.name}</div>
              <div className={`font-serif text-3xl font-semibold mb-1 ${p.featured?'text-[#F5E2C7]':'text-[#C9832E]'}`}>{p.price}</div>
              <div className={`text-xs mb-5 ${p.featured?'text-white/40':'text-[#9A9188]'}`}>{p.period}</div>
              <div className="flex flex-col gap-2 mb-5">
                {p.feats.map(f=><div key={f} className={`text-sm rounded-[12px] px-3 py-[10px] ${p.featured?'bg-white/10 text-white':'bg-[#F7F2EA] text-[#5C4A32]'}`}>✓ {f}</div>)}
              </div>
              <button disabled={p.current} className={`w-full py-[11px] rounded-full text-sm font-semibold transition-all ${p.current?'bg-[#EDE5D3] text-[#9A9188] cursor-not-allowed':p.featured?'bg-[#C9832E] text-white hover:bg-[#b87523]':'bg-[#5C4A32] text-white hover:bg-[#2F2622]'}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
