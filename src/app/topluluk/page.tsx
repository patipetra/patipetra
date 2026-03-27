import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Topluluklar — Pet Sahipleri ile Buluş',
  description: 'Irk ve tür bazlı pet toplulukları.',
};

const COMMUNITIES = [
  {name:'Golden Retriever',   slug:'golden-retriever',   emoji:'🐕',  cat:'Köpek', members:1240, posts:3420},
  {name:'Labrador',           slug:'labrador',           emoji:'🦮',  cat:'Köpek', members:980,  posts:2100},
  {name:'Husky',              slug:'husky',              emoji:'🐺',  cat:'Köpek', members:756,  posts:1890},
  {name:'Alman Kurdu',        slug:'alman-kurdu',        emoji:'🐕',  cat:'Köpek', members:634,  posts:1560},
  {name:'British Shorthair',  slug:'british-shorthair',  emoji:'🐱',  cat:'Kedi',  members:1560, posts:4200},
  {name:'Scottish Fold',      slug:'scottish-fold',      emoji:'😺',  cat:'Kedi',  members:890,  posts:2340},
  {name:'Van Kedisi',         slug:'van-kedisi',         emoji:'🐈',  cat:'Kedi',  members:670,  posts:1780},
  {name:'Tekir',              slug:'tekir',              emoji:'🐈',  cat:'Kedi',  members:1120, posts:2980},
  {name:'Muhabbet Kusu',      slug:'muhabbet-kusu',      emoji:'🦜',  cat:'Kus',   members:540,  posts:1230},
  {name:'Papagan',            slug:'papagan',            emoji:'🦚',  cat:'Kus',   members:320,  posts:890 },
  {name:'Tavsan',             slug:'tavsan',             emoji:'🐰',  cat:'Tavsan',members:280,  posts:670 },
  {name:'Genel Sohbet',       slug:'genel-sohbet',       emoji:'💬',  cat:'Genel', members:2340, posts:6780},
];

export default function ToplulukPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0">
        <section className="pt-[108px] pb-10 bg-[#F7F2EA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Topluluklar</div>
            <h1 className="font-serif text-[clamp(30px,5vw,56px)] font-light text-[#2F2622] mb-3">
              Pet sahipleriyle <em className="italic text-[#C9832E]">buluş</em>
            </h1>
            <p className="text-[clamp(14px,1.8vw,16px)] leading-[1.85] text-[#7A7368] max-w-[500px] mb-6 font-light">
              Irk ve tür bazlı topluluklara katıl, deneyimlerini paylaş, sorular sor.
            </p>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-4">En Aktif Topluluklar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {COMMUNITIES.slice(0,3).map(c=>(
              <Link key={c.slug} href={`/topluluk/${c.slug}`}
                className="bg-[#5C4A32] rounded-[20px] p-6 hover:bg-[#2F2622] transition-all hover:-translate-y-1 block">
                <div className="text-4xl mb-3">{c.emoji}</div>
                <div className="font-serif text-xl font-semibold text-white mb-1">{c.name}</div>
                <div className="text-xs text-white/50 mb-4">{c.cat} Toplulugu</div>
                <div className="flex gap-4 text-xs text-white/40">
                  <span>Uyeler: {c.members.toLocaleString('tr-TR')}</span>
                  <span>Gonderiler: {c.posts.toLocaleString('tr-TR')}</span>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-4">Tum Topluluklar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COMMUNITIES.map(c=>(
              <Link key={c.slug} href={`/topluluk/${c.slug}`}
                className="bg-white rounded-[20px] border border-[rgba(201,131,46,.1)] p-5 hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(201,131,46,.3)] transition-all block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F7F2EA] flex items-center justify-center text-2xl flex-shrink-0">{c.emoji}</div>
                  <div>
                    <div className="font-semibold text-[#2F2622] leading-tight">{c.name}</div>
                    <div className="text-[11px] text-[#9A9188]">{c.cat}</div>
                  </div>
                </div>
                <div className="flex gap-3 text-[11px] text-[#9A9188]">
                  <span>Uyeler: {c.members.toLocaleString('tr-TR')}</span>
                  <span>Gonderi: {c.posts.toLocaleString('tr-TR')}</span>
                </div>
              </Link>
            ))}
            <Link href="/topluluk/yeni"
              className="border-2 border-dashed border-[#E3D9C6] rounded-[20px] p-5 flex flex-col items-center justify-center gap-2 hover:border-[#C9832E] hover:bg-[#F5EDD4] transition-all min-h-[120px]">
              <div className="text-3xl">+</div>
              <div className="text-sm font-medium text-[#7A7368] text-center">Yeni Topluluk Kur</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
