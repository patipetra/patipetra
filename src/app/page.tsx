import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Patıpetra — Türkiye'nin Pet Yaşam Platformu",
  alternates: { canonical: 'https://patipetra.com' },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section id="anasayfa" className="relative overflow-hidden pt-[108px] pb-16"
          style={{background:'linear-gradient(135deg,#F7F2EA 0%,#F8F0E4 60%,#F2E4D2 100%)'}}>
          <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'linear-gradient(rgba(201,131,46,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,131,46,.07) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] pointer-events-none" style={{background:'rgba(193,123,92,.09)',top:-80,right:-60}}/>
          <div className="absolute w-[380px] h-[380px] rounded-full blur-[80px] pointer-events-none" style={{background:'rgba(107,124,92,.1)',bottom:-60,left:-40}}/>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-[1.08fr_.92fr] gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-white/70 backdrop-blur-sm border border-[rgba(201,131,46,.22)] rounded-full px-4 py-2 mb-5">
                  <span className="text-[11px] font-semibold tracking-[.22em] uppercase text-[#8B7355]">Türkiye'nin pet yaşam platformu</span>
                </div>
                <h1 className="font-serif text-[clamp(40px,7vw,76px)] font-light leading-[.97] tracking-[-0.025em] text-[#2F2622] mb-4">
                  Petler için <em className="italic text-[#C9832E]">sosyal yaşam,</em><br/>
                  güvenilir veteriner erişimi<br/>ve güçlü pet pasaport.
                </h1>
                <p className="text-[clamp(15px,2vw,17px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-8 font-light">
                  Patıpetra'da pet profili oluştur, ilan ver, veterinere ulaş, sağlık geçmişini tek panelden takip et ve mağazadan ihtiyaçlarını keşfet.
                </p>
                <div className="flex flex-wrap gap-3 mb-10">
                  <Link href="/kayit" className="inline-flex items-center bg-[#5C4A32] text-white text-[15px] font-medium px-8 py-3 rounded-full hover:bg-[#2F2622] transition-all hover:-translate-y-[1px]">Hemen Başla</Link>
                  <Link href="/ilanlar" className="inline-flex items-center border-[1.5px] border-[#8B7355] text-[#5C4A32] text-sm font-medium px-6 py-3 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">İlanlara Göz At</Link>
                  <Link href="/veterinerler" className="inline-flex items-center bg-[#C9832E] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#b87523] transition-all">Veteriner Bul</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[{n:'24.8K',l:'Aktif Kullanıcı'},{n:'41.2K',l:'Pet Profili'},{n:'312',l:'Veteriner'},{n:'1.9K',l:'Aktif İlan'}].map(s=>(
                    <div key={s.l} className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 border border-[rgba(201,131,46,.1)]">
                      <div className="font-serif text-[clamp(22px,3vw,32px)] font-semibold text-[#5C4A32] leading-none">{s.n}</div>
                      <div className="text-xs text-[#7A7368] mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/72 backdrop-blur-[18px] border border-[rgba(201,131,46,.15)] rounded-[28px] p-6 shadow-[0_16px_48px_rgba(92,74,50,.1)]">
                <div className="text-[10px] font-semibold tracking-[.22em] uppercase text-[#9A9188] mb-1">Canlı Pet Paneli</div>
                <div className="font-serif text-[clamp(20px,2.5vw,24px)] font-semibold text-[#2F2622] mb-4">Max'in Kontrol Merkezi</div>
                <div className="bg-[#F7F2EA] rounded-[20px] p-4 mb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-20 h-20 rounded-[18px] bg-gradient-to-br from-[#EDD9BE] to-[#C9A98C] flex items-center justify-center text-4xl flex-shrink-0">🐕</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-xl font-semibold text-[#2F2622]">Max</div>
                      <div className="text-sm text-[#7A7368]">Golden Retriever · 2 yaş · Ankara</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {['Aşılar Tam','Mikroçip'].map(t=><span key={t} className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[3px] rounded-full">{t}</span>)}
                        <span className="text-[10px] bg-[rgba(107,124,92,.1)] text-[#6B7C5C] px-2 py-[3px] rounded-full">Vet Onaylı</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[rgba(201,131,46,.1)] text-[#C9832E] px-2 py-[3px] rounded-full flex-shrink-0">Plus Üye</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[{tag:'Sıradaki İşlem',val:'Karma aşı hatırlatması',c:'#C9832E'},{tag:'Veteriner',val:'Dr. Ahmet Yılmaz',c:'#6B7C5C'}].map(c=>(
                      <div key={c.tag} className="bg-white rounded-[14px] p-3">
                        <div className="text-[10px] tracking-[.14em] uppercase mb-1" style={{color:c.c}}>{c.tag}</div>
                        <div className="text-sm font-medium text-[#2F2622]">{c.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Paylaşım Yap','İlan Ver','Veterinere Sor','Pet Ekle','Aşı Kaydı Gir','Mağazaya Git'].map(a=>(
                    <Link key={a} href="/panel" className="p-3 rounded-[14px] border border-[rgba(201,131,46,.14)] bg-white text-xs font-medium text-[#5C4A32] text-center hover:bg-[#5C4A32] hover:text-white transition-all">{a}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="bg-[#5C4A32] overflow-hidden py-3 select-none" aria-hidden="true">
          <div className="marquee-track">
            {[...Array(2)].map((_,di)=>['Sosyal Pet Ağı','Sahiplendirme İlanları','Veteriner İletişimi','Pet Pasaport Sistemi','Premium Mağaza','Beslenme Rehberleri','Irk Toplulukları','Aşı Takip Sistemi'].map((t,i)=>(
              <span key={`${di}-${i}`} className="flex items-center gap-4 px-5 text-[11px] font-normal tracking-[.14em] uppercase text-white/45 whitespace-nowrap">
                {t} <span className="w-[4px] h-[4px] rounded-full bg-[#C9832E] flex-shrink-0"/>
              </span>
            )))}
          </div>
        </div>

        {/* İLANLAR */}
        <section id="ilanlar" className="py-[clamp(60px,8vw,96px)] bg-[#F4EBDD]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <div>
                <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#C17B5C] mb-2">Sahiplendirme İlanları</div>
                <h2 className="font-serif text-[clamp(28px,5vw,50px)] font-light text-[#2F2622]">Hızlı, temiz ve <em className="italic text-[#C17B5C]">güven veren</em> ilan akışı</h2>
              </div>
              <Link href="/ilanlar" className="text-sm font-medium text-[#5C4A32] hover:gap-4 transition-all flex items-center gap-2">Tüm ilanlar →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {title:'Acil yuva arayan Golden Retriever',city:'Ankara / Çankaya',age:'2 yaş',type:'Sahiplendirme',verified:true,premium:true,img:'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',desc:'Uysal, çocuklarla iyi anlaşan, aşıları tam Golden için güvenilir yuva aranıyor.'},
                {title:'Yuva arayan Scottish Fold',city:'İzmir / Karşıyaka',age:'1 yaş',type:'Sahiplendirme',verified:true,premium:false,img:'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',desc:'Ev yaşamına alışkın, oyuncu ve sevecen. Tüm kayıtları mevcut.'},
                {title:'Geçici yuva aranan Terrier',city:'Bursa / Nilüfer',age:'8 aylık',type:'Geçici Yuva',verified:false,premium:true,img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',desc:'3 aylık bakım sürecinde destek olabilecek geçici yuva aranıyor.'},
              ].map(l=>(
                <article key={l.title} className="bg-white rounded-[24px] border border-[rgba(201,131,46,.1)] overflow-hidden hover:shadow-[0_20px_50px_rgba(92,74,50,.11)] hover:-translate-y-[5px] hover:border-[rgba(201,131,46,.3)] transition-all">
                  <div className="relative h-[200px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.img} alt={l.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy"/>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[10px] font-medium bg-white/90 text-[#5C4A32] px-3 py-1 rounded-full">{l.type}</span>
                      {l.verified&&<span className="text-[10px] font-medium bg-[rgba(107,124,92,.9)] text-white px-3 py-1 rounded-full">Doğrulanmış</span>}
                    </div>
                    {l.premium&&<span className="absolute top-3 right-3 text-[10px] font-medium bg-[rgba(201,131,46,.9)] text-white px-3 py-1 rounded-full">Premium</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2 leading-tight">{l.title}</h3>
                    <div className="text-sm text-[#8B7355] mb-2">📍 {l.city} · {l.age}</div>
                    <p className="text-sm leading-[1.75] text-[#7A7368] mb-4 line-clamp-2">{l.desc}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/ilanlar" className="bg-[#5C4A32] text-white text-xs font-semibold text-center py-2 rounded-full hover:bg-[#2F2622] transition-colors">Detay</Link>
                      <Link href="/giris"   className="border-[1.5px] border-[#8B7355] text-[#5C4A32] text-xs font-semibold text-center py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">İletişim</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/ilanlar" className="inline-flex items-center bg-[#5C4A32] text-white text-[15px] font-medium px-10 py-3 rounded-full hover:bg-[#2F2622] transition-all">
                Tüm İlanları Gör → <span className="opacity-50 ml-1">(1.900+)</span>
              </Link>
            </div>
          </div>
        </section>

        {/* PREMIUM */}
        <section id="premium" className="py-[clamp(60px,8vw,96px)] bg-[#2F2622]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="mb-12">
              <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#C9832E] mb-2">Patıpetra Premium</div>
              <h2 className="font-serif text-[clamp(28px,5vw,50px)] font-light text-white">
                Premium üyelik <em className="italic text-[#E8B86D]">gerçekten</em> <strong className="font-semibold text-[#C9832E]">fayda sunar.</strong>
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {name:'Standart Premium',price:'₺199',feats:['Daha fazla ilan hakkı','Profil öne çıkarma','Favori listeleme','Reklamsız gezinme'],featured:false},
                {name:'Plus Premium',price:'₺349',feats:['Vet sorularında öncelik','Sınırsız pet profili','Gelişmiş sağlık raporları','Öncelikli destek'],featured:true},
                {name:'Klinik Profili',price:'₺599',feats:['Öne çıkan vet görünürlüğü','Doğrulanmış klinik rozeti','Hızlı dönüş etiketi','Genişletilmiş profil'],featured:false},
              ].map(p=>(
                <div key={p.name} className={`rounded-[24px] p-6 relative hover:-translate-y-1 transition-all ${p.featured?'bg-[#5C4A32]':'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                  {p.featured&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9832E] text-[#2F2622] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">En Popüler</div>}
                  <div className="text-[10px] font-semibold tracking-[.2em] uppercase text-white/40 mb-2">Üyelik Planı</div>
                  <div className="font-serif text-2xl font-semibold text-white mb-1">{p.name}</div>
                  <div className={`font-serif text-4xl font-semibold mb-1 ${p.featured?'text-[#F5E2C7]':'text-[#C9832E]'}`}>{p.price}</div>
                  <div className="text-xs text-white/40 mb-5">/ ay</div>
                  <div className="flex flex-col gap-2 mb-5">
                    {p.feats.map(f=><div key={f} className={`text-sm rounded-[14px] px-4 py-3 ${p.featured?'bg-white/10 text-white':'bg-white/5 text-white/70'}`}>✓ {f}</div>)}
                  </div>
                  <Link href="/kayit" className={`block w-full text-center text-sm font-semibold py-3 rounded-full transition-all ${p.featured?'bg-[#C9832E] text-white hover:bg-[#b87523]':'bg-white/10 text-white hover:bg-white/20'}`}>Planı Seç</Link>
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
