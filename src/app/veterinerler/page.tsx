'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MOCK_VETS = [
  { id:'v1', userId:'', name:'Dr. Ahmet Yılmaz', clinic:'PetLife Veteriner Kliniği',    city:'Ankara',    spec:['Dahiliye','Aşı Takibi'],    resp:12, rating:4.9, reviewCount:124, online:true,  verified:true,  slug:'dr-ahmet-yilmaz',    avatar:'', bio:'10 yıllık deneyimle kedi ve köpek sağlığı alanında uzman.' },
  { id:'v2', userId:'', name:'Dr. Zeynep Kaya',  clinic:'Minik Dostlar Vet',            city:'İstanbul',  spec:['Cerrahi','Beslenme'],        resp:35, rating:4.8, reviewCount:98,  online:false, verified:true,  slug:'dr-zeynep-kaya',     avatar:'', bio:'Küçük hayvan cerrahisi ve beslenme danışmanlığı.' },
  { id:'v3', userId:'', name:'Dr. Burak Demir',  clinic:'Paws Health Center',           city:'İzmir',     spec:['Dermatoloji','Check-up'],    resp:18, rating:4.7, reviewCount:76,  online:true,  verified:true,  slug:'dr-burak-demir',     avatar:'', bio:'Deri hastalıkları ve genel sağlık kontrolü uzmanı.' },
  { id:'v4', userId:'', name:'Dr. Selin Aydın',  clinic:'Hayvan Sağlığı Merkezi',       city:'Bursa',     spec:['Ortopedi','Radyoloji'],      resp:25, rating:4.6, reviewCount:54,  online:true,  verified:true,  slug:'dr-selin-aydin',     avatar:'', bio:'Ortopedi ve radyoloji alanında 8 yıllık deneyim.' },
  { id:'v5', userId:'', name:'Dr. Mert Çelik',   clinic:'Veteriner Kliniği Antalya',   city:'Antalya',   spec:['Onkoloji','Dahiliye'],       resp:40, rating:4.5, reviewCount:41,  online:false, verified:false, slug:'dr-mert-celik',      avatar:'', bio:'Onkoloji ve dahiliye alanında uzman veteriner.' },
  { id:'v6', userId:'', name:'Dr. Hale Kılıç',   clinic:'Pati Veteriner Muayenehanesi',city:'Gaziantep', spec:['Diş','Genel Pratik'],        resp:20, rating:4.8, reviewCount:89,  online:true,  verified:true,  slug:'dr-hale-kilic',      avatar:'', bio:'Diş sağlığı ve genel pratisyen veterinerlik.' },
];

export default function VeterinerlerPage() {
  const [vets,      setVets]      = useState(MOCK_VETS);
  const [cityFilter,setCityFilter]= useState('');
  const [onlineOnly,setOnlineOnly]= useState(false);
  const [search,    setSearch]    = useState('');

  const filtered = vets.filter(v => {
    if (cityFilter && v.city !== cityFilter) return false;
    if (onlineOnly && !v.online) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) &&
        !v.clinic.toLowerCase().includes(search.toLowerCase())) return false;
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
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer transition-all">
                <option value="">Tüm Şehirler</option>
                {[...new Set(MOCK_VETS.map(v=>v.city))].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={()=>setOnlineOnly(v=>!v)}
                className={`px-4 py-3 rounded-[12px] border-[1.5px] text-sm font-medium transition-all ${onlineOnly?'border-[#6B7C5C] bg-[rgba(107,124,92,.15)] text-[#6B7C5C]':'border-[rgba(107,124,92,.3)] bg-[rgba(107,124,92,.06)] text-[#6B7C5C] hover:bg-[rgba(107,124,92,.1)]'}`}>
                🟢 {onlineOnly?'Çevrimiçi Gösteriliyor':'Şu An Çevrimiçi'}
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#7A7368]">{filtered.length} veteriner bulundu</p>
            <Link href="/veterinerler/basvur" className="text-sm text-[#C9832E] hover:underline font-medium">Veteriner misiniz? →</Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(v => (
              <Link key={v.id} href={`/veterinerler/${v.slug}`}
                className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(201,131,46,.25)] transition-all block">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-2xl flex-shrink-0 relative">
                    🩺
                    {v.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-[2px]">
                      <span className="font-serif text-base font-semibold text-[#2F2622]">{v.name}</span>
                      {v.verified && <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-[1px] rounded-full font-semibold">✓ Doğrulandı</span>}
                    </div>
                    <div className="text-xs text-[#7A7368] mb-1">{v.clinic}</div>
                    <div className="text-xs text-[#9A9188]">📍 {v.city}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {v.spec.map(s => (
                    <span key={s} className="text-[10px] bg-[#F7F2EA] text-[#6E5A40] border border-[#E3D9C6] px-2 py-[2px] rounded-full">{s}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F7F2EA]">
                  <div className="flex items-center gap-3 text-xs text-[#7A7368]">
                    <span>⭐ {v.rating} <span className="text-[#9A9188]">({v.reviewCount})</span></span>
                    <span>⚡ ~{v.resp} dk</span>
                  </div>
                  <div className={`text-[10px] font-semibold px-2 py-1 rounded-full ${v.online?'bg-green-50 text-green-600':'bg-[#F7F2EA] text-[#9A9188]'}`}>
                    {v.online?'🟢 Çevrimiçi':'⚫ Çevrimdışı'}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-[#7A7368]">Arama kriterlerine uygun veteriner bulunamadı.</p>
            </div>
          )}
        </section>
      </main>
      <Footer/>
    </>
  );
}
