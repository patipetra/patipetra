import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Topluluklar — Pet Sahipleri ile Buluş',
  description: 'Irk ve tür bazlı pet toplulukları.',
};

const COMMUNITIES = [
  {name:'Golden Retriever',  slug:'golden-retriever',  emoji:'🐕', cat:'Köpek', members:1240, posts:3420, img:'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'},
  {name:'Labrador',          slug:'labrador',          emoji:'🦮', cat:'Köpek', members:980,  posts:2100, img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80'},
  {name:'Husky',             slug:'husky',             emoji:'🐺', cat:'Köpek', members:756,  posts:1890, img:'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=600&q=80'},
  {name:'Alman Kurdu',       slug:'alman-kurdu',       emoji:'🐕', cat:'Köpek', members:634,  posts:1560, img:'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80'},
  {name:'British Shorthair', slug:'british-shorthair', emoji:'🐱', cat:'Kedi',  members:1560, posts:4200, img:'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=600&q=80'},
  {name:'Scottish Fold',     slug:'scottish-fold',     emoji:'😺', cat:'Kedi',  members:890,  posts:2340, img:'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=600&q=80'},
  {name:'Van Kedisi',        slug:'van-kedisi',        emoji:'🐈', cat:'Kedi',  members:670,  posts:1780, img:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'},
  {name:'Tekir',             slug:'tekir',             emoji:'🐈', cat:'Kedi',  members:1120, posts:2980, img:'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=600&q=80'},
  {name:'Muhabbet Kuşu',     slug:'muhabbet-kusu',     emoji:'🦜', cat:'Kuş',   members:540,  posts:1230, img:'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80'},
  {name:'Papağan',           slug:'papagan',           emoji:'🦚', cat:'Kuş',   members:320,  posts:890,  img:'https://images.unsplash.com/photo-1534236891069-4cd570c5571e?auto=format&fit=crop&w=600&q=80'},
  {name:'Tavşan',            slug:'tavsan',            emoji:'🐰', cat:'Tavşan',members:280,  posts:670,  img:'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80'},
  {name:'Genel Sohbet',      slug:'genel-sohbet',      emoji:'💬', cat:'Genel', members:2340, posts:6780, img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80'},
];

const CATS = ['Tümü','Köpek','Kedi','Kuş','Tavşan','Genel'];

export default function ToplulukPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">

        {/* Hero */}
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Topluluklar</div>
            <h1 className="font-serif text-[clamp(30px,5vw,56px)] font-light text-[#2F2622] mb-3">
              Pet sahipleriyle <em className="italic text-[#C9832E]">buluş</em>
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-6 font-light">
              Irk ve tür bazlı topluluklara katıl, deneyimlerini paylaş, sorular sor.
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

        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">

          {/* Öne çıkan 3 */}
          <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-4">🔥 En Aktif Topluluklar</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {COMMUNITIES.slice(0,3).map(c=>(
              <Link key={c.slug} href={`/topluluk/${c.slug}`}
                className="rounded-[20px] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all block relative group">
                <div className="h-[200px] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="font-serif text-xl font-semibold text-white mb-1">{c.name}</div>
                    <div className="flex gap-3 text-xs text-white/70">
                      <span>👥 {c.members.toLocaleString('tr-TR')} üye</span>
                      <span>📝 {c.posts.toLocaleString('tr-TR')} gönderi</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">{c.cat}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tüm topluluklar */}
          <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-4">Tüm Topluluklar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COMMUNITIES.map(c=>(
              <Link key={c.slug} href={`/topluluk/${c.slug}`}
                className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(201,131,46,.3)] transition-all block group">
                <div className="h-[120px] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                  <div className="absolute top-2 right-2 bg-white/90 text-[#5C4A32] text-[10px] font-semibold px-2 py-[2px] rounded-full">{c.cat}</div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-[#2F2622] mb-2">{c.name}</div>
                  <div className="flex gap-3 text-[11px] text-[#9A9188]">
                    <span>👥 {c.members.toLocaleString('tr-TR')}</span>
                    <span>📝 {c.posts.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Yeni topluluk kur */}
            <Link href="/topluluk/yeni"
              className="border-2 border-dashed border-[#E3D9C6] rounded-[20px] overflow-hidden flex flex-col items-center justify-center gap-3 hover:border-[#C9832E] hover:bg-[#F5EDD4] transition-all min-h-[200px] p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EDE5D3] flex items-center justify-center text-3xl">+</div>
              <div>
                <div className="font-semibold text-[#5C4A32] mb-1">Topluluk Kur</div>
                <div className="text-xs text-[#9A9188]">Admin onayından sonra yayına girer</div>
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
