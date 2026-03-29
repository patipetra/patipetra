'use client';
import { VetCardSkeleton } from '@/components/Skeleton';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CITIES_81 } from '@/data/cities';

const SPECS = ['Tümü','Dahiliye','Cerrahi','Dermatoloji','Ortopedi','Onkoloji','Diş','Beslenme','Radyoloji','Göz','Nöroloji','Kardiyoloji','Genel Pratik'];

export default function VeterinerlerPage() {
  const [vets,       setVets]       = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [specFilter, setSpecFilter] = useState('Tümü');
  const [onlineOnly, setOnlineOnly] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(
          collection(db,'vets'),
          where('status','==','active'),
          orderBy('rating','desc')
        ));
        setVets(snap.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    }
    load();
  },[]);

  const filtered = vets.filter(v => {
    if (search && !v.name?.toLowerCase().includes(search.toLowerCase()) &&
        !v.clinic?.toLowerCase().includes(search.toLowerCase())) return false;
    if (cityFilter && v.city !== cityFilter) return false;
    if (specFilter !== 'Tümü' && !(v.spec||[]).includes(specFilter)) return false;
    if (onlineOnly && !v.online) return false;
    return true;
  });

  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Veteriner Güveni</div>
            <h1 className="font-serif text-[clamp(32px,6vw,56px)] font-light text-[#2F2622] mb-3">
              Doğrulanmış veterinerler,<br/><em className="italic text-[#C9832E]">güvenilir</em> iletişim
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-8 font-light">
              Uzmanlık alanı, yanıt süresi ve çevrimiçi durumu ile Türkiye'nin en iyi veterinerleri.
            </p>
            <div className="flex flex-wrap gap-3">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Veteriner veya klinik ara…"
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] transition-all min-w-[200px]"/>
              <select value={cityFilter} onChange={e=>setCityFilter(e.target.value)}
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer">
                <option value="">Tüm Şehirler</option>
                {CITIES_81.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <select value={specFilter} onChange={e=>setSpecFilter(e.target.value)}
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer">
                {SPECS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={()=>setOnlineOnly(v=>!v)}
                className={`px-4 py-3 rounded-[12px] border-[1.5px] text-sm font-medium transition-all ${onlineOnly?'border-[#6B7C5C] bg-[rgba(107,124,92,.15)] text-[#6B7C5C]':'border-[rgba(107,124,92,.3)] bg-[rgba(107,124,92,.06)] text-[#6B7C5C] hover:bg-[rgba(107,124,92,.1)]'}`}>
                🟢 {onlineOnly?'Çevrimiçi':'Şu An Çevrimiçi'}
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#7A7368]">{filtered.length} veteriner bulundu</p>
            <Link href="/veterinerler/basvur" className="text-sm text-[#C9832E] hover:underline font-medium">Veteriner misiniz? Başvurun →</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Veteriner bulunamadı</h3>
              <p className="text-sm text-[#7A7368] mb-5">Farklı filtreler deneyin veya tüm şehirlere bakın.</p>
              <Link href="/veterinerler/basvur" className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
                Veteriner Başvurusu Yap →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(v=>(
                <Link key={v.id} href={`/veterinerler/${v.slug}`}
                  className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(201,131,46,.25)] transition-all block">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-2xl flex-shrink-0 relative overflow-hidden">
                      {v.avatar
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={v.avatar} alt={v.name} className="w-full h-full object-cover"/>
                        : '🩺'
                      }
                      {v.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-[2px]">
                        <span className="font-serif text-base font-semibold text-[#2F2622]">{v.name}</span>
                        {v.verified && <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-[1px] rounded-full font-semibold">✓ Doğrulandı</span>}
                      </div>
                      <div className="text-xs text-[#7A7368] mb-1">{v.clinic}</div>
                      <div className="text-xs text-[#9A9188]">📍 {v.city}{v.district?`, ${v.district}`:''}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(v.spec||[]).slice(0,3).map((s: string)=>(
                      <span key={s} className="text-[10px] bg-[#F7F2EA] text-[#6E5A40] border border-[#E3D9C6] px-2 py-[2px] rounded-full">{s}</span>
                    ))}
                    {(v.spec||[]).length > 3 && <span className="text-[10px] text-[#9A9188]">+{(v.spec||[]).length-3}</span>}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#F7F2EA]">
                    <div className="flex items-center gap-3 text-xs text-[#7A7368]">
                      {v.rating > 0 && <span>⭐ {v.rating} <span className="text-[#9A9188]">({v.reviewCount||0})</span></span>}
                    </div>
                    <div className={`text-[10px] font-semibold px-2 py-1 rounded-full ${v.online?'bg-green-50 text-green-600':'bg-[#F7F2EA] text-[#9A9188]'}`}>
                      {v.online?'🟢 Çevrimiçi':'⚫ Çevrimdışı'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Başvuru CTA */}
          <div className="mt-12 bg-[#2F2622] rounded-[24px] p-8 text-center">
            <div className="text-4xl mb-3">🩺</div>
            <h2 className="font-serif text-2xl font-light text-white mb-2">Veteriner misiniz?</h2>
            <p className="text-sm text-white/50 mb-5 max-w-md mx-auto leading-relaxed">
              Binlerce pet sahibine ulaşın. Patıpetra'da doğrulanmış veteriner profilinizi oluşturun.
            </p>
            <Link href="/veterinerler/basvur"
              className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523] transition-all">
              Başvuru Yapın →
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
