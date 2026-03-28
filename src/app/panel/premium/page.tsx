'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { onAuthChange } from '@/lib/auth';
import {
  doc, getDoc, setDoc, collection,
  addDoc, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const PLANS = [
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 249,
    period: 'aylık',
    months: 1,
    color: '#C9832E',
    badge: '★ Önerilen',
    feats: [
      '5 aktif ilan / ay',
      '5 pet pasaport',
      'Telefon & konum görüntüleme',
      'Tüm ilanları görme',
      'AI veteriner asistanı',
      'Mesajlaşma sistemi',
      'Öncelikli destek',
    ],
  },
  {
    id: 'premium_yearly',
    name: 'Pro Yıllık',
    price: 2_490,
    period: 'yıllık',
    months: 12,
    color: '#1D9E75',
    badge: '%17 İndirim',
    feats: [
      "Premium'un tümü",
      '20 aktif ilan / ay (günde maks 5)',
      '20 pet pasaport',
      'Topluluk kurabilir',
      'Blog yazabilir',
      'Öncelikli arama sıralaması',
      'Özel rozet',
    ],
  },
  {
    id: 'corporate_monthly',
    name: 'Kurumsal Aylık',
    price: 599,
    period: 'aylık',
    months: 1,
    color: '#534AB7',
    badge: 'Veteriner & İşletme',
    feats: [
      'Profil sayfası aktif',
      'Doğrudan iletişim',
      'Randevu sistemi',
      'Soru-cevap modülü',
      'Arama önceliği',
      '"Onaylı İşletme" rozeti',
    ],
  },
  {
    id: 'corporate_yearly',
    name: 'Kurumsal Yıllık',
    price: 6_110,
    period: 'yıllık',
    months: 12,
    color: '#3C3489',
    badge: '%15 İndirim',
    feats: [
      "Kurumsal aylığın tümü",
      'Aylık performans raporu',
      'Öncelikli listeleme',
      'Toplu ödeme avantajı',
      '7/24 öncelikli destek',
      'Özel hesap yöneticisi',
    ],
  },
];

function generateCode(uid: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand  = Array.from({length:6}, ()=>chars[Math.floor(Math.random()*chars.length)]).join('');
  return `PTR-${rand}`;
}

export default function PremiumPage() {
  const router = useRouter();
  const [user,        setUser]        = useState<User|null>(null);
  const [userPlan,    setUserPlan]    = useState<any>(null);
  const [selPlan,     setSelPlan]     = useState<typeof PLANS[0]|null>(null);
  const [myCode,      setMyCode]      = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [step,        setStep]        = useState<'plans'|'code'|'active'>('plans');

  useEffect(() => {
    const unsub = onAuthChange(async u => {
      if (!u) { router.push('/giris'); return; }
      setUser(u);
      // Kullanıcı planını çek
      const snap = await getDoc(doc(db,'users',u.uid));
      if (snap.exists()) setUserPlan(snap.data());
    });
    return () => unsub();
  }, [router]);

  async function getOrCreateCode(plan: typeof PLANS[0]) {
    if (!user) return;
    setSelPlan(plan);
    setCodeLoading(true);
    try {
      // Var olan kod var mı?
      const snap = await getDoc(doc(db,'premiumCodes',user.uid));
      if (snap.exists() && snap.data().status === 'pending') {
        setMyCode(snap.data().code);
      } else {
        // Yeni kod oluştur
        const code = generateCode(user.uid);
        await setDoc(doc(db,'premiumCodes',user.uid), {
          code,
          userId:    user.uid,
          userEmail: user.email,
          planId:    plan.id,
          planName:  plan.name,
          price:     plan.price,
          months:    plan.months,
          status:    'pending',
          createdAt: serverTimestamp(),
        });
        setMyCode(code);
      }
      setStep('code');
    } catch(e) { console.error(e); }
    finally { setCodeLoading(false); }
  }

  function copyCode() {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  const isPremium = userPlan?.plan && userPlan.plan !== 'free';
  const planExpiry = userPlan?.planExpiry?.toDate?.();
  const daysLeft = planExpiry ? Math.ceil((planExpiry.getTime()-Date.now())/(1000*60*60*24)) : 0;

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20 lg:ml-[260px]">
        <div className="max-w-[900px] mx-auto px-4 py-8">

          {/* Mevcut plan durumu */}
          {isPremium && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 mb-6 flex items-center gap-4">
              <div className="text-3xl">✨</div>
              <div className="flex-1">
                <div className="font-semibold text-[#2F2622]">Mevcut Planınız: {userPlan.planName || userPlan.plan}</div>
                {planExpiry && <div className="text-sm text-[#7A7368] mt-1">{daysLeft > 0 ? `${daysLeft} gün kaldı · ${planExpiry.toLocaleDateString('tr-TR')} tarihinde sona erer` : 'Planınız sona erdi'}</div>}
              </div>
              {daysLeft > 0 && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">Aktif ✓</span>}
            </div>
          )}

          {step === 'plans' && (
            <>
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl font-semibold text-[#2F2622] mb-2">Premium Üyelik</h1>
                <p className="text-[#7A7368]">Petiniz için en iyisini seçin. Fiyatlar KDV dahildir.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                {PLANS.map(plan=>(
                  <div key={plan.id}
                    className="bg-white rounded-[24px] border-2 p-6 hover:shadow-lg transition-all cursor-pointer"
                    style={{borderColor: plan.color+'33'}}
                    onClick={()=>getOrCreateCode(plan)}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{background:plan.color+'18', color:plan.color}}>
                        {plan.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-serif text-3xl font-semibold" style={{color:plan.color}}>
                        ₺{plan.price.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-sm text-[#9A9188]">/ {plan.period}</span>
                    </div>
                    <div className="space-y-2 mb-5">
                      {plan.feats.map(f=>(
                        <div key={f} className="flex items-start gap-2 text-sm text-[#5C4A32]">
                          <span style={{color:plan.color}} className="flex-shrink-0 mt-[2px]">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      disabled={codeLoading}
                      className="w-full py-3 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                      style={{background:plan.color}}>
                      {codeLoading && selPlan?.id===plan.id ? 'Hazırlanıyor…' : 'Satın Al →'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Ücretsiz plan */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 text-center">
                <h3 className="font-semibold text-[#2F2622] mb-2">Ücretsiz Plan ile Devam Et</h3>
                <p className="text-sm text-[#7A7368] mb-3">1 ilan, 1 pet pasaport, temel özellikler</p>
                <Link href="/panel" className="text-sm text-[#C9832E] hover:underline">Dashboard'a Dön →</Link>
              </div>
            </>
          )}

          {step === 'code' && selPlan && (
            <div className="max-w-[520px] mx-auto">
              <button onClick={()=>setStep('plans')} className="text-sm text-[#7A7368] mb-6 flex items-center gap-1 hover:text-[#2F2622]">
                ← Planlara Dön
              </button>

              <div className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎉</div>
                  <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-1">{selPlan.name} Planı</h2>
                  <div className="font-serif text-2xl font-semibold" style={{color:selPlan.color}}>
                    ₺{selPlan.price.toLocaleString('tr-TR')} / {selPlan.period}
                  </div>
                </div>

                {/* Benzersiz kod */}
                <div className="bg-[#F7F2EA] rounded-[16px] p-4 mb-5 text-center">
                  <div className="text-xs text-[#9A9188] mb-2 uppercase tracking-[.1em]">Ödeme Kodunuz</div>
                  <div className="font-mono text-3xl font-bold text-[#2F2622] tracking-[.15em] mb-3">{myCode}</div>
                  <button onClick={copyCode}
                    className="text-xs px-4 py-2 rounded-full border border-[#8B7355] text-[#5C4A32] hover:bg-[#5C4A32] hover:text-white transition-all">
                    {copied ? '✓ Kopyalandı!' : '📋 Kodu Kopyala'}
                  </button>
                </div>

                {/* Adımlar */}
                <div className="space-y-3 mb-5">
                  {[
                    {n:1, title:'Kodu kopyalayın', desc:'Yukarıdaki kodu panoya kopyalayın'},
                    {n:2, title:'Shopier\'e gidin', desc:`Aşağıdaki butona tıklayıp ödemeyi tamamlayın (₺${selPlan.price.toLocaleString('tr-TR')})`},
                    {n:3, title:'Sipariş notuna kodu yazın', desc:'Shopier ödeme sayfasındaki "Sipariş notu" veya "Açıklama" alanına kodunuzu yazın'},
                    {n:4, title:'Bekleyin', desc:'Para hesabımıza geçtikten sonra (genellikle birkaç dakika) premium üyeliğiniz aktif edilir'},
                    {n:5, title:'Mail gelecek', desc:'Aktivasyon onay maili adresinize gönderilecektir'},
                  ].map(s=>(
                    <div key={s.n} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-[1px]"
                        style={{background:selPlan.color}}>
                        {s.n}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#2F2622]">{s.title}</div>
                        <div className="text-xs text-[#7A7368] leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                
                  href="https://shopier.com/patipetra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-full text-white text-base font-semibold text-center block hover:opacity-90 transition-all mb-3"
                  style={{background:selPlan.color}}>
                  Shopier'de Ödeme Yap →
                </a>

                <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[12px] p-3 text-xs text-[#8B7355] text-center">
                  ⚠️ Ödeme sırasında sipariş notuna <strong>{myCode}</strong> kodunu yazmayı unutmayın!
                </div>
              </div>

              {/* Bekleme mesajı */}
              <div className="mt-4 bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-4 text-center">
                <div className="text-sm text-[#7A7368] mb-2">Ödemeyi tamamladıysanız kontrol edin:</div>
                <button onClick={async()=>{
                  const snap = await getDoc(doc(db,'users',user!.uid));
                  const d = snap.data();
                  if(d?.plan && d.plan!=='free') {
                    setUserPlan(d);
                    setStep('active');
                  } else {
                    alert('Premium henüz aktif değil. Ödemeniz işleme alındıktan sonra aktif edilecektir.');
                  }
                }} className="text-sm text-[#C9832E] hover:underline font-medium">
                  Premium aktif mi? Kontrol Et
                </button>
              </div>
            </div>
          )}

          {step === 'active' && (
            <div className="max-w-[520px] mx-auto text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-serif text-3xl font-semibold text-[#2F2622] mb-2">Premium Aktif!</h2>
              <p className="text-[#7A7368] mb-6">Tüm premium özelliklerine erişebilirsiniz.</p>
              <Link href="/panel" className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523]">
                Dashboard'a Git →
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
