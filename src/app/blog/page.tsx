import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog & Rehberler — Pet Bakım, Sağlık ve Sahiplendirme',
  description: 'Veteriner onaylı pet bakım rehberleri, aşı takvimleri, beslenme önerileri ve sahiplendirme rehberleri. Kediler, köpekler ve diğer evcil hayvanlar için kapsamlı bilgi.',
  keywords: ['pet bakım', 'kedi bakımı', 'köpek bakımı', 'evcil hayvan sağlığı', 'pet beslenme', 'aşı takvimi'],
};

export const BLOG_POSTS = [
  {
    slug:     'kedi-asi-takvimi-kapsamli-rehber',
    title:    'Kedi Aşı Takvimi: Yaşa Göre Eksiksiz Rehber',
    excerpt:  'Kedinizin hangi aşıları, ne zaman ve kaç kez yaptırması gerektiğini anlatan kapsamlı bir rehber. Yavru kediden yaşlı kediye tüm dönemleri kapsıyor.',
    cat:      'Sağlık',
    readTime: 8,
    date:     '20 Mart 2026',
    img:      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: true,
  },
  {
    slug:     'kopek-beslenmesi-yasagore-rehber',
    title:    'Köpek Beslenmesi: Yaşa ve Irka Göre Doğru Diyet',
    excerpt:  'Yavru köpekten kıdemli köpeğe, küçük ırklardan büyük ırklara kadar her köpek için ideal beslenme düzeni ve dikkat edilmesi gereken noktalar.',
    cat:      'Beslenme',
    readTime: 10,
    date:     '18 Mart 2026',
    img:      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
  {
    slug:     'ilk-kez-kedi-sahiplenmek',
    title:    'İlk Kez Kedi Sahipleniyorum: Nereden Başlamalıyım?',
    excerpt:  'Hayatınıza ilk kedinizi almayı düşünüyorsanız bu rehber tam size göre. Malzeme listesinden veteriner seçimine, beslenme düzeninden aşı takvimine kadar her şey.',
    cat:      'Sahiplendirme',
    readTime: 12,
    date:     '15 Mart 2026',
    img:      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
  {
    slug:     'kedi-kisirlastirma-neden-onemli',
    title:    'Kedi Kısırlaştırma: Neden Bu Kadar Önemli?',
    excerpt:  'Kısırlaştırmanın hem sağlık hem de davranış açısından faydaları nelerdir? Ameliyat süreci nasıl işler, ne zaman yapılmalı ve sonrasında nelere dikkat edilmeli?',
    cat:      'Sağlık',
    readTime: 7,
    date:     '12 Mart 2026',
    img:      'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
  {
    slug:     'kopek-egitimi-temel-komutlar',
    title:    'Köpek Eğitiminin Temelleri: Evde Nasıl Başlanır?',
    excerpt:  'Otur, dur, gel, yatır — temel komutları öğretmek için kanıtlanmış pozitif pekiştirme yöntemleri. Sabır ve tutarlılıkla her köpek eğitilebilir.',
    cat:      'Eğitim',
    readTime: 9,
    date:     '10 Mart 2026',
    img:      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
  {
    slug:     'pet-pasaport-nedir-nasil-kullanilir',
    title:    'Pet Pasaport Nedir ve Neden Her Evcil Hayvan Sahibi İhtiyaç Duyar?',
    excerpt:  'Dijital pet pasaport sistemi ile hayvanınızın tüm sağlık geçmişini tek platformda yönetin. Aşılar, muayeneler, ilaçlar ve önemli tarihler hepsi elinizin altında.',
    cat:      'Rehber',
    readTime: 5,
    date:     '8 Mart 2026',
    img:      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
  {
    slug:     'kedi-tuy-dokme-bakimi',
    title:    'Kedi Tüy Dökme Döneminde Bakım Rehberi',
    excerpt:  'İlkbahar ve sonbaharda yoğunlaşan tüy dökme döneminde kedinizi nasıl taramalı, beslemeli ve bakmalısınız? Alerjisi olanlar için özel öneriler de dahil.',
    cat:      'Bakım',
    readTime: 6,
    date:     '5 Mart 2026',
    img:      'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
  {
    slug:     'mikrocip-neden-zorunlu',
    title:    'Mikroçip: Hayvanınızı Kaybetmemenin En Etkili Yolu',
    excerpt:  'Mikroçip nedir, nasıl takılır, acıtır mı? Türkiye\'de mikroçip zorunluluğu ve kayıp hayvanların bulunmasında nasıl kritik rol oynadığı hakkında her şey.',
    cat:      'Güvenlik',
    readTime: 5,
    date:     '2 Mart 2026',
    img:      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
  {
    slug:     'dogru-veteriner-nasil-secilir',
    title:    'Petiniz İçin Doğru Veterineri Nasıl Seçersiniz?',
    excerpt:  'Veteriner seçimi hayvanınızın sağlığı için kritik bir karar. Dikkat etmeniz gereken 8 temel kriter, sormanız gereken sorular ve kötü veterineri nasıl anlarsınız?',
    cat:      'Rehber',
    readTime: 7,
    date:     '28 Şubat 2026',
    img:      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
    author:   'Patıpetra Editörü',
    featured: false,
  },
];

const CATS = ['Tümü','Sağlık','Beslenme','Bakım','Eğitim','Sahiplendirme','Rehber','Güvenlik'];

export default function BlogPage() {
  const featured = BLOG_POSTS.find(p => p.featured)!;
  const rest      = BLOG_POSTS.filter(p => !p.featured);

  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">
        {/* Hero */}
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Blog & Rehberler</div>
            <h1 className="font-serif text-[clamp(30px,5vw,56px)] font-light text-[#2F2622] mb-3">
              Petiniz için <em className="italic text-[#C9832E]">bilgi merkezi</em>
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-6 font-light">
              Veteriner destekli rehberler, bakım ipuçları ve sahiplendirme bilgileri.
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
              {CATS.map((c,i) => (
                <button key={c} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all whitespace-nowrap ${i===0?'bg-[#5C4A32] text-white border-[#5C4A32]':'bg-white text-[#5C4A32] border-[rgba(196,169,107,.25)] hover:border-[#8B7355]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          {/* Featured */}
          <Link href={`/blog/${featured.slug}`}
            className="grid lg:grid-cols-[1.2fr_1fr] gap-0 rounded-[24px] overflow-hidden border border-[rgba(201,131,46,.1)] hover:shadow-xl hover:-translate-y-1 transition-all mb-10 block bg-white">
            <div className="h-[280px] lg:h-auto relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.img} alt={featured.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-semibold tracking-[.1em] uppercase bg-[rgba(201,131,46,.1)] text-[#C9832E] px-3 py-1 rounded-full">{featured.cat}</span>
                <span className="text-[10px] font-bold bg-[#C9832E] text-white px-3 py-1 rounded-full">Öne Çıkan</span>
              </div>
              <h2 className="font-serif text-[clamp(22px,3vw,32px)] font-semibold text-[#2F2622] mb-3 leading-tight">{featured.title}</h2>
              <p className="text-sm leading-[1.85] text-[#7A7368] mb-5">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-[#9A9188]">
                <span>📅 {featured.date}</span>
                <span>⏱ {featured.readTime} dk okuma</span>
              </div>
              <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#C9832E] hover:gap-3 transition-all gap-2">
                Makaleyi Oku →
              </span>
            </div>
          </Link>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(201,131,46,.3)] transition-all block">
                <div className="h-[180px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy"/>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold tracking-[.1em] uppercase text-[#C9832E] bg-[rgba(201,131,46,.1)] px-2 py-[3px] rounded-full">{p.cat}</span>
                    <span className="text-[11px] text-[#9A9188]">{p.readTime} dk</span>
                  </div>
                  <h3 className="font-serif text-[clamp(16px,2vw,19px)] font-semibold text-[#2F2622] mb-3 leading-tight">{p.title}</h3>
                  <p className="text-xs leading-[1.75] text-[#7A7368] mb-4 line-clamp-3">{p.excerpt}</p>
                  <div className="text-xs text-[#9A9188]">📅 {p.date}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Veteriner CTA */}
          <div className="mt-12 bg-[#F4EBDD] rounded-[20px] p-8 text-center">
            <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">Veteriner veya Pet Uzmanı mısınız?</h2>
            <p className="text-sm text-[#7A7368] mb-5 leading-relaxed max-w-md mx-auto">
              Uzmanlığınızı binlerce pet sahibiyle paylaşın. Platform topluluğuna katkıda bulunun.
            </p>
            <a href="mailto:icerik@patipetra.com"
              className="inline-flex bg-[#5C4A32] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#2F2622] transition-all">
              İçerik Gönder →
            </a>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
