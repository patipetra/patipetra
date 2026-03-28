'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CITIES_81 } from '@/data/cities';

const TYPE_CONFIG: Record<string,{icon:string,label:string}> = {
  groomer: {icon:'✂️', label:'Pet Kuaför'},
  hotel:   {icon:'🏨', label:'Pet Otel'},
  trainer: {icon:'🎓', label:'Pet Eğitmen'},
  vet:     {icon:'🩺', label:'Veteriner'},
  petshop: {icon:'🛒', label:'Pet Shop'},
  sitter:  {icon:'🐾', label:'Pet Bakıcı'},
};

export default function HizmetlerPage() {
  const [services,   setServices]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db,'services'), where('status','==','active')));
        setServices(snap.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = services.filter(s => {
    if (typeFilter && s.type !== typeFilter) return false;
    if (cityFilter && s.city !== cityFilter) return false;
    if (search && !s.businessName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Onaylı İşletmeler</div>
            <h1 className="font-serif text-[clamp(30px,5vw,52px)] font-light text-[#2F2622] mb-3">
              Profesyonel <em className="italic text-[#C9832E]">pet hizmetleri</em>
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] text-[#7A7368] mb-6 font-light max-w-[500px] leading-relaxed">
              Doğrulanmış pet kuaförleri, oteller, eğitmenler ve daha fazlası.
            </p>
            <div className="flex flex-wrap gap-3">
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="İşletme ara…"
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] min-w-[180px]"/>
              <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer">
                <option value="">Tüm Hizmetler</option>
                {Object.entries(TYPE_CONFIG).map(([v,c])=>(
                  <option key={v} value={v}>{c.icon} {c.label}</option>
                ))}
              </select>
              <select value={cityFilter} onChange={e=>setCityFilter(e.target.value)}
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer">
                <option value="">Tüm Şehirler</option>
                {CITIES_81.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          {/* Kategori filtreleri */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{scrollbarWidth:'none'}}>
            <button onClick={()=>setTypeFilter('')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all ${typeFilter===''?'bg-[#5C4A32] text-white border-[#5C4A32]':'bg-white text-[#5C4A32] border-[rgba(196,169,107,.25)] hover:border-[#8B7355]'}`}>
              Tümü
            </button>
            {Object.entries(TYPE_CONFIG).map(([v,c])=>(
              <button key={v} onClick={()=>setTypeFilter(v)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all ${typeFilter===v?'bg-[#5C4A32] text-white border-[#5C4A32]':'bg-white text-[#5C4A32] border-[rgba(196,169,107,.25)] hover:border-[#8B7355]'}`}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#7A7368]">
              {loading ? 'Yükleniyor…' : `${filtered.length} işletme bulundu`}
            </p>
            <Link href="/hizmetler/basvur" className="text-sm text-[#C9832E] hover:underline font-medium">
              İşletmenizi Ekleyin →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏪</div>
              <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">
                {services.length === 0 ? 'Henüz onaylı hizmet yok' : 'Filtrele uygun hizmet bulunamadı'}
              </h3>
              <p className="text-sm text-[#7A7368] mb-5">
                {services.length === 0 ? 'İlk işletme olmak ister misiniz?' : 'Farklı filtreler deneyin.'}
              </p>
              <Link href="/hizmetler/basvur"
                className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#b87523]">
                Hizmet Başvurusu Yap →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(s=>{
                const tc = TYPE_CONFIG[s.type] || {icon:'🏪', label:s.type};
                return (
                  <Link key={s.id} href={`/hizmetler/${s.slug||s.id}`}
                    className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all block">
                    <div className="h-[160px] bg-[#F7F2EA] flex items-center justify-center overflow-hidden relative">
                      {s.coverUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={s.coverUrl} alt={s.businessName} className="w-full h-full object-cover"/>
                        : <span className="text-5xl">{tc.icon}</span>
                      }
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-semibold bg-white/90 text-[#5C4A32] px-2 py-1 rounded-full">
                          {tc.icon} {tc.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-1">{s.businessName}</h3>
                      <div className="text-xs text-[#7A7368] mb-2">
                        📍 {s.city}{s.district?`, ${s.district}`:''}
                        {s.phone && <span> · 📞 {s.phone}</span>}
                      </div>
                      {s.description && (
                        <p className="text-xs text-[#9A9188] line-clamp-2 mb-3">{s.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {s.rating > 0 ? (
                          <span className="text-xs text-[#7A7368]">⭐ {s.rating} ({s.reviewCount||0})</span>
                        ) : (
                          <span className="text-xs text-[#9A9188]">Yeni işletme</span>
                        )}
                        <span className="text-xs text-[#C9832E] font-medium">Detay →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-[#2F2622] rounded-[24px] p-8 text-center">
            <div className="text-4xl mb-3">🏪</div>
            <h2 className="font-serif text-2xl font-light text-white mb-2">Pet işletmeniz var mı?</h2>
            <p className="text-sm text-white/50 mb-5 max-w-md mx-auto">
              Binlerce pet sahibine ulaşın. Patıpetra'da doğrulanmış işletme profilinizi oluşturun.
            </p>
            <Link href="/hizmetler/basvur"
              className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523]">
              Başvuru Yapın →
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
