import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog & Rehberler — Pet Bakım ve Sağlık',
  description: 'Veteriner onaylı pet bakım rehberleri, aşı takvimleri, beslenme önerileri ve sahiplendirme rehberleri.',
  alternates: { canonical: 'https://patipetra.com/blog' },
};

const POSTS = [
  { slug:'kedi-asi-takvimi',        title:'Kedi Aşı Takvimi: Komple Rehber',             cat:'Sağlık',        read:5,  date:'20 Mar 2026', excerpt:'Kedinizin yaşa göre hangi aşıları ne zaman yapılmalı? Veteriner onaylı aşı takvimi.' },
  { slug:'kopek-beslenmesi',        title:'Köpek Beslenmesi: Yaşa Göre Diyet',            cat:'Beslenme',      read:7,  date:'18 Mar 2026', excerpt:'Köpeğiniz için yaşa ve cinsiyete göre doğru beslenme planı nasıl oluşturulur?' },
  { slug:'sahiplendirme-rehberi',   title:'İlk Kez Pet Sahipleniyorum: Nereden Başlamalı',cat:'Sahiplendirme', read:10, date:'15 Mar 2026', excerpt:'Evcil hayvan sahibi olmak istiyorsunuz ama bilmiyorsunuz. İşte adım adım rehber.' },
  { slug:'kedi-kisirlastirma',      title:'Kedi Kısırlaştırma: Neden Önemli?',            cat:'Sağlık',        read:4,  date:'12 Mar 2026', excerpt:'Kısırlaştırmanın sağlık ve davranış üzerindeki olumlu etkileri.' },
  { slug:'kopek-egitimi-temel',     title:'Köpek Eğitiminin Temel Kuralları',             cat:'Eğitim',        read:8,  date:'10 Mar 2026', excerpt:'Evde köpek eğitimine nereden başlanır? Temel komutlar ve pozitif pekiştirme.' },
  { slug:'pet-pasaport-nedir',      title:'Pet Pasaport Nedir, Nasıl Kullanılır?',        cat:'Rehber',        read:3,  date:'8 Mar 2026',  excerpt:'Patıpetra Pet Pasaport sistemi ile hayvanınızın sağlık geçmişini dijital olarak yönetin.' },
  { slug:'kedi-tuy-donemi',         title:'Kedi Tüy Dökme Döneminde Bakım',              cat:'Bakım',         read:5,  date:'5 Mar 2026',  excerpt:'Mevsimsel tüy dökme döneminde kedinizi nasıl bakmalısınız?' },
  { slug:'kopek-mic-cip',           title:'Mikroçip: Hayvanınızı Kaybetmeyin',            cat:'Güvenlik',      read:4,  date:'2 Mar 2026',  excerpt:'Mikroçip nedir, nasıl yaptırılır ve neden hayati önem taşır?' },
  { slug:'veteriner-secimi',        title:'Doğru Veteriner Nasıl Seçilir?',               cat:'Rehber',        read:6,  date:'28 Şub 2026', excerpt:'Petiniz için doğru veterineri bulmak için bilmeniz gereken 7 kriter.' },
];

const CATS = ['Tümü','Sağlık','Beslenme','Bakım','Eğitim','Sahiplendirme','Rehber','Güvenlik'];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 lg:pb-0">

        {/* Hero */}
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Blog & Rehberler</div>
            <h1 className="font-serif text-[clamp(30px,5vw,56px)] font-light text-[#2F2622] mb-3">
              Petiniz için <em className="italic text-[#C9832E]">bilgi merkezi</em>
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-6 font-light">
              Veteriner onaylı rehberler, bakım ipuçları ve sahiplendirme bilgileri.
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
              {CATS.map((c,i)=>(
                <button key={c} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all whitespace-nowrap ${i===0?'bg-[#5C4A32] text-white border-[#5C4A32]':'bg-white text-[#5C4A32] border-[rgba(196,169,107,.25)] hover:border-[#8B7355]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          {/* Featured */}
          <div className="bg-[#5C4A32] rounded-[24px] p-8 text-white mb-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1">
              <span className="text-[10px] font-semibold tracking-[.14em] uppercase bg-[#C9832E] text-[#2F2622] px-3 py-1 rounded-full">Öne Çıkan</span>
              <h2 className="font-serif text-[clamp(22px,3.5vw,34px)] font-semibold mt-3 mb-3 leading-tight">{POSTS[0].title}</h2>
              <p className="text-sm text-white/60 leading-relaxed mb-5">{POSTS[0].excerpt}</p>
              <Link href={`/blog/${POSTS[0].slug}`} className="inline-flex items-center bg-white text-[#5C4A32] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#F7F2EA] transition-colors">
                Okumaya Devam Et →
              </Link>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-[10px] uppercase tracking-[.12em] text-white/40">{POSTS[0].cat}</div>
              <div className="text-sm text-white/60 mt-1">{POSTS[0].date}</div>
              <div className="text-sm text-white/60">{POSTS[0].read} dk okuma</div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.slice(1).map(p=>(
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] p-6 hover:shadow-[0_12px_32px_rgba(92,74,50,.1)] hover:-translate-y-[4px] hover:border-[rgba(201,131,46,.25)] transition-all block">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold tracking-[.1em] uppercase text-[#C9832E] bg-[rgba(201,131,46,.1)] px-2 py-[3px] rounded-full">{p.cat}</span>
                  <span className="text-[11px] text-[#9A9188]">{p.read} dk</span>
                </div>
                <h3 className="font-serif text-[clamp(17px,2vw,20px)] font-semibold text-[#2F2622] mb-3 leading-tight">{p.title}</h3>
                <p className="text-sm leading-[1.75] text-[#7A7368] mb-4 line-clamp-2">{p.excerpt}</p>
                <div className="text-xs text-[#9A9188]">{p.date}</div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center bg-[#F4EBDD] rounded-[20px] p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">Veteriner misiniz?</h2>
            <p className="text-sm text-[#7A7368] mb-5 leading-relaxed max-w-md mx-auto">Uzmanlığınızı paylaşın, platform topluluğuna katkıda bulunun ve klinik profilinizi büyütün.</p>
            <Link href="/kayit" className="inline-flex items-center bg-[#5C4A32] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#2F2622] transition-all">
              İçerik Gönder →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
