'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, logout } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import Logo from '@/components/layout/Logo';
import type { User } from 'firebase/auth';

const NAV = [
  { id:'dashboard',   icon:'🏠', label:'Dashboard',        href:'/panel'              },
  { id:'petlerim',    icon:'🐾', label:'Pet Pasaportlarım', href:'/panel/petlerim'     },
  { id:'ilanlarim',   icon:'📢', label:'İlanlarım',         href:'/panel/ilanlarim'    },
  { id:'mesajlar',    icon:'💬', label:'Mesajlarım',        href:'/panel/mesajlar' },
  { id:'bildirimler', icon:'🔔', label:'Bildirimler',       href:'/panel/bildirimler' },
  { id:'profil',      icon:'👤', label:'Profilim',          href:'/panel/profil'       },
  { id:'premium',     icon:'✦',  label:"Premium'a Geç",     href:'/panel/premium'      },
  { id:'ayarlar',     icon:'⚙',  label:'Ayarlar',           href:'/panel/ayarlar'      },
];

async function getFavorites(userId: string) {
  try {
    const { getDocs, collection, query, where, orderBy } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const snap = await getDocs(query(collection(db,'favorites'), where('userId','==',userId), orderBy('createdAt','desc')));
    return snap.docs.map(d=>({id:d.id,...d.data()}));
  } catch { return []; }
}

// Pet verisini gerçekten çek
async function getUserPetCount(userId: string): Promise<number> {
  try {
    const { getDocs, collection, query, where } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const snap = await getDocs(query(collection(db,'pets'), where('ownerId','==',userId)));
    return snap.size;
  } catch { return 0; }
}

export default function PanelPage() {
  const router = useRouter();
  const [user,        setUser]        = useState<User|null>(null);
  const [admin,       setAdmin]       = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push('/giris'); return; }
      setUser(u);
      const adminCheck = await isAdmin(u.uid);
      setAdmin(adminCheck);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F2EA]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[190] lg:hidden" onClick={() => setSidebarOpen(false)}/>}

      <aside className={`fixed top-0 left-0 bottom-0 w-[260px] bg-[#2F2622] z-[200] flex flex-col overflow-y-auto transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-5 border-b border-white/[.07]">
          <Link href="/"><Logo dark height={38}/></Link>
        </div>
        <div className="px-4 py-4 border-b border-white/[.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
            {user?.photoURL
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={user.photoURL} alt="" className="w-full h-full object-cover"/>
              : '🧑'
            }
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.displayName || user?.email?.split('@')[0]}</div>
            <div className={`text-[10px] tracking-[.1em] uppercase mt-[2px] ${admin ? 'text-red-400 font-bold' : 'text-[#E8B86D]'}`}>
              {admin ? '🔐 Admin' : '✦ Ücretsiz Plan'}
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3">
          {NAV.map(item => (
            <Link key={item.id} href={item.href} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-[10px] rounded-[12px] text-sm mb-[2px] text-white/60 hover:bg-white/[.07] hover:text-white/90 transition-all">
              <span className="w-[18px] text-center text-[15px] flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.id==='bildirimler' && unreadNotif > 0 && <span className="bg-[#C9832E] text-white text-[10px] font-bold px-[7px] py-[2px] rounded-full">{unreadNotif}</span>}
              {item.id==='mesajlar' && unreadMsg > 0 && <span className="bg-[#C9832E] text-white text-[10px] font-bold px-[7px] py-[2px] rounded-full">{unreadMsg}</span>}
            </Link>
          ))}

          {/* Admin link - sadece adminlere görünür */}
          {admin && (
            <div className="mt-3 pt-3 border-t border-white/[.07]">
              <Link href="/admin" className="flex items-center gap-3 px-3 py-[10px] rounded-[12px] text-sm bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                <span className="text-[15px]">🔐</span>
                <span className="flex-1 font-semibold">Admin Paneli</span>
                <span className="text-[10px]">→</span>
              </Link>
            </div>
          )}
        </nav>
        <div className="px-3 pb-3 border-t border-white/[.07] pt-3">
          <div className="bg-gradient-to-br from-[rgba(201,131,46,.25)] to-[rgba(201,131,46,.1)] border border-[rgba(201,131,46,.3)] rounded-[14px] p-4 mb-2">
            <div className="font-serif text-base font-semibold text-[#E8B86D] mb-1">Premium'u keşfet ✦</div>
            <div className="text-[11px] text-white/45 mb-3">Sınırsız pet, özel rehberler</div>
            <Link href="/panel/premium" className="block w-full text-center bg-[#C9832E] text-[#2F2622] text-xs font-semibold py-2 rounded-[9px] hover:bg-[#E8B86D] transition-colors">
              Planları Gör →
            </Link>
          </div>
          <button onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] text-sm text-white/50 hover:bg-white/[.07] hover:text-white/80 transition-all">
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[260px]">
        <header className="h-16 bg-[rgba(247,242,234,.95)] backdrop-blur-[16px] border-b border-[rgba(196,169,107,.15)] sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-9 h-9 rounded-[10px] flex flex-col items-center justify-center gap-[5px] hover:bg-[#EDE5D3]" onClick={() => setSidebarOpen(v=>!v)}>
              <span className="w-[18px] h-[1.5px] bg-[#2F2622] rounded"/>
              <span className="w-[18px] h-[1.5px] bg-[#2F2622] rounded"/>
              <span className="w-[18px] h-[1.5px] bg-[#2F2622] rounded"/>
            </button>
            <h1 className="font-serif text-xl font-semibold text-[#2F2622]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {admin && (
              <Link href="/admin" className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-full hover:bg-red-500/20 transition-all">
                🔐 Admin Paneli
              </Link>
            )}
            <Link href="/panel/mesajlar" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[17px] text-[#7A7368] hover:bg-[#EDE5D3] relative">
              💬<span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-[#C9832E]"/>
            </Link>
            <Link href="/panel/bildirimler" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[17px] text-[#7A7368] hover:bg-[#EDE5D3]">🔔</Link>
            <Link href="/panel/profil" className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[22px] hover:bg-[#EDE5D3]">🧑</Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[1200px] w-full">
          {admin && (
            <div className="bg-red-50 border border-red-200 rounded-[16px] p-4 mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-red-700 mb-1">🔐 Admin hesabı ile giriş yaptınız</div>
                <div className="text-xs text-red-500">Tüm site yönetimi için admin paneline geçin.</div>
              </div>
              <Link href="/admin" className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition-colors flex-shrink-0">
                Admin Paneline Git →
              </Link>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold text-[#2F2622]">
              Merhaba, {user?.displayName?.split(' ')[0] || 'Hoş geldiniz'} 👋
            </h2>
            <p className="text-sm text-[#7A7368] mt-1">Petlerinizin durumuna genel bakış</p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
            {[
              {i:'🐾',l:'Pet Profilim',  v:'0',t:'Pet ekle →',      c:'rgba(201,131,46,.1)', href:'/panel/petlerim'  },
              {i:'📢',l:'Aktif İlan',    v:'0',t:'İlan ver →',      c:'rgba(107,124,92,.1)', href:'/panel/ilanlarim' },
              {i:'💬',l:'Yeni Mesaj',    v:'0',t:'Mesajlara git →', c:'rgba(193,123,92,.1)', href:'/panel/mesajlar'  },
              {i:'💉',l:'Yaklaşan Aşı', v:'0',t:'Pet pasaport →',  c:'rgba(201,131,46,.12)',href:'/panel/petlerim'  },
            ].map(s => (
              <Link key={s.l} href={s.href} className="bg-white rounded-[18px] p-5 border border-[rgba(196,169,107,.12)] hover:shadow-lg hover:-translate-y-1 transition-all block">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-lg mb-3" style={{background:s.c}}>{s.i}</div>
                <div className="font-serif text-[28px] font-semibold text-[#2F2622] leading-none">{s.v}</div>
                <div className="text-xs text-[#7A7368] mt-1">{s.l}</div>
                <div className="text-[11px] text-[#C9832E] mt-[6px]">{s.t}</div>
              </Link>
            ))}
          </div>

          <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-3">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {[
              {l:'+ İlan Ver',     href:'/panel/ilanlarim', s:0},
              {l:'+ Pet Ekle',     href:'/panel/petlerim',  s:1},
              {l:'İlanlarım →',    href:'/panel/ilanlarim', s:2},
              {l:'Pet Pasaport →', href:'/panel/petlerim',  s:2},
            ].map((btn,i) => (
              <Link key={i} href={btn.href}
                className={`py-4 rounded-[14px] text-sm font-medium text-center transition-all hover:-translate-y-[1px] ${btn.s===0?'bg-[#C9832E] text-white hover:bg-[#b87523]':btn.s===1?'bg-[#5C4A32] text-white hover:bg-[#2F2622]':'bg-white text-[#5C4A32] border border-[#8B7355] hover:bg-[#5C4A32] hover:text-white'}`}>
                {btn.l}
              </Link>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] p-5">
              <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">🐾 Pet Pasaport</h3>
              <p className="text-sm text-[#7A7368] leading-relaxed mb-4">Petinizin aşı ve sağlık geçmişini dijital olarak takip edin.</p>
              <Link href="/panel/petlerim" className="text-sm font-medium text-[#C9832E] hover:underline">Oluştur →</Link>
            </div>
            <div className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] p-5">
              <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">📢 İlan Ver</h3>
              <p className="text-sm text-[#7A7368] leading-relaxed mb-4">Sahiplendirme, geçici yuva veya kayıp ilanı — admin onayından sonra yayına girer.</p>
              <Link href="/panel/ilanlarim" className="text-sm font-medium text-[#C9832E] hover:underline">İlan Oluştur →</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
