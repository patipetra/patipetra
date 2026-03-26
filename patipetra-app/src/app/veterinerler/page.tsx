import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Veterinerler — Doğrulanmış Veteriner Rehberi',
  description: 'Türkiye genelinde doğrulanmış veteriner klinikleri. Online soru, randevu ve pet pasaport paylaşımı.',
  alternates: { canonical: 'https://patipetra.com/veterinerler' },
};

const VETS = [
  { id:1, name:'Dr. Ahmet Yılmaz', clinic:'PetLife Veteriner Kliniği',    city:'Ankara',   spec:'Dahiliye · Aşı Takibi',    resp:12, rating:4.9, online:true,  verified:true  },
  { id:2, name:'Dr. Zeynep Kaya',  clinic:'Minik Dostlar Vet',            city:'İstanbul', spec:'Cerrahi · Beslenme',        resp:35, rating:4.8, online:false, verified:true  },
  { id:3, name:'Dr. Burak Demir',  clinic:'Paws Health Center',           city:'İzmir',    spec:'Dermatoloji · Check-up',    resp:18, rating:4.7, online:true,  verified:true  },
  { id:4, name:'Dr. Selin Aydın',  clinic:'Hayvan Sağlığı Merkezi',       city:'Bursa',    spec:'Ortopedi · Radyoloji',      resp:25, rating:4.6, online:true,  verified:true  },
  { id:5, name:'Dr. Mert Çelik',   clinic:'Veteriner Kliniği Antalya',    city:'Antalya',  spec:'Onkoloji · Dahiliye',       resp:40, rating:4.5, online:false, verified:false },
  { id:6, name:'Dr. Hale Kılıç',   clinic:'Pati Veteriner Muayenehanesi', city:'Gaziantep',spec:'Diş · Genel Pratik',        resp:20, rating:4.8, online:true,  verified:true  },
];

export default function VeterinerlerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 lg:pb-0">

        {/* Hero */}
        <section className="relative pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Veteriner Güveni</div>
            <h1 className="font-serif text-[clamp(32px,6vw,60px)] font-light text-[#2F2622] mb-3">
              Doğrulanmış veterinerler,<br/><em className="italic text-[#C9832E]">güvenilir</em> iletişim
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-8 font-light">
              Uzmanlık alanı, ortalama yanıt süresi ve çevrimiçi durumu ile Türkiye'nin en iyi veterinerleri.
            </p>
            <div className="flex flex-wrap gap-3">
              <select className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer transition-all">
                <option>Tüm Şehirler</option>
                <option>Ankara</option><option>İstanbul</option><option>İzmir</option>
                <option>Bursa</option><option>Antalya</option>
              </select>
              <select className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] cursor-pointer transition-all">
                <option>Tüm Uzmanlıklar</option>
                <option>Dahiliye</option><option>Cerrahi</option><option>Dermatoloji</option><option>Ortopedi</option>
              </select>
              <button className={`px-4 py-3 rounded-[12px] border-[1.5px] border-[rgba(107,124,92,.3)] bg-[rgba(107,124,92,.1)] text-[#6B7C5C] text-sm font-medium hover:bg-[rgba(107,124,92,.2)] transition-all`}>
                🟢 Şu An Çevrimiçi
              </button>
            </div>
          </div>
        </section>

        {/* Vet list */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="grid lg:grid-cols-[1fr_.36fr] gap-8">
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-[#7A7368]">{VETS.length} veteriner listeleniyor</p>
                <select className="px-3 py-2 rounded-[10px] border-[1.5px] border-[rgba(196,169,107,.25)] bg-white text-sm text-[#5C4A32] focus:outline-none cursor-pointer transition-all">
                  <option>En Yüksek Puan</option>
                  <option>En Hızlı Yanıt</option>
                  <option>Çevrimiçi Önce</option>
                </select>
              </div>
              <div className="flex flex-col gap-4">
                {VETS.map(v=>(
                  <div key={v.id} className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] p-5 hover:shadow-[0_8px_32px_rgba(92,74,50,.1)] hover:border-[rgba(201,131,46,.25)] transition-all">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#EDE5D3] to-[#C9A98C] flex items-center justify-center text-2xl flex-shrink-0">🩺</div>
                        <div>
                          <div className="font-semibold text-[#2F2622] flex items-center gap-2 flex-wrap">
                            {v.name}
                            {v.verified&&<span className="text-[9px] bg-[rgba(107,124,92,.1)] text-[#6B7C5C] px-2 py-[2px] rounded-full border border-[rgba(107,124,92,.25)]">Doğrulandı</span>}
                          </div>
                          <div className="text-sm text-[#7A7368]">{v.clinic}</div>
                          <div className="text-[11px] tracking-[.1em] uppercase text-[#9A9188] mt-1">{v.city} · {v.spec}</div>
                          <div className="text-sm text-[#6E5A40] mt-1">Ort. yanıt: <strong>{v.resp} dk</strong></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-right flex-shrink-0">
                        <span className="text-[10px] bg-[rgba(201,131,46,.1)] text-[#C9832E] px-2 py-1 rounded-full border border-[rgba(201,131,46,.25)]">⭐ {v.rating}</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full ${v.online?'bg-[rgba(107,124,92,.1)] text-[#6B7C5C] border border-[rgba(107,124,92,.25)]':'bg-[#EDE5D3] text-[#7A7368]'}`}>
                          {v.online?'🟢 Çevrimiçi':'Müsait Değil'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {['Soru Sor','Profil','Randevu','Mesaj Gönder'].map((btn,i)=>(
                        <Link key={btn} href="/giris"
                          className={`text-[11px] font-semibold text-center py-[9px] rounded-full transition-all ${i===0?'bg-[#5C4A32] text-white hover:bg-[#2F2622]':i===3?'bg-[#C9832E] text-white hover:bg-[#b87523]':'border-[1.5px] border-[#8B7355] text-[#5C4A32] hover:bg-[#5C4A32] hover:text-white'}`}>
                          {btn}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#5C4A32] rounded-[20px] p-6 text-white">
                <h2 className="font-serif text-xl font-semibold mb-2">Güvenli soru-cevap</h2>
                <p className="text-sm text-white/60 leading-relaxed mb-5">Pet pasaport kaydınızı paylaşın, fotoğraf ekleyin, veterinerden doğrudan yanıt alın.</p>
                <Link href="/giris" className="block w-full text-center bg-[#C9832E] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#b87523] transition-colors">Yeni Soru Oluştur</Link>
              </div>
              <div className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] p-6">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">Güven İşaretleri</h3>
                {['✓ Doğrulanmış veteriner rozeti','✓ Yanıt süresi görünürlüğü','✓ Şeffaf uzmanlık alanı','✓ Kayıt paylaşım izni','✓ Hasta gizliliği'].map(t=>(
                  <div key={t} className="bg-[#F7F2EA] rounded-[12px] px-4 py-3 text-sm font-medium text-[#5C4A32] mb-2">{t}</div>
                ))}
              </div>
              <div className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] p-6">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-3">Klinik Profili</h3>
                <p className="text-sm text-[#7A7368] leading-relaxed mb-4">Kliniğinizi platforma ekleyin, hasta tabanınızı genişletin.</p>
                <Link href="/kayit" className="block w-full text-center border-[1.5px] border-[#8B7355] text-[#5C4A32] text-sm font-semibold py-3 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">Klinik Profili Oluştur</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
