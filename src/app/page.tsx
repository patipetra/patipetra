'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SPECIES_EMOJI: Record<string,string> = {
  cat:'🐱', dog:'🐶', bird:'🐦', rabbit:'🐰',
  hamster:'🐹', turtle:'🐢', fish:'🐟', other:'🐾',
};
const TYPE_LABEL: Record<string,string> = {
  adoption:'Sahiplendirme', temp:'Geçici Yuva', lost:'Kayıp', found:'Bulundu'
};
const SERVICE_ICON: Record<string,string> = {
  groomer:'✂️', hotel:'🏨', trainer:'🎓', vet:'🩺'
};

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [vets,     setVets]     = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [lSnap, vSnap, sSnap] = await Promise.all([
          getDocs(query(collection(db,'listings'), where('status','==','active'), orderBy('createdAt','desc'), limit(6))),
          getDocs(collection(db,'vets')),
          getDocs(query(collection(db,'services'), where('status','==','active'), limit(3))),
        ]);
        setListings(lSnap.docs.map(d=>({id:d.id,...d.data()})));
        setVets(vSnap.docs.map(d=>({id:d.id,...d.data()})).filter((v:any)=>v.status==='active').slice(0,3));
        setServices(sSnap.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <>
      <Navbar/>
      <main>
        {/* Hero */}
        <section className="relative min-h-[92vh] flex items-center bg-[#2F2622] overflow-hidden pt-[68px]">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80"
              alt="" className="w-full h-full object-cover opacity-20"/>
          </div>
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[rgba(201,131,46,.15)] blur-[120px] -top-40 -right-40 pointer-events-none"/>
          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-20">
            <div className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 bg-[rgba(201,131,46,.15)] border border-[rgba(201,131,46,.3)] rounded-full px-4 py-2 mb-6">
                <span className="text-[#E8B86D] text-xs font-semibold tracking-[.14em] uppercase">Türkiye'nin Pet Platformu</span>
              </div>
              <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-light text-white leading-[1.05] mb-6">
                Petiniz için<br/><em className="italic text-[#E8B86D]">her şey</em> burada
              </h1>
              <p className="text-[clamp(15px,1.8vw,18px)] text-white/60 leading-[1.85] mb-8 max-w-[480px] font-light">
                Pet pasaport, veteriner iletişimi, sahiplendirme ilanı ve premium hizmetler — tek platformda.
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                <Link href="/kayit" className="inline-flex items-center bg-[#C9832E] text-white text-[15px] font-semibold px-7 py-3 rounded-full hover:bg-[#b87523] transition-all hover:-translate-y-[1px]">
                  Ücretsiz Başla →
                </Link>
                <Link href={`/ilanlar/${l.id}`} className="inline-flex items-center border border-white/20 text-white text-[15px] font-medium px-7 py-3 rounded-full hover:bg-white/10 transition-all">
                  İlanları Gör
                </Link>
              </div>
              <div className="flex flex-wrap gap-6">
                {[{n:'10K+',l:'Pet Sahibi'},{n:'500+',l:'Veteriner'},{n:'81',l:'İl'},{n:'%100',l:'Güvenli'}].map(s=>(
                  <div key={s.l}>
                    <div className="font-serif text-2xl font-semibold text-[#E8B86D]">{s.n}</div>
                    <div className="text-xs text-white/40 mt-[2px]">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Özellikler */}
        <section className="bg-[#F7F2EA] py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {icon:'🐾', title:'Pet Pasaport',  desc:'Aşı ve sağlık geçmişi',    href:'/panel/petlerim'},
                {icon:'🩺', title:'Veterinerler',  desc:'Doğrulanmış uzmanlar',      href:'/veterinerler'  },
                {icon:'📢', title:'Sahiplendirme', desc:'81 ilde güvenli ilan',      href:'/ilanlar'       },
                {icon:'💬', title:'Topluluklar',   desc:'Irk bazlı pet topluluğu',   href:'/topluluk'      },
              ].map(f=>(
                <Link key={f.title} href={f.href}
                  className="bg-white rounded-[20px] p-6 border border-[rgba(196,169,107,.12)] hover:shadow-lg hover:-translate-y-1 transition-all block">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="font-serif text-lg font-semibold text-[#2F2622] mb-1">{f.title}</div>
                  <div className="text-sm text-[#7A7368]">{f.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* İlanlar */}
        <section className="py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-2">Sahiplendirme</div>
                <h2 className="font-serif text-[clamp(24px,4vw,36px)] font-light text-[#2F2622]">Yuva bekleyen <em className="italic text-[#C9832E]">dostlar</em></h2>
              </div>
              <Link href={`/ilanlar/${l.id}`} className="hidden sm:inline-flex border border-[#8B7355] text-[#5C4A32] text-sm font-medium px-5 py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">Tüm İlanlar →</Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-[#F7F2EA] rounded-[20px]">
                <div className="text-4xl mb-3">🐾</div>
                <p className="text-[#7A7368] mb-4">Henüz aktif ilan yok.</p>
                <Link href="/panel/ilanlarim" className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#b87523]">İlk İlanı Ver →</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((l:any)=>(
                  <Link key={l.id} href={`/ilanlar/${l.id}`}
                    className="bg-[#F7F2EA] rounded-[20px] overflow-hidden border border-[rgba(196,169,107,.12)] hover:shadow-lg hover:-translate-y-1 transition-all block">
                    <div className="h-[180px] bg-[#EDE5D3] flex items-center justify-center text-5xl overflow-hidden">
                      {l.imageUrls?.[0]
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={l.imageUrls[0]} alt={l.name} className="w-full h-full object-cover"/>
                        : SPECIES_EMOJI[l.species]||'🐾'
                      }
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-lg font-semibold text-[#2F2622]">{l.name}</span>
                        <span className="text-[10px] bg-[rgba(201,131,46,.1)] text-[#C9832E] px-2 py-[2px] rounded-full font-semibold">{TYPE_LABEL[l.type]||l.type}</span>
                      </div>
                      <div className="text-xs text-[#7A7368] mb-2">{l.breed&&`${l.breed} · `}{l.age&&`${l.age} · `}📍 {l.city}</div>
                      <div className="flex flex-wrap gap-1">
                        {l.isVaccinated&&<span className="text-[10px] bg-white text-[#6E5A40] px-2 py-[2px] rounded-full">Aşılı</span>}
                        {l.isSterilized&&<span className="text-[10px] bg-white text-[#6E5A40] px-2 py-[2px] rounded-full">Kısır</span>}
                        {l.isUrgent&&<span className="text-[10px] bg-red-50 text-red-500 px-2 py-[2px] rounded-full">Acil</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Veterinerler */}
        {!loading && vets.length > 0 && (
          <section className="py-16 bg-[#F7F2EA]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-2">Uzman Kadro</div>
                  <h2 className="font-serif text-[clamp(24px,4vw,36px)] font-light text-[#2F2622]">Doğrulanmış <em className="italic text-[#C9832E]">veterinerler</em></h2>
                </div>
                <Link href="/veterinerler" className="hidden sm:inline-flex border border-[#8B7355] text-[#5C4A32] text-sm font-medium px-5 py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">Tüm Veterinerler →</Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                {vets.map((v:any)=>(
                  <Link key={v.id} href={`/veterinerler/${v.slug}`}
                    className="bg-white rounded-[20px] p-5 border border-[rgba(196,169,107,.12)] hover:shadow-lg hover:-translate-y-1 transition-all block">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden relative">
                        {v.avatar
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={v.avatar} alt={v.name} className="w-full h-full object-cover"/>
                          : '🩺'
                        }
                        {v.online&&<div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"/>}
                      </div>
                      <div>
                        <div className="font-serif text-base font-semibold text-[#2F2622]">{v.name}</div>
                        <div className="text-xs text-[#7A7368]">{v.clinic}</div>
                        <div className="text-xs text-[#9A9188]">📍 {v.city}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(v.spec||[]).slice(0,2).map((s:string)=>(
                        <span key={s} className="text-[10px] bg-[#F7F2EA] text-[#6E5A40] px-2 py-[2px] rounded-full">{s}</span>
                      ))}
                    </div>
                    {v.rating>0&&<div className="text-xs text-[#7A7368]">⭐ {v.rating} ({v.reviewCount||0} yorum)</div>}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Hizmetler */}
        {!loading && services.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-2">Onaylı İşletmeler</div>
                  <h2 className="font-serif text-[clamp(24px,4vw,36px)] font-light text-[#2F2622]">Profesyonel <em className="italic text-[#C9832E]">pet hizmetleri</em></h2>
                </div>
                <Link href="/hizmetler" className="hidden sm:inline-flex border border-[#8B7355] text-[#5C4A32] text-sm font-medium px-5 py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">Tüm Hizmetler →</Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                {services.map((s:any)=>(
                  <Link key={s.id} href={`/hizmetler/${s.slug||s.id}`}
                    className="bg-[#F7F2EA] rounded-[20px] overflow-hidden border border-[rgba(196,169,107,.12)] hover:shadow-lg hover:-translate-y-1 transition-all block">
                    <div className="h-[140px] overflow-hidden bg-[#EDE5D3] flex items-center justify-center text-4xl">
                      {s.coverUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={s.coverUrl} alt={s.businessName} className="w-full h-full object-cover"/>
                        : SERVICE_ICON[s.type]||'🏪'
                      }
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-semibold text-[#C9832E] mb-1">{SERVICE_ICON[s.type]} {s.type==='groomer'?'Pet Kuaför':s.type==='hotel'?'Pet Otel':s.type==='trainer'?'Pet Eğitmen':'Hizmet'}</div>
                      <div className="font-serif text-base font-semibold text-[#2F2622] mb-1">{s.businessName}</div>
                      <div className="text-xs text-[#7A7368]">📍 {s.city}{s.district?`, ${s.district}`:''}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-[#2F2622]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
            <div className="text-5xl mb-6">🐾</div>
            <h2 className="font-serif text-[clamp(28px,5vw,52px)] font-light text-white mb-4">Petiniz için en iyisini <em className="italic text-[#E8B86D]">hak ediyor</em></h2>
            <p className="text-white/50 text-[clamp(14px,1.8vw,16px)] mb-8 max-w-[480px] mx-auto leading-relaxed">Ücretsiz kayıt ol, pet profilini oluştur ve Türkiye'nin en büyük pet platformuna katıl.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/kayit" className="inline-flex bg-[#C9832E] text-white text-[15px] font-semibold px-8 py-3 rounded-full hover:bg-[#b87523] transition-all">Hemen Başla →</Link>
              <Link href={`/ilanlar/${l.id}`} className="inline-flex border border-white/20 text-white text-[15px] font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-all">İlanları İncele</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
