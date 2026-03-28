'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthChange, logout } from '@/lib/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Logo from './Logo';

import type { User } from 'firebase/auth';

const LINKS = [
  { label:'Topluluklar', href:'/topluluk'     },
  { label:'İlanlar',     href:'/ilanlar'      },
  { label:'Veterinerler',href:'/veterinerler' },
  { label:'Hizmetler',   href:'/hizmetler'    },
  { label:'Mağaza',      href:'/magaza'       },
  { label:'Blog',        href:'/blog'         },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [open,        setOpen]        = useState(false);
  const [user,        setUser]        = useState<User|null>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => { const u = onAuthChange(setUser); return () => u(); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 h-[68px] z-[900] transition-all duration-300 ${scrolled ? 'bg-[rgba(247,242,234,.96)] backdrop-blur-[20px] shadow-[0_1px_0_rgba(201,131,46,.14)]' : 'bg-[rgba(247,242,234,.85)] backdrop-blur-[10px]'}`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 h-full flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Logo dark={false} height={44} linkTo="/" sizeKey="navbarHeight"/>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-5">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-[12px] font-medium tracking-wide uppercase transition-colors ${pathname===l.href?'text-[#C9832E]':'text-[#3D3A34] hover:text-[#C9832E]'}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Sağ butonlar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            

            {user ? (
              <>
                <Link href="/panel"
                  className="hidden sm:inline-flex text-[13px] font-medium border border-[#8B7355] text-[#5C4A32] px-4 py-[7px] rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">
                  Dashboard
                </Link>
                <button onClick={async () => { await logout(); router.push('/'); }}
                  className="text-[13px] text-[#7A7368] px-3 py-[7px] rounded-full hover:text-[#2F2622] transition-colors">
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/giris"
                  className="hidden sm:inline-flex text-[13px] font-medium border border-[#8B7355] text-[#5C4A32] px-4 py-[7px] rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">
                  Giriş Yap
                </Link>
                <Link href="/kayit"
                  className="inline-flex text-[13px] font-semibold bg-[#C9832E] text-white px-4 py-[7px] rounded-full hover:bg-[#b87523] transition-colors">
                  Üye Ol
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setOpen(v=>!v)} aria-label="Menü"
              className="lg:hidden flex flex-col gap-[5px] w-7 ml-1 p-1">
              <span className={`block h-[1.5px] bg-[#2F2622] rounded transition-transform duration-300 ${open?'translate-y-[6.5px] rotate-45':''}`}/>
              <span className={`block h-[1.5px] bg-[#2F2622] rounded transition-opacity duration-300 ${open?'opacity-0':''}`}/>
              <span className={`block h-[1.5px] bg-[#2F2622] rounded transition-transform duration-300 ${open?'-translate-y-[6.5px] -rotate-45':''}`}/>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 top-[68px] bg-[#F7F2EA] z-[850] flex flex-col p-8 transition-transform duration-300 lg:hidden ${open?'translate-x-0':'translate-x-full'}`}>
        {LINKS.map(l => (
          <Link key={l.href} href={l.href}
            className="font-serif text-[26px] font-light text-[#2F2622] py-4 border-b border-[#E3D9C6]">
            {l.label}
          </Link>
        ))}
        <div className="mt-6 flex flex-col gap-3">
          {user ? (
            <>
              <Link href="/panel" className="font-serif text-[24px] font-light text-[#C9832E]">Dashboard →</Link>
              <button onClick={async()=>{await logout();router.push('/');}} className="text-left font-serif text-[20px] text-[#7A7368]">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/giris" className="font-serif text-[26px] font-light text-[#2F2622]">Giriş Yap</Link>
              <Link href="/kayit" className="font-serif text-[26px] font-light text-[#C9832E]">Ücretsiz Üye Ol →</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-[800] lg:hidden bg-[rgba(253,251,247,.96)] backdrop-blur-[16px] border-t border-[rgba(201,131,46,.12)] px-3 py-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
        <div className="flex max-w-[480px] mx-auto bg-white rounded-[20px] p-[5px] shadow-[0_4px_20px_rgba(92,74,50,.1)]">
          {[
            {icon:'🏠', label:'Ana',      href:'/'},
            {icon:'📢', label:'İlan',     href:'/ilanlar'},
            {icon:'💬', label:'Topluluk', href:'/topluluk'},
            {icon:'🩺', label:'Vet',      href:'/veterinerler'},
            {icon:'👤', label:'Profil',   href:user?'/panel':'/giris'},
          ].map(t => (
            <Link key={t.href} href={t.href}
              className={`flex flex-col items-center gap-[3px] flex-1 px-1 py-2 rounded-[14px] text-[9px] font-semibold transition-all ${pathname===t.href?'bg-[#5C4A32] text-white':'text-[#8B7355]'}`}>
              <span className="text-lg">{t.icon}</span>{t.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
