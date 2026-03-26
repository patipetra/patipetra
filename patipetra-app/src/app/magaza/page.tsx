import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mağaza — Pet Ürünleri',
  description: 'Veteriner önerili pet ürünleri. Mama, ödül, bakım, taşıma ve daha fazlası.',
  alternates: { canonical: 'https://patipetra.com/magaza' },
};

const PRODUCTS = [
  { id:1, name:'Premium Yetişkin Köpek Maması',   price:499, tag:'Çok Satan', cat:'Mama',    img:'https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=600&q=80', vetRec:true  },
  { id:2, name:'Tahılsız Kedi Maması',              price:389, tag:'Önerilen',  cat:'Mama',    img:'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=600&q=80', vetRec:true  },
  { id:3, name:'Doğal Ödül Çubuğu',                price:149, tag:'Yeni',      cat:'Ödül',    img:'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80', vetRec:false },
  { id:4, name:'Konfor Taşıma Çantası',             price:699, tag:'Mağaza',    cat:'Taşıma',  img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80', vetRec:false },
  { id:5, name:'Tırnak Bakım Seti',                 price:229, tag:'Bakım',     cat:'Bakım',   img:'https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=600&q=80', vetRec:false },
  { id:6, name:'Omega-3 Balık Yağı Takviyesi',      price:319, tag:'Vet Önerili',cat:'Sağlık', img:'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=600&q=80', vetRec:true  },
  { id:7, name:'Kedi Tırmalama Evi',                price:459, tag:'Popüler',   cat:'Oyun',    img:'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80', vetRec:false },
  { id:8, name:'Köpek Harness Göğüs Tasması',       price:349, tag:'Yeni',      cat:'Aksesuar',img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80', vetRec:false },
];

const CATS = ['Tüm Ürünler','Mama','Ödül','Bakım','Taşıma','Oyun','Aksesuar','Sağlık','Vet Önerili'];

export default function MagazaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 lg:pb-0">

        {/* Hero */}
        <section className="relative pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Mağaza</div>
            <h1 className="font-serif text-[clamp(30px,5vw,56px)] font-light text-[#2F2622] mb-3">
              Petiniz için <em className="italic text-[#C9832E]">en iyisi</em>
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-6 font-light">
              Veteriner önerili ürünler, özenle seçilmiş koleksiyonlar.
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

        {/* Products */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRODUCTS.map(p=>(
              <div key={p.id} className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] overflow-hidden hover:shadow-[0_16px_40px_rgba(92,74,50,.11)] hover:-translate-y-[5px] hover:border-[rgba(201,131,46,.3)] transition-all">
                <div className="relative h-[200px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy"/>
                  <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                    <span className="text-[10px] font-semibold bg-[#5C4A32] text-white px-2 py-[3px] rounded-full">{p.tag}</span>
                    {p.vetRec&&<span className="text-[10px] font-semibold bg-[rgba(107,124,92,.9)] text-white px-2 py-[3px] rounded-full">Vet Önerili</span>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-medium tracking-[.1em] uppercase text-[#9A9188] mb-1">{p.cat}</div>
                  <div className="font-medium text-[#2F2622] leading-[1.4] mb-3 min-h-[42px]">{p.name}</div>
                  <div className="font-serif text-2xl font-semibold text-[#5C4A32] mb-3">₺{p.price.toLocaleString('tr-TR')}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/giris" className="bg-[#C9832E] text-white text-xs font-semibold text-center py-[9px] rounded-full hover:bg-[#b87523] transition-colors">Satın Al</Link>
                    <Link href="/giris" className="border-[1.5px] border-[#8B7355] text-[#5C4A32] text-xs font-semibold text-center py-[9px] rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">Detay</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div className="mt-12 bg-[#5C4A32] rounded-[20px] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-serif text-2xl font-semibold mb-2">Shopier üzerinden güvenli alışveriş</div>
              <p className="text-sm text-white/60 leading-relaxed">Tüm satın alımlar Shopier güvencesiyle gerçekleşir. Ürün bağlantılarına tıkladığınızda Shopier'e yönlendirilirsiniz.</p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/10 border border-white/20 rounded-[14px] px-6 py-3 text-sm font-medium">Shopier ile Güvenli Ödeme 🔒</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
