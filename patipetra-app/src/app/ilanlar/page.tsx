import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pet Sahiplendirme İlanları — Türkiye 81 İl',
  description: 'Türkiye genelinde 81 ilde kedi, köpek ve diğer evcil hayvan sahiplendirme ilanları. Güvenli, doğrulanmış ve ücretsiz.',
  alternates: { canonical: 'https://patipetra.com/ilanlar' },
};

const LISTINGS = [
  { id:1, title:'Acil yuva arayan Golden Retriever', city:'Ankara', district:'Çankaya', age:'2 yaş', type:'Sahiplendirme', verified:true, premium:true, urgent:false, isPuppy:false, tags:['Aşılı','Kısır','Çocuk Dostu'], img:'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80', desc:'Uysal, çocuklarla iyi anlaşan, aşıları tam ve veteriner kontrolleri düzenli yapılan Golden için güvenilir yuva aranıyor.', views:187, favs:12 },
  { id:2, title:'Yuva arayan Scottish Fold',         city:'İzmir',  district:'Karşıyaka',age:'1 yaş', type:'Sahiplendirme', verified:true, premium:false,urgent:false, isPuppy:false, tags:['Aşılı','Kısır'],              img:'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80', desc:'Ev yaşamına alışkın, oyuncu ve sevecen. Düzenli beslenme planı ve tüm temel kayıtları mevcut.',                               views:134, favs:9  },
  { id:3, title:'Yavru tekir kedi × 4',              city:'İstanbul',district:'Kadıköy', age:'6 hft', type:'Sahiplendirme', verified:false,premium:false,urgent:true,  isPuppy:true,  tags:['Yavru','Annesiyle'],          img:'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80', desc:'Anneleriyle birlikte doğan dört minik tekir yavru, sahiplenmeye hazırlanıyor.',                                               views:88,  favs:31 },
  { id:4, title:'Geçici yuva aranan Terrier',        city:'Bursa',  district:'Nilüfer',  age:'8 aylık',type:'Geçici Yuva', verified:true, premium:true, urgent:false, isPuppy:false, tags:['Aşılı'],                       img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80', desc:'3 aylık bakım sürecinde destek olabilecek geçici yuva aranıyor. Tüm bakım notları şeffaf biçimde paylaşılıyor.',             views:54,  favs:7  },
  { id:5, title:'Hollanda Cüce Tavşan',              city:'Konya',  district:'Selçuklu', age:'1 yaş', type:'Sahiplendirme', verified:true, premium:false,urgent:false, isPuppy:false, tags:['Aşılı','Çocuk Dostu'],        img:'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80', desc:'Sevimli, evcil tavşan. Kafesi ve tüm malzemeleri ile birlikte sahiplendirilecek.',                                             views:45,  favs:9  },
  { id:6, title:'British Shorthair Gri Erkek',       city:'Antalya',district:'Muratpaşa',age:'3 yaş', type:'Sahiplendirme', verified:true, premium:true, urgent:false, isPuppy:false, tags:['Aşılı','Kısır','Mikroçip'],   img:'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=800&q=80', desc:'Sakin, uysal, sofistike British SH. Aşıları ve tüm kayıtları mevcut.',                                                       views:132, favs:22 },
];

const FILTERS = ['İlan Türü','Şehir (81 İl)','İlçe','Pet Türü','Yaş Grubu','Cinsiyet'];
const QUICK   = ['Tümü','💉 Aşılı','✂ Kısır','👶 Çocuk Dostu','🐱 Kedi','🐶 Köpek','🚨 Acil','🍼 Yavru'];

export default function IlanlarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 lg:pb-0">

        {/* Hero */}
        <section className="relative overflow-hidden pt-[108px] pb-10 bg-gradient-to-br from-[#F7F2EA] via-[#F4EBDD] to-[#EDD5BE]">
          <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'linear-gradient(rgba(201,131,46,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,131,46,.07) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#C17B5C] mb-3">Sahiplendirme İlanları</div>
            <h1 className="font-serif text-[clamp(32px,6vw,64px)] font-light leading-[.97] text-[#2F2622] mb-3">
              Yuva bekleyen dostlar için<br/><em className="italic text-[#C9832E]">güvenilir</em> platform
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[520px] mb-8 font-light">
              Türkiye'nin 81 ilinde aşılı, doğrulanmış ve güvenilir sahiplendirme ilanları.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-[20px] border border-[rgba(201,131,46,.12)] p-5 mb-4 shadow-[0_8px_32px_rgba(92,74,50,.07)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                {FILTERS.map(f=>(
                  <div key={f}>
                    <div className="text-[9px] font-medium tracking-[.12em] uppercase text-[#9A9188] mb-1">{f}</div>
                    <select className="w-full px-3 py-[10px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm text-[#2F2622] focus:outline-none focus:border-[#C9832E] transition-all -webkit-appearance-none appearance-none cursor-pointer">
                      <option>Tümü</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/panel" className="inline-flex items-center bg-[#5C4A32] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#2F2622] transition-all">Ara</Link>
                <button className="inline-flex items-center border-[1.5px] border-[#8B7355] text-[#5C4A32] text-sm font-medium px-5 py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">Sıfırla</button>
                <Link href="/panel" className="inline-flex items-center bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-all ml-auto">+ İlan Ver</Link>
              </div>
            </div>

            {/* Quick filters */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
              {QUICK.map((q,i)=>(
                <button key={q} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all whitespace-nowrap ${i===0?'bg-[#5C4A32] text-white border-[#5C4A32]':'bg-white text-[#5C4A32] border-[rgba(196,169,107,.25)] hover:border-[#8B7355]'}`}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Listings */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#7A7368]">{LISTINGS.length} ilan gösteriliyor</p>
            <select className="px-3 py-2 rounded-[10px] border-[1.5px] border-[rgba(196,169,107,.25)] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] transition-all cursor-pointer">
              <option>En Yeni</option>
              <option>En Çok Görüntülenen</option>
              <option>Premium Önce</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LISTINGS.map(l=>(
              <article key={l.id} className="bg-white rounded-[22px] border border-[rgba(201,131,46,.1)] overflow-hidden hover:shadow-[0_20px_50px_rgba(92,74,50,.11)] hover:-translate-y-[5px] hover:border-[rgba(201,131,46,.3)] transition-all">
                <div className="relative h-[200px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.img} alt={l.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy"/>
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span className="text-[10px] font-medium bg-white/90 text-[#5C4A32] px-3 py-1 rounded-full">{l.type}</span>
                    {l.verified&&<span className="text-[10px] font-medium bg-[rgba(107,124,92,.9)] text-white px-3 py-1 rounded-full">Doğrulanmış</span>}
                    {l.urgent&&<span className="text-[10px] font-medium bg-[rgba(231,76,60,.9)] text-white px-3 py-1 rounded-full">Acil</span>}
                  </div>
                  {l.premium&&<span className="absolute top-3 right-3 text-[10px] font-medium bg-[rgba(201,131,46,.9)] text-white px-3 py-1 rounded-full">Premium</span>}
                  {l.isPuppy&&<span className="absolute bottom-3 left-3 text-[10px] font-medium bg-[rgba(201,131,46,.9)] text-white px-3 py-1 rounded-full">🍼 Yavru</span>}
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-2 leading-tight">{l.title}</h2>
                  <div className="text-sm text-[#8B7355] mb-2">📍 {l.city}, {l.district} · {l.age}</div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {l.tags.map(t=><span key={t} className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[3px] rounded-full border border-[rgba(196,169,107,.2)]">{t}</span>)}
                  </div>
                  <p className="text-sm leading-[1.75] text-[#7A7368] mb-3 line-clamp-2">{l.desc}</p>
                  <div className="flex justify-between text-[11px] text-[#9A9188] mb-4">
                    <span>👁 {l.views} görüntülenme</span>
                    <span>❤ {l.favs} favori</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/giris" className="bg-[#5C4A32] text-white text-xs font-semibold text-center py-[9px] rounded-full hover:bg-[#2F2622] transition-colors">Detay</Link>
                    <Link href="/giris" className="border-[1.5px] border-[#8B7355] text-[#5C4A32] text-xs font-semibold text-center py-[9px] rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">İletişim</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="inline-flex items-center border-[1.5px] border-[#8B7355] text-[#5C4A32] text-[15px] font-medium px-10 py-3 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">
              Daha Fazla Yükle
            </button>
          </div>

          {/* How it works */}
          <div className="mt-16 pt-12 border-t border-[#E3D9C6]">
            <h2 className="font-serif text-[clamp(24px,4vw,36px)] font-light text-[#2F2622] mb-2">Nasıl Çalışır?</h2>
            <p className="text-sm text-[#7A7368] mb-8 leading-relaxed">Patıpetra'da sahiplendirme ve ilan süreci güvenli ve şeffaftır.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {n:1,t:'Ücretsiz Üye Ol',d:'Google veya e-posta ile hızlı kayıt.'},
                {n:2,t:'İlan Ver veya Ara',d:'Pet bilgilerini gir, 81 ilden ilan yayınla.'},
                {n:3,t:'İletişime Geç',d:'Platform üzerinden güvenli mesajlaş.'},
                {n:4,t:'Yuva Bul',d:'Sahiplendirme tamamlandı, pasaport oluştur.'},
              ].map(s=>(
                <div key={s.n} className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#C9832E] text-white font-serif text-xl font-semibold flex items-center justify-center mx-auto mb-3">{s.n}</div>
                  <div className="font-semibold text-[#2F2622] mb-2">{s.t}</div>
                  <div className="text-sm text-[#7A7368] leading-relaxed">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
