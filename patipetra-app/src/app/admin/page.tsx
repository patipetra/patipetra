'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, logout } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import type { User } from 'firebase/auth';

// Admin sayfaları
const NAV = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard'          },
  { id: 'users',        icon: '👥', label: 'Kullanıcılar'        },
  { id: 'listings',     icon: '📢', label: 'İlan Moderasyonu'    },
  { id: 'vets',         icon: '🩺', label: 'Veteriner Onaylama'  },
  { id: 'blog',         icon: '📝', label: 'Blog Yönetimi'       },
  { id: 'products',     icon: '🛍', label: 'Ürün Yönetimi'       },
  { id: 'premium',      icon: '✦',  label: 'Premium Planlar'     },
  { id: 'settings',     icon: '⚙',  label: 'Site Ayarları'       },
];

export default function AdminPage() {
  const router = useRouter();
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) {
        router.push('/giris?redirect=/admin');
        return;
      }
      // Admin kontrolü
      const admin = await isAdmin(u.uid);
      if (!admin) {
        router.push('/');
        return;
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <div className="text-white/50 text-sm mb-4">Admin doğrulanıyor…</div>
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin mx-auto"/>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0f0f1a]">

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[190] lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[240px] bg-[#1a1a2e] z-[200] flex flex-col border-r border-white/[.06] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-5 border-b border-white/[.06]">
          <div className="text-[10px] font-semibold tracking-[.2em] uppercase text-white/30 mb-1">Patıpetra</div>
          <div className="text-lg font-semibold text-white">Admin Paneli</div>
        </div>

        <div className="px-4 py-3 border-b border-white/[.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-base">🔐</div>
            <div>
              <div className="text-sm font-medium text-white truncate max-w-[140px]">{user?.email?.split('@')[0]}</div>
              <div className="text-[10px] text-red-400 font-semibold tracking-[.1em] uppercase">Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm font-normal transition-all text-left mb-[2px] ${
                active === item.id
                  ? 'bg-[#C9832E]/20 text-[#E8B86D] font-medium'
                  : 'text-white/50 hover:bg-white/[.05] hover:text-white/80'
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[.06]">
          <a href="/" className="flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm text-white/40 hover:bg-white/[.05] hover:text-white/70 transition-all mb-1">
            <span>🌐</span> Siteye Git
          </a>
          <button onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm text-white/40 hover:bg-white/[.05] hover:text-white/70 transition-all">
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-[240px]">
        {/* Topbar */}
        <header className="h-14 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/[.06] sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-8 h-8 rounded-lg flex flex-col items-center justify-center gap-[4px]"
              onClick={() => setSidebarOpen(v => !v)}>
              <span className="w-[16px] h-[1.5px] bg-white/60 rounded"/>
              <span className="w-[16px] h-[1.5px] bg-white/60 rounded"/>
              <span className="w-[16px] h-[1.5px] bg-white/60 rounded"/>
            </button>
            <h1 className="text-base font-semibold text-white">
              {NAV.find(n => n.id === active)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-xs text-white/40">Sistem aktif</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          {active === 'dashboard' && <AdminDashboard />}
          {active === 'users'     && <UsersView />}
          {active === 'listings'  && <ListingsModView />}
          {active === 'vets'      && <VetsView />}
          {active !== 'dashboard' && active !== 'users' && active !== 'listings' && active !== 'vets' && (
            <ComingSoon icon={NAV.find(n=>n.id===active)?.icon||'🔧'} title={NAV.find(n=>n.id===active)?.label||''} />
          )}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function AdminDashboard() {
  const stats = [
    { icon:'👥', label:'Toplam Kullanıcı', value:'1,284',  change:'+48 bu hafta',  color:'rgba(201,131,46,.15)' },
    { icon:'📢', label:'Aktif İlan',       value:'312',    change:'+12 bugün',     color:'rgba(107,124,92,.15)' },
    { icon:'🩺', label:'Veteriner',        value:'89',     change:'14 onay bekliyor', color:'rgba(193,123,92,.15)' },
    { icon:'💰', label:'Premium Üye',      value:'156',    change:'+8 bu ay',      color:'rgba(201,131,46,.12)' },
  ];

  const recentActions = [
    { type:'İlan', text:'Yeni sahiplendirme ilanı onay bekliyor', time:'2 dk önce', color:'text-[#C9832E]' },
    { type:'Kullanıcı', text:'Yeni üye kaydı: merve@email.com', time:'15 dk önce', color:'text-[#6B7C5C]' },
    { type:'Vet', text:'Dr. Ahmet Yılmaz profil güncellemesi', time:'32 dk önce', color:'text-blue-400' },
    { type:'İlan', text:'Spam şikayeti: ilan #4521', time:'1 saat önce', color:'text-red-400' },
    { type:'Premium', text:'Yeni Plus Premium aboneliği', time:'2 saat önce', color:'text-[#C9832E]' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-1">Genel Bakış</h2>
        <p className="text-sm text-white/40">Son güncelleme: {new Date().toLocaleString('tr-TR')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="rounded-[16px] p-4 border border-white/[.06]" style={{background: s.color}}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/50 mt-1">{s.label}</div>
            <div className="text-[11px] text-[#C9832E] mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-base font-semibold text-white mb-4">Son Aktiviteler</h3>
        <div className="flex flex-col gap-3">
          {recentActions.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-white/[.04] last:border-0">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full bg-white/[.06] ${a.color}`}>{a.type}</span>
              <span className="text-sm text-white/60 flex-1">{a.text}</span>
              <span className="text-[11px] text-white/30 flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Users View ────────────────────────────────────────────────────────────────
function UsersView() {
  const users = [
    { name:'Ahmet Yılmaz', email:'ahmet@email.com', role:'user',  plan:'free',    status:'active',  joined:'26 Mar 2026' },
    { name:'Merve Demir',  email:'merve@email.com', role:'user',  plan:'plus',    status:'active',  joined:'25 Mar 2026' },
    { name:'Dr. Burak',    email:'burak@email.com', role:'vet',   plan:'clinic',  status:'active',  joined:'20 Mar 2026' },
    { name:'Ali Kaya',     email:'ali@email.com',   role:'user',  plan:'free',    status:'banned',  joined:'15 Mar 2026' },
  ];

  const roleColor: Record<string,string> = {
    user: 'text-white/50', vet: 'text-blue-400', admin: 'text-red-400'
  };
  const planColor: Record<string,string> = {
    free: 'text-white/30', plus: 'text-[#C9832E]', clinic: 'text-[#6B7C5C]', standard: 'text-blue-400'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-white">Kullanıcılar</h2>
        <div className="flex gap-2">
          <input placeholder="Ara…" className="px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9832E] transition-all w-48"/>
          <select className="px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-sm text-white/60 focus:outline-none cursor-pointer">
            <option>Tüm roller</option>
            <option>user</option><option>vet</option><option>admin</option>
          </select>
        </div>
      </div>
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[.06]">
              {['Ad Soyad','E-posta','Rol','Plan','Durum','Kayıt','İşlem'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold tracking-[.12em] uppercase text-white/30">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b border-white/[.04] hover:bg-white/[.02] transition-colors">
                <td className="px-4 py-3 text-sm text-white font-medium">{u.name}</td>
                <td className="px-4 py-3 text-sm text-white/50">{u.email}</td>
                <td className="px-4 py-3 text-sm"><span className={`font-semibold ${roleColor[u.role]}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-sm"><span className={`font-semibold ${planColor[u.plan]}`}>{u.plan}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                    {u.status === 'active' ? 'Aktif' : 'Banlı'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-white/30">{u.joined}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="text-[10px] px-2 py-1 rounded bg-white/[.06] text-white/50 hover:bg-white/[.12] transition-colors">Düzenle</button>
                    <button className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      {u.status === 'active' ? 'Banla' : 'Aç'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Listings Moderation ────────────────────────────────────────────────────────
function ListingsModView() {
  const listings = [
    { title:'Golden Retriever sahiplendirme', user:'Ahmet Y.', city:'Ankara', status:'pending', date:'26 Mar' },
    { title:'Tekir yavru × 4',               user:'Merve D.', city:'İzmir',  status:'pending', date:'26 Mar' },
    { title:'British SH erkek',              user:'Ali K.',   city:'İstanbul',status:'reported',date:'25 Mar' },
    { title:'Labrador geçici yuva',          user:'Selin A.', city:'Bursa',  status:'active',  date:'24 Mar' },
  ];

  const statusStyle: Record<string,string> = {
    pending:  'bg-[rgba(201,131,46,.15)] text-[#C9832E]',
    active:   'bg-green-500/15 text-green-400',
    reported: 'bg-red-500/15 text-red-400',
    rejected: 'bg-white/[.06] text-white/40',
  };
  const statusLabel: Record<string,string> = {
    pending:'Bekliyor', active:'Aktif', reported:'Şikayet', rejected:'Reddedildi'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-white">İlan Moderasyonu</h2>
        <div className="flex gap-2 text-sm">
          <span className="bg-[rgba(201,131,46,.15)] text-[#C9832E] px-3 py-1 rounded-full">2 Bekliyor</span>
          <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-full">1 Şikayet</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {listings.map((l, i) => (
          <div key={i} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white mb-1">{l.title}</div>
              <div className="text-xs text-white/40">{l.user} · {l.city} · {l.date}</div>
            </div>
            <span className={`text-[10px] font-semibold px-3 py-1 rounded-full flex-shrink-0 ${statusStyle[l.status]}`}>
              {statusLabel[l.status]}
            </span>
            <div className="flex gap-2">
              {l.status === 'pending' && (
                <>
                  <button className="text-xs px-3 py-1 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">✓ Onayla</button>
                  <button className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">✗ Reddet</button>
                </>
              )}
              {l.status === 'reported' && (
                <>
                  <button className="text-xs px-3 py-1 rounded-lg bg-white/[.06] text-white/50 hover:bg-white/[.1] transition-colors">İncele</button>
                  <button className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Kaldır</button>
                </>
              )}
              {l.status === 'active' && (
                <button className="text-xs px-3 py-1 rounded-lg bg-white/[.06] text-white/50 hover:bg-white/[.1] transition-colors">Görüntüle</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Vets View ─────────────────────────────────────────────────────────────────
function VetsView() {
  const vets = [
    { name:'Dr. Ahmet Yılmaz', clinic:'PetLife Kliniği', city:'Ankara',   status:'verified',  date:'20 Mar' },
    { name:'Dr. Selin Çelik',  clinic:'Hayvan Sağlığı',  city:'İstanbul', status:'pending',   date:'26 Mar' },
    { name:'Dr. Mert Yıldız',  clinic:'Pati Klinik',     city:'İzmir',    status:'pending',   date:'25 Mar' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-white">Veteriner Onaylama</h2>
        <span className="bg-[rgba(201,131,46,.15)] text-[#C9832E] text-sm px-3 py-1 rounded-full">2 Onay Bekliyor</span>
      </div>
      <div className="flex flex-col gap-3">
        {vets.map((v, i) => (
          <div key={i} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center text-lg flex-shrink-0">🩺</div>
              <div>
                <div className="text-sm font-medium text-white">{v.name}</div>
                <div className="text-xs text-white/40">{v.clinic} · {v.city} · {v.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-3 py-1 rounded-full ${v.status === 'verified' ? 'bg-green-500/15 text-green-400' : 'bg-[rgba(201,131,46,.15)] text-[#C9832E]'}`}>
                {v.status === 'verified' ? '✓ Onaylı' : 'Bekliyor'}
              </span>
              {v.status === 'pending' && (
                <>
                  <button className="text-xs px-3 py-1 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">Onayla</button>
                  <button className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Reddet</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Coming Soon ───────────────────────────────────────────────────────────────
function ComingSoon({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-sm text-white/40">Bu modül yakında eklenecek.</p>
    </div>
  );
}
