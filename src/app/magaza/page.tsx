'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CATS = ['Tümü','Mama','Aksesuar','Oyuncak','Bakım','Sağlık','Kıyafet','Kafes & Taşıyıcı','Diğer'];

export default function MagazaPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [cat,      setCat]      = useState('Tümü');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db,'products'), where('active','==',true), orderBy('createdAt','desc')));
        setProducts(snap.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = products.filter(p => {
    if (cat !== 'Tümü' && p.category !== cat) return false;
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Patıpetra Mağaza</div>
            <h1 className="font-serif text-[clamp(32px,6vw,56px)] font-light text-[#2F2622] mb-3">
              Petiniz için <em className="italic text-[#C9832E]">en iyisi</em>
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ürün ara…"
                className="px-4 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm text-[#5C4A32] focus:outline-none focus:border-[#C9832E] transition-all min-w-[200px]"/>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
              {CATS.map(c=>(
                <button key={c} onClick={()=>setCat(c)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all ${cat===c?'bg-[#5C4A32] text-white border-[#5C4A32]':'bg-white text-[#5C4A32] border-[rgba(196,169,107,.25)] hover:border-[#8B7355]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">
                {products.length===0?'Mağaza yakında açılıyor!':'Ürün bulunamadı'}
              </h3>
              <p className="text-sm text-[#7A7368]">
                {products.length===0?'Ürünlerimizi hazırlıyoruz, yakında burada olacak.':'Farklı kategoriler deneyin.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map(p=>(
                <div key={p.id} className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="h-[200px] bg-[#F7F2EA] flex items-center justify-center overflow-hidden">
                    {p.img
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.img} alt={p.name} className="w-full h-full object-cover"/>
                      : <span className="text-5xl">🛍️</span>
                    }
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] text-[#C9832E] font-semibold uppercase tracking-[.1em] mb-1">{p.category}</div>
                    <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-2 leading-tight">{p.name}</h3>
                    {p.description && <p className="text-xs text-[#7A7368] mb-3 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {p.salePrice > 0 ? (
                          <>
                            <span className="font-serif text-lg font-semibold text-[#C9832E]">₺{p.salePrice}</span>
                            <span className="text-xs text-[#9A9188] line-through">₺{p.price}</span>
                          </>
                        ) : (
                          <span className="font-serif text-lg font-semibold text-[#2F2622]">₺{p.price}</span>
                        )}
                      </div>
                      {p.stock > 0 ? (
                        <span className="text-[10px] text-green-600 bg-green-50 px-2 py-[2px] rounded-full">Stokta</span>
                      ) : (
                        <span className="text-[10px] text-red-500 bg-red-50 px-2 py-[2px] rounded-full">Tükendi</span>
                      )}
                    </div>
                    <button className="w-full mt-3 py-2 rounded-full bg-[#5C4A32] text-white text-sm font-medium hover:bg-[#2F2622] transition-all">
                      Sepete Ekle
                    </button>
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
