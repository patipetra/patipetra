'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/layout/Navbar';

const DEFAULT_PLANS = [
  { id:'free',    name:'Ücretsiz',   price:'₺0',      period:'/ ay',   type:'user',
    feats:['3 Pet Profili','3 Aktif İlan','Topluluk erişimi','Temel veteriner iletişimi'],
    featured:false, cta:'Mevcut Plan', current:true },
  { id:'premium', name:'Premium',    price:'₺199',    period:'/ ay',   type:'user',
    feats:['Sınırsız Pet Profili','10 Aktif İlan','Tüm özel rehberler','İlan öne çıkarma','Ürünlerde %10 indirim'],
    featured:true,  cta:"Premium'a Geç ✦", current:false },
  { id:'pro',     name:'Pro Yıllık', price:'₺1.490',  period:'/ yıl',  type:'user',
    feats:["Premium'un tümü","Sınırsız ilan","Öncelikli destek","%20 indirim","Veteriner önceliği"],
    featured:false, cta:"Pro'ya Geç →", current:false },
];

export default function PremiumPage() {
  const router = useRouter();
  const [user,    setUser]    = useState<any>(null);
  const [plans,   setPlans]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(u => { setUser(u); });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadPlans() {
      try {
        const snap = await getDocs(query(
          collection(db,'plans'),
          where('active','==',true),
          where('type','==','user'),
          orderBy('price','asc')
        ));
        if (snap.empty) {
          setPlans(DEFAULT_PLANS);
        } else {
          setPlans(snap.docs.map(d=>({id:d.id,...d.data()})));
        }
      } catch {
        setPlans(DEFAULT_PLANS);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20 lg:ml-[260px]">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[rgba(201,131,46,.1)] border border-[rgba(201,131,46,.2)] rounded-full px-4 py-2 mb-4">
              <span className="text-[#C9832E] text-sm font-semibold">✦ Premium Üyelik</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2F2622] mb-3">
              Petiniz için en iyisini seçin
            </h1>
            <p className="text-[#7A7368] max-w-md mx-auto leading-relaxed">
              Premium üyelikle sınırsız özellik, öncelikli destek ve özel içeriklere erişin.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {plans.map(plan=>(
                <div key={plan.id}
                  className={`bg-white rounded-[24px] p-6 border-2 transition-all relative ${plan.featured?'border-[#C9832E] shadow-xl':'border-[rgba(196,169,107,.15)]'}`}>
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#C9832E] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        ✦ Önerilen
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="font-semibold text-[#2F2622] mb-1">{plan.name}</div>
                    <div className={`font-serif text-3xl font-semibold ${plan.featured?'text-[#C9832E]':'text-[#2F2622]'}`}>
                      {plan.price || `₺${plan.price}`}
                      <span className="text-sm font-normal text-[#9A9188] ml-1">{plan.period||plan.yearlyPrice?`₺${plan.yearlyPrice}/yıl`:''}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {(plan.feats||plan.features||[]).map((f:string,i:number)=>(
                      <div key={i} className="flex items-start gap-2 text-sm text-[#5C4A32]">
                        <span className="text-[#C9832E] flex-shrink-0">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  {plan.current ? (
                    <div className="w-full py-3 rounded-full bg-[#F7F2EA] text-[#9A9188] text-sm font-medium text-center">
                      Mevcut Planınız
                    </div>
                  ) : (
                    <Link href="https://www.shopier.com/patipetra" target="_blank" rel="noopener noreferrer"
                      className={`w-full py-3 rounded-full text-sm font-semibold text-center block transition-all ${plan.featured?'bg-[#C9832E] text-white hover:bg-[#b87523]':'border-2 border-[#5C4A32] text-[#5C4A32] hover:bg-[#5C4A32] hover:text-white'}`}>
                      {plan.cta||`${plan.name}'a Geç →`}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* İşletme planları */}
          <div className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] p-6 mb-6">
            <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-4">🏪 İşletme Planları</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {icon:'✂️', label:'Pet Kuaför',  href:'/hizmetler/basvur'},
                {icon:'🏨', label:'Pet Otel',    href:'/hizmetler/basvur'},
                {icon:'🎓', label:'Pet Eğitmen', href:'/hizmetler/basvur'},
                {icon:'🩺', label:'Veteriner',   href:'/veterinerler/basvur'},
                {icon:'🛒', label:'Pet Shop',    href:'/hizmetler/basvur'},
                {icon:'🐾', label:'Pet Bakıcı',  href:'/hizmetler/basvur'},
              ].map(p=>(
                <Link key={p.label} href={p.href}
                  className="flex items-center gap-3 p-3 bg-[#F7F2EA] rounded-[12px] hover:bg-[#EDE5D3] transition-colors">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-[#2F2622]">{p.label}</div>
                    <div className="text-xs text-[#C9832E]">Başvuru Yap →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* SSS */}
          <div className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] p-6">
            <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-4">Sık Sorulan Sorular</h2>
            <div className="space-y-4">
              {[
                {q:'Ödeme nasıl yapılıyor?', a:'Shopier altyapısı üzerinden güvenli ödeme yapabilirsiniz. Kredi kartı, banka kartı ve havale kabul edilmektedir.'},
                {q:'Premium\'u iptal edebilir miyim?', a:'Evet, istediğiniz zaman iptal edebilirsiniz. İptal sonrası dönem sonuna kadar premium özellikler aktif kalır.'},
                {q:'Planı değiştirebilir miyim?', a:'Evet, istediğiniz zaman plan değiştirebilirsiniz. Fark tutarı bir sonraki faturalandırma döneminde yansıtılır.'},
              ].map(f=>(
                <div key={f.q} className="border-b border-[#F7F2EA] last:border-0 pb-4 last:pb-0">
                  <div className="font-semibold text-sm text-[#2F2622] mb-1">{f.q}</div>
                  <div className="text-sm text-[#7A7368] leading-relaxed">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
