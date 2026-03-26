import Link from 'next/link';
import Logo from './Logo';

const COLS = [
  { title:'Platform',  links:[{l:'Ana Sayfa',h:'/'},{l:'Keşfet',h:'/#kesfet'},{l:'İlanlar',h:'/ilanlar'},{l:'Veterinerler',h:'/veterinerler'},{l:'Mağaza',h:'/magaza'}] },
  { title:'Üyelik',    links:[{l:'Giriş Yap',h:'/giris'},{l:'Kayıt Ol',h:'/kayit'},{l:'Premium ✦',h:'/#premium'},{l:'Dashboard',h:'/panel'},{l:'Destek',h:'/destek'}] },
  { title:'İçerik',    links:[{l:'Pet Rehberi',h:'/blog'},{l:'Veteriner Blog',h:'/blog/veteriner'},{l:'Sahiplendirme',h:'/ilanlar'},{l:'SSS',h:'/sss'},{l:'KVKK',h:'/kvkk'}] },
];

export default function Footer() {
  return (
    <footer className="bg-[#2F2622] pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/"><Logo dark height={40} /></Link>
            <p className="text-sm leading-relaxed text-white/40 max-w-[280px] mt-4">Pet profili, sahiplendirme, veteriner ve mağaza deneyimini tek çatı altında sunar.</p>
            <div className="flex gap-2 mt-4">
              {['𝕏','📷','▶','▶'].map((i,idx) => (
                <button key={idx} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm text-white/50 hover:bg-[rgba(201,131,46,.15)] hover:border-[rgba(201,131,46,.3)] hover:text-[#E8B86D] transition-all">
                  {i}
                </button>
              ))}
            </div>
          </div>
          {COLS.map(c => (
            <nav key={c.title} aria-label={c.title}>
              <h5 className="text-[10px] font-medium tracking-[.14em] uppercase text-white/30 mb-4">{c.title}</h5>
              <ul className="flex flex-col gap-[10px]">
                {c.links.map(l => (
                  <li key={l.h}><Link href={l.h} className="text-sm text-white/55 hover:text-[#E8B86D] transition-colors">{l.l}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-white/[.07] pt-6 flex flex-wrap justify-between items-center gap-3">
          <p className="text-xs text-white/25">© {new Date().getFullYear()} Patıpetra. Tüm hakları saklıdır.</p>
          <nav className="flex flex-wrap gap-4">
            {[['Gizlilik','/gizlilik'],['Kullanım Koşulları','/kullanim'],['KVKK','/kvkk']].map(([l,h])=>(
              <Link key={h} href={h} className="text-xs text-white/25 hover:text-white/55 transition-colors">{l}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
