'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, logout } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import {
  getPendingListings, getAllListings, approveListing, rejectListing,
  type Listing,
} from '@/lib/listings';
import {
  collection, getDocs, query, orderBy, updateDoc, doc,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const NAV = [
  { id:'dashboard', icon:'📊', label:'Dashboard'         },
  { id:'listings',  icon:'📢', label:'İlan Moderasyonu'  },
  { id:'users',     icon:'👥', label:'Kullanıcılar'       },
  { id:'settings',  icon:'⚙',  label:'Ayarlar'            },
];

export default function AdminPage() {
  const router = useRouter();
  const [user,        setUser]        = useState<User|null>(null);
  const [loading,     setLoading]     = useState(true);
  const [active,      setActive]      = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push('/giris?redirect=/admin'); return; }
      const admin = await isAdmin(u.uid);
      if (!admin) { router.push('/'); return; }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <div className="text-white/50 text-sm mb-4">Admin doğrulanıyor…</div>
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin mx-auto"/>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0f0f1a]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[190] lg:hidden" onClick={() => setSidebarOpen(false)}/>}

      <aside className={`fixed top-0 left-0 bottom-0 w-[240px] bg-[#1a1a2e] z-[200] flex flex-col border-r border-white/[.06] transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-5 border-b border-white/[.06]">
          <div className="text-[10px] font-semibold tracking-[.2em] uppercase text-white/30 mb-1">Patıpetra</div>
          <div className="text-lg font-semibold text-white">Admin Paneli</div>
        </div>
        <div className="px-4 py-3 border-b border-white/[.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">🔐</div>
            <div>
              <div className="text-sm font-medium text-white truncate max-w-[140px]">{user?.email?.split('@')[0]}</div>
              <div className="text-[10px] text-red-400 font-semibold tracking-[.1em] uppercase">Admin</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm mb-[2px] transition-all text-left ${active===item.id?'bg-[#C9832E]/20 text-[#E8B86D] font-medium':'text-white/50 hover:bg-white/[.05] hover:text-white/80'}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[.06]">
          <Link href="/" className="flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm text-white/40 hover:bg-white/[.05] hover:text-white/70 transition-all mb-1">
            <span>🌐</span> Siteye Git
          </Link>
          <button onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm text-white/40 hover:bg-white/[.05] hover:text-white/70 transition-all">
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[240px]">
        <header className="h-14 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/[.06] sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-8 h-8 rounded-lg flex flex-col items-center justify-center gap-[4px]" onClick={() => setSidebarOpen(v=>!v)}>
              <span className="w-[16px] h-[1.5px] bg-white/60 rounded"/>
              <span className="w-[16px] h-[1.5px] bg-white/60 rounded"/>
              <span className="w-[16px] h-[1.5px] bg-white/60 rounded"/>
            </button>
            <h1 className="text-base font-semibold text-white">{NAV.find(n=>n.id===active)?.label||'Dashboard'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-xs text-white/40">Sistem aktif</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {active==='dashboard' && <DashboardView setActive={setActive}/>}
          {active==='listings'  && <ListingsView user={user}/>}
          {active==='users'     && <UsersView/>}
          {active==='settings'  && <SettingsView/>}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardView({ setActive }: { setActive: (p:string)=>void }) {
  const [stats,  setStats]  = useState({users:0, listings:0, pending:0, pets:0});
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [usersSnap, listingsSnap, pendingSnap, petsSnap] = await Promise.all([
          getCountFromServer(collection(db,'users')),
          getCountFromServer(collection(db,'listings')),
          getCountFromServer(query(collection(db,'listings'))),
          getCountFromServer(collection(db,'pets')),
        ]);
        // pending sayısını elle say
        const allListings = await getAllListings();
        const pending = allListings.filter(l=>l.status==='pending').length;
        setStats({
          users:    usersSnap.data().count,
          listings: listingsSnap.data().count,
          pending,
          pets:     petsSnap.data().count,
        });
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-1">Genel Bakış</h2>
        <p className="text-sm text-white/40">{new Date().toLocaleString('tr-TR')}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            {i:'👥', l:'Toplam Kullanıcı', v:stats.users,    c:'rgba(201,131,46,.15)', action:'users'   },
            {i:'📢', l:'Toplam İlan',       v:stats.listings, c:'rgba(107,124,92,.15)', action:'listings'},
            {i:'⏳', l:'Onay Bekleyen',     v:stats.pending,  c:'rgba(231,76,60,.15)', action:'listings'},
            {i:'🐾', l:'Pet Profili',       v:stats.pets,     c:'rgba(201,131,46,.12)', action:'dashboard'},
          ].map(s => (
            <button key={s.l} onClick={() => s.action !== 'dashboard' && setActive(s.action)}
              className="rounded-[16px] p-4 border border-white/[.06] text-left hover:border-white/[.12] transition-all" style={{background:s.c}}>
              <div className="text-2xl mb-2">{s.i}</div>
              <div className="text-2xl font-bold text-white">{s.v}</div>
              <div className="text-xs text-white/50 mt-1">{s.l}</div>
            </button>
          ))}
        </div>
      )}

      {stats.pending > 0 && (
        <div className="bg-[rgba(231,76,60,.1)] border border-red-500/20 rounded-[16px] p-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-red-400 mb-1">⚠️ Onay bekleyen {stats.pending} ilan var</div>
            <div className="text-xs text-white/40">İlanları inceleyerek onaylayın veya reddedin.</div>
          </div>
          <button onClick={() => setActive('listings')}
            className="bg-[#C9832E] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#b87523] transition-colors flex-shrink-0">
            İncele →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Listings Moderation ───────────────────────────────────────────────────────
function ListingsView({ user }: { user: User|null }) {
  const [listings,  setListings]  = useState<Listing[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState<'all'|'pending'|'active'|'rejected'>('pending');
  const [rejectId,  setRejectId]  = useState<string|null>(null);
  const [reason,    setReason]    = useState('');
  const [processing,setProcessing]= useState<string|null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setListings(await getAllListings()); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleApprove(id: string) {
    if (!user) return;
    setProcessing(id);
    try {
      await approveListing(id, user.uid);
      setListings(prev => prev.map(l => l.id===id ? {...l, status:'active'} : l));
    } catch(e) { console.error(e); }
    finally { setProcessing(null); }
  }

  async function handleReject(id: string) {
    if (!reason.trim()) { alert('Red sebebi yazın.'); return; }
    setProcessing(id);
    try {
      await rejectListing(id, reason);
      setListings(prev => prev.map(l => l.id===id ? {...l, status:'rejected', rejectionReason:reason} : l));
      setRejectId(null); setReason('');
    } catch(e) { console.error(e); }
    finally { setProcessing(null); }
  }

  const filtered = listings.filter(l => filter==='all' ? true : l.status===filter);

  const STATUS_COLOR: Record<string,string> = {
    pending:  'bg-[rgba(201,131,46,.15)] text-[#C9832E]',
    active:   'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
    closed:   'bg-white/[.06] text-white/40',
  };
  const STATUS_LABEL: Record<string,string> = {
    pending:'Bekliyor', active:'Aktif', rejected:'Reddedildi', closed:'Kapalı'
  };
  const TYPE_LABEL: Record<string,string> = {
    adoption:'Sahiplendirme', temp:'Geçici Yuva', lost:'Kayıp', found:'Bulundu'
  };

  return (
    <div>
      {/* Red modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/60 z-[800] flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/[.1] rounded-[20px] w-full max-w-[480px] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">İlanı Reddet</h3>
            <textarea value={reason} onChange={e=>setReason(e.target.value)}
              placeholder="Red sebebini yazın… (kullanıcıya iletilecek)"
              rows={4} className="w-full px-3 py-3 rounded-[12px] bg-white/[.06] border border-white/[.1] text-white text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none mb-4"/>
            <div className="flex gap-2">
              <button onClick={() => { setRejectId(null); setReason(''); }}
                className="flex-1 py-3 rounded-[12px] border border-white/[.1] text-white/60 text-sm hover:bg-white/[.05] transition-all">İptal</button>
              <button onClick={() => handleReject(rejectId)} disabled={!!processing}
                className="flex-1 py-3 rounded-[12px] bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-60">
                {processing ? 'İşleniyor…' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtreler */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          {val:'pending', label:'Bekleyen',    count: listings.filter(l=>l.status==='pending').length  },
          {val:'active',  label:'Aktif',        count: listings.filter(l=>l.status==='active').length   },
          {val:'rejected',label:'Reddedilen',   count: listings.filter(l=>l.status==='rejected').length },
          {val:'all',     label:'Tümü',          count: listings.length                                  },
        ].map(f => (
          <button key={f.val} onClick={() => setFilter(f.val as any)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>
            {f.label} <span className="ml-1 opacity-60">({f.count})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40 hover:bg-white/[.1] transition-all">
          ↻ Yenile
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <div className="text-4xl mb-3">📭</div>
          <p>Bu kategoride ilan yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(l => (
            <div key={l.id} className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-4">
              <div className="flex items-start gap-4 flex-wrap">
                {/* Fotoğraf */}
                <div className="w-16 h-16 rounded-[12px] bg-white/[.06] flex-shrink-0 overflow-hidden">
                  {l.imageUrls?.[0]
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={l.imageUrls[0]} alt={l.name} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                  }
                </div>
                {/* Bilgi */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{l.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[l.status]}`}>{STATUS_LABEL[l.status]}</span>
                    <span className="text-[10px] bg-white/[.06] text-white/50 px-2 py-[2px] rounded-full">{TYPE_LABEL[l.type]||l.type}</span>
                  </div>
                  <div className="text-xs text-white/40 mb-1">
                    {l.breed} · {l.city}{l.district?`, ${l.district}`:''} · {l.age}
                  </div>
                  <div className="text-xs text-white/40 mb-2">
                    👤 {l.ownerName} · {l.ownerEmail}
                  </div>
                  <p className="text-xs text-white/50 line-clamp-2">{l.description}</p>
                  {l.status==='rejected' && l.rejectionReason && (
                    <div className="text-xs text-red-400 mt-1">Red: {l.rejectionReason}</div>
                  )}
                </div>
                {/* Aksiyonlar */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {l.status==='pending' && (
                    <>
                      <button onClick={() => handleApprove(l.id!)} disabled={processing===l.id}
                        className="text-xs px-4 py-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50">
                        {processing===l.id ? '…' : '✓ Onayla'}
                      </button>
                      <button onClick={() => { setRejectId(l.id!); setReason(''); }} disabled={!!processing}
                        className="text-xs px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                        ✗ Reddet
                      </button>
                    </>
                  )}
                  {l.status==='active' && (
                    <button onClick={() => { setRejectId(l.id!); setReason(''); }}
                      className="text-xs px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      Kaldır
                    </button>
                  )}
                  {l.status==='rejected' && (
                    <button onClick={() => handleApprove(l.id!)}
                      className="text-xs px-4 py-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">
                      Yeniden Onayla
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Users View ────────────────────────────────────────────────────────────────
function UsersView() {
  const [users,   setUsers]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db,'users'), orderBy('createdAt','desc'));
        const snap = await getDocs(q);
        setUsers(snap.docs.map(d => ({id:d.id,...d.data()})));
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  async function toggleBan(userId: string, currentRole: string) {
    const newRole = currentRole==='banned' ? 'user' : 'banned';
    await updateDoc(doc(db,'users',userId), {role: newRole});
    setUsers(prev => prev.map(u => u.id===userId ? {...u, role:newRole} : u));
  }

  async function makeAdmin(userId: string) {
    if (!confirm('Bu kullanıcıyı admin yapmak istediğinizden emin misiniz?')) return;
    await updateDoc(doc(db,'users',userId), {role:'admin'});
    setUsers(prev => prev.map(u => u.id===userId ? {...u, role:'admin'} : u));
  }

  const ROLE_COLOR: Record<string,string> = {
    admin:  'bg-red-500/15 text-red-400',
    vet:    'bg-blue-500/15 text-blue-400',
    user:   'bg-white/[.06] text-white/50',
    banned: 'bg-red-900/30 text-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Kullanıcılar ({users.length})</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[.06]">
                  {['Ad Soyad','E-posta','Rol','Plan','Kayıt Tarihi','İşlem'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold tracking-[.12em] uppercase text-white/30 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u,i) => (
                  <tr key={u.id} className={`border-b border-white/[.04] hover:bg-white/[.02] transition-colors ${i%2===0?'':'bg-white/[.01]'}`}>
                    <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">{u.name} {u.surname}</td>
                    <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${ROLE_COLOR[u.role]||ROLE_COLOR.user}`}>{u.role||'user'}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40">{u.plan||'free'}</td>
                    <td className="px-4 py-3 text-xs text-white/30 whitespace-nowrap">
                      {u.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {u.role !== 'admin' && (
                          <button onClick={() => makeAdmin(u.id)}
                            className="text-[10px] px-2 py-1 rounded bg-[rgba(201,131,46,.15)] text-[#C9832E] hover:bg-[rgba(201,131,46,.25)] transition-colors whitespace-nowrap">
                            Admin Yap
                          </button>
                        )}
                        <button onClick={() => toggleBan(u.id, u.role)}
                          className={`text-[10px] px-2 py-1 rounded transition-colors whitespace-nowrap ${u.role==='banned'?'bg-green-500/15 text-green-400 hover:bg-green-500/25':'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                          {u.role==='banned' ? 'Banı Kaldır' : 'Banla'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div className="max-w-[600px]">
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-6 mb-4">
        <h3 className="text-base font-semibold text-white mb-4">Site Ayarları</h3>
        <div className="flex flex-col gap-3">
          {[
            {label:'Site Adı',      val:'Patıpetra'},
            {label:'İletişim Mail', val:'patipetraa1@gmail.com'},
            {label:'Vercel URL',    val:'patipetra.vercel.app'},
          ].map(f => (
            <div key={f.label}>
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-white/30 mb-1">{f.label}</label>
              <div className="px-3 py-[11px] rounded-[12px] bg-white/[.04] border border-white/[.06] text-sm text-white/60">{f.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-6">
        <h3 className="text-base font-semibold text-white mb-3">Hızlı Linkler</h3>
        <div className="flex flex-col gap-2">
          {[
            {label:'Firebase Console', url:'https://console.firebase.google.com'},
            {label:'Vercel Dashboard', url:'https://vercel.com/patipetra'},
            {label:'GitHub Repo',      url:'https://github.com/patipetra/patipetra'},
          ].map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-[12px] bg-white/[.04] border border-white/[.06] text-sm text-white/60 hover:bg-white/[.08] hover:text-white/80 transition-all">
              {l.label} <span className="text-white/30">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
