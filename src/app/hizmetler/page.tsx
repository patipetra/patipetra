import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Pet Hizmetleri — Kuaför, Otel, Eğitmen',
  description: 'Türkiye genelinde onaylı pet kuaför, pet otel ve pet eğitmen hizmetleri.',
};

const CATEGORIES = [
  {
    type:'groomer', label:'Pet Kuaför', icon:'✂️',
    desc:'Tıraş, banyo, tırnak kesimi ve tam bakım hizmetleri',
    img:'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    count:48, color:'from-[#C9A98C] to-[#8B7355]',
  },
  {
    type:'hotel', label:'Pet Otel', icon:'🏨',
    desc:'Güvenli ve konforlu günlük & haftalık konaklama',
    img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    count:32, color:'from-[#9EC49A] to-[#6B7C5C]',
  },
  {
    type:'trainer', label:'Pet Eğitmen', icon:'🎓',
    desc:'Temel komutlar, sosyalleşme ve davranış düzeltme',
    img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    count:24, color:'from-[#9AB0C4] to-[#5C7A8B]',
  },
];

const MOCK_SERVICES = [
  { id:'1', type:'groomer', name:'Pati Bakım Salonu',     city:'Ankara',   district:'Çankaya',  rating:4.9, reviews:87,  plan:'premium', img:'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80', price:'₺150\'den başlayan', slug:'pati-bakim-salonu' },
  { id:'2', type:'hotel',   name:'Dostlar Pet Otel',      city:'İstanbul', district:'Kadıköy',  rating:4.8, reviews:124, plan:'premium', img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80', price:'₺250/gece',        slug:'dostlar-pet-otel' },
  { id:'3', type:'trainer', name:'Ahmet Yılmaz Eğitmen',  city:'İzmir',    district:'Karşıyaka',rating:5.0, reviews:43,  plan:'premium', img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80', price:'₺300/seans',       slug:'ahmet-yilmaz-egitmen' },
  { id:'4', type:'groomer', name:'Minik Dostlar Kuaför',  city:'Bursa',    district:'Nilüfer',  rating:4.7, reviews:56,  plan:'basic',   img:'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80', price:'₺120\'den başlayan',slug:'minik-dostlar-kuafor' },
  { id:'5', type:'hotel',   name:'Konforlu Pet Otel',     city:'Ankara',   district:'Çankaya',  rating:4.6, reviews:38,  plan:'basic',   img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80', price:'₺200/gece',        slug:'konforlu-pet-otel' },
  { id:'6', type:'trainer', name:'Selin Kaya Pet Trainer',city:'İstanbul', district:'Beşiktaş', rating:4.8, reviews:61,  plan:'premium', img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80', price:'₺350/seans',       slug:'selin-kaya-trainer' },
];

const TYPE_COLOR: Record<string,string> = {
  groomer:'bg-[rgba(201,131,46,.1)] text-[#C9832E]',
  hotel:  'bg-[rgba(107,124,92,.1)] text-[#6B7C5C]',
  trainer:'bg-[rgba(92,122,139,.1)] text-[#5C7A8B]',
};
const TYPE_LABEL: Record<string,string> = {
  groomer:'Pet Kuaför', hotel:'Pet Otel', trainer:'Pet Eğitmen'
};

export default function HizmetlerPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">

        {/* Hero */}
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Pet Hizmetleri</div>
            <h1 className="font-serif text-[clamp(30px,5vw,56px)] font-light text-[#2F2622] mb-3">
              Petiniz için <em className="italic text-[#C9832E]">profesyonel</em> hizmetler
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-8 font-light">
              Onaylı pet kuaförler, oteller ve eğitmenler — tümü tek platformda.
            </p>
          </div>
        </section>

        {/* Kategoriler */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">Hizmet Kategorileri</h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {CATEGORIES.map(c=>(
              <Link key={c.type} href={`/hizmetler?tur=${c.type}`}
                className="rounded-[22px] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all block group relative">
                <div className="h-[220px] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="text-3xl mb-2">{c.icon}</div>
                    <div className="font-serif text-2xl font-semibold text-white mb-1">{c.label}</div>
                    <div className="text-xs text-white/70 leading-relaxed mb-3">{c.desc}</div>
                    <div className="text-[11px] text-white/50">{c.count} hizmet sağlayıcı</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Öne çıkan hizmetler */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl font-semibold text-[#2F2622]">Öne Çıkan Hizmetler</h2>
            <div className="flex gap-2">
              {['Tümü','Kuaför','Otel','Eğitmen'].map((f,i)=>(
                <button key={f} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${i===0?'bg-[#5C4A32] text-white border-[#5C4A32]':'bg-white text-[#5C4A32] border-[rgba(196,169,107,.25)] hover:border-[#8B7355]'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {MOCK_SERVICES.map(s=>(
              <Link key={s.id} href={`/hizmetler/${s.slug}`}
                className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(201,131,46,.3)] transition-all block">
                <div className="h-[160px] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${TYPE_COLOR[s.type]||'bg-white/90 text-[#5C4A32]'}`}>
                      {TYPE_LABEL[s.type]||s.type}
                    </span>
                    {s.plan==='premium'&&<span className="text-[10px] font-semibold bg-[rgba(201,131,46,.9)] text-white px-2 py-1 rounded-full">✦ Premium</span>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-serif text-lg font-semibold text-[#2F2622] mb-1">{s.name}</div>
                  <div className="text-xs text-[#7A7368] mb-2">📍 {s.city}, {s.district}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#5C4A32]">
                      <span className="text-[#C9832E]">⭐ {s.rating}</span>
                      <span className="text-[#9A9188]">({s.reviews} yorum)</span>
                    </div>
                    <div className="text-xs font-semibold text-[#C9832E]">{s.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* İşletme başvurusu CTA */}
          <div className="bg-[#2F2622] rounded-[24px] p-8 sm:p-12 text-center">
            <div className="text-4xl mb-4">🏪</div>
            <h2 className="font-serif text-[clamp(22px,3.5vw,36px)] font-light text-white mb-3">
              İşletmenizi platforma ekleyin
            </h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-[480px] mx-auto mb-8">
              Binlerce pet sahibine ulaşın. Pet kuaför, otel veya eğitmen olarak Patıpetra'da yerinizi alın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {[
                {icon:'✂️', label:'Pet Kuaför', price:'₺299/ay'},
                {icon:'🏨', label:'Pet Otel',   price:'₺399/ay'},
                {icon:'🎓', label:'Pet Eğitmen',price:'₺299/ay'},
              ].map(p=>(
                <div key={p.label} className="bg-white/10 border border-white/20 rounded-[14px] px-5 py-3 text-center">
                  <div className="text-2xl mb-1">{p.icon}</div>
                  <div className="text-sm font-semibold text-white">{p.label}</div>
                  <div className="text-xs text-[#E8B86D] mt-1">{p.price}</div>
                </div>
              ))}
            </div>
            <Link href="/hizmetler/basvur"
              className="inline-flex items-center bg-[#C9832E] text-white text-[15px] font-semibold px-8 py-3 rounded-full hover:bg-[#b87523] transition-all">
              Hemen Başvur →
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
