'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CITIES_81 } from '@/data/cities';

const SPECIES_EMOJI: Record<string,string> = {
  cat:'🐱', dog:'🐶', bird:'🐦', rabbit:'🐰',
  hamster:'🐹', turtle:'🐢', fish:'🐟', other:'🐾',
};
const TYPE_LABEL: Record<string,string> = {
  adoption:'Sahiplendirme', temp:'Geçici Yuva', lost:'Kayıp', found:'Bulundu',
};
const TYPE_COLOR: Record<string,string> = {
  adoption:'bg-green-50 text-green-700 border-green-200',
  temp:    'bg-blue-50 text-blue-700 border-blue-200',
  lost:    'bg-red-50 text-red-700 border-red-200',
  found:   'bg-purple-50 text-purple-700 border-purple-200',
};

export default function IlanlarPage() {
  const [listings,    setListings]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [cityFilter,  setCityFilter]  = useState('');
  const [typeFilter,  setTypeFilter]  = useState('');
  const [specFilter,  setSpecFilter]  = useState('');
  const [search,      setSearch]      = useState('');
  const [urgentOnly,  setUrgentOnly]  = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(
        collection(db,'listings'),
        where('status','==','active'),
        orderBy('createdAt','desc')
      ));
      setListings(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e) {
      console.error(e);
      // Index yoksa orderBy olmadan dene
      try {
        const snap2 = await getDocs(query(
          collection(db,'listings'),
          where('status','==','active')
        ));
        setListings(snap2.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e2) { console.error(e2); }
    }
    setLoading(false);
  }

  const filtered = listings.filter(l => {
    if (cityFilter && l.city !== cityFilter) return false;
    if (typeFilter && l.type !== typeFilter) return false;
    if (specFilter && l.species !== specFilter) return false;
    if (urgentOnly && !l.isUrgent) return false;
    if (search && !l.name?.toLowerCase().includes(search.toLowerCase()) &&
        !l.breed?.toLowerCase().includes(search.toLowerCase()) &&
        !l.city?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">
        {/* Hero */}
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Sahiplendirme İlanları</div>
            <h1 className="font-serif text-[clamp(30px,5vw,52px)] font-light text-[#2F2622] mb-3">
              Yuva bekleyen <em className="italic text-[#C9832E]">dostlar</em>
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] text-[#7A7368] mb-6 font-light max-w-[500px] leading-relaxed">
              81 ilde sahiplendirme, geçici yuva, kayıp ve bulundu ilanları.
            </p>

            {/* Filtreler */}
            <div className="flex flex-wrap gap-3">
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="İlan ara… (ad, cins, şehir)"
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] transition-all min-w-[200px]"/>

              <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer">
                <option value="">Tüm İlan Türleri</option>
                <option value="adoption">Sahiplendirme</option>
                <option value="temp">Geçici Yuva</option>
                <option value="lost">Kayıp</option>
                <option value="found">Bulundu</option>
              </select>

              <select value={specFilter} onChange={e=>setSpecFilter(e.target.value)}
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer">
                <option value="">Tüm Türler</option>
                <option value="cat">🐱 Kedi</option>
                <option value="dog">🐶 Köpek</option>
                <option value="bird">🐦 Kuş</option>
                <option value="rabbit">🐰 Tavşan</option>
                <option value="other">🐾 Diğer</option>
              </select>

              <select value={cityFilter} onChange={e=>setCityFilter(e.target.value)}
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer">
                <option value="">Tüm Şehirler</option>
                {CITIES_81.map(c=><option key={c} value={c}>{c}</option>)}
              </select>

              <button onClick={()=>setUrgentOnly(v=>!v)}
                className={`px-4 py-3 rounded-[12px] border-[1.5px] text-sm font-medium transition-all ${urgentOnly?'border-red-400 bg-red-50 text-red-600':'border-[rgba(196,169,107,.3)] bg-white text-[#5C4A32] hover:border-[#8B7355]'}`}>
                ⚡ {urgentOnly?'Acil Gösteriliyor':'Acil İlanlar'}
              </button>

              <Link href="/panel/ilanlarim"
                className="ml-auto px-4 py-3 rounded-[12px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] transition-all">
                + İlan Ver
              </Link>
            </div>
          </div>
        </section>

        {/* İlanlar */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#7A7368]">
              {loading ? 'Yükleniyor…' : `${filtered.length} ilan bulundu`}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🐾</div>
              <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">
                {listings.length === 0 ? 'Henüz ilan yok' : 'Filtrele uygun ilan bulunamadı'}
              </h3>
              <p className="text-sm text-[#7A7368] mb-5">
                {listings.length === 0 ? 'İlk ilanı siz verin!' : 'Farklı filtreler deneyin.'}
              </p>
              <Link href="/panel/ilanlarim"
                className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#b87523]">
                İlan Ver →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(l=>(
                <div key={l.id} className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                  {/* Görsel */}
                  <Link href={`/ilanlar/${l.id}`} className="block">
                    <div className="h-[180px] bg-[#F7F2EA] flex items-center justify-center overflow-hidden relative">
                      {l.imageUrls?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.imageUrls[0]} alt={l.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                      ) : (
                        <span className="text-6xl">{SPECIES_EMOJI[l.species]||'🐾'}</span>
                      )}
                      {l.isUrgent && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-[2px] rounded-full animate-pulse">
                          ⚡ ACİL
                        </div>
                      )}
                      <div className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-[2px] rounded-full border ${TYPE_COLOR[l.type]||'bg-white text-[#5C4A32]'}`}>
                        {TYPE_LABEL[l.type]||l.type}
                      </div>
                    </div>
                  </Link>

                  {/* İçerik */}
                  <div className="p-4">
                    <Link href={`/ilanlar/${l.id}`}>
                      <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-1 hover:text-[#C9832E] transition-colors">{l.name}</h3>
                    </Link>
                    <div className="text-xs text-[#7A7368] mb-2">
                      {l.breed && <span>{l.breed} · </span>}
                      {l.age   && <span>{l.age} · </span>}
                      <span>📍 {l.city}{l.district?`, ${l.district}`:''}</span>
                    </div>

                    {/* Özellikler */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {l.gender==='male'   && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-[1px] rounded-full">♂ Erkek</span>}
                      {l.gender==='female' && <span className="text-[10px] bg-pink-50 text-pink-600 px-2 py-[1px] rounded-full">♀ Dişi</span>}
                      {l.isVaccinated  && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-[1px] rounded-full">✓ Aşılı</span>}
                      {l.isSterilized  && <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-[1px] rounded-full">✓ Kısır</span>}
                      {l.isMicrochipped && <span className="text-[10px] bg-[#F7F2EA] text-[#5C4A32] px-2 py-[1px] rounded-full">✓ Çipli</span>}
                    </div>

                    {/* Butonlar - artık /giris'e değil direkt detay sayfasına */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/ilanlar/${l.id}`}
                        className="bg-[#5C4A32] text-white text-xs font-semibold text-center py-[9px] rounded-full hover:bg-[#2F2622] transition-colors">
                        Detaylar
                      </Link>
                      <Link href={`/ilanlar/${l.id}#iletisim`}
                        className="border-[1.5px] border-[#8B7355] text-[#5C4A32] text-xs font-semibold text-center py-[9px] rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">
                        İletişim
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer/>
    </>
  );
}
