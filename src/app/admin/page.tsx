'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, logout } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getAllListings, approveListing, rejectListing, type Listing } from '@/lib/listings';
import {
  collection, getDocs, query, orderBy, updateDoc, doc, where,
  addDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const NAV = [
  { id:'dashboard',  icon:'📊', label:'Dashboard'         },
  { id:'listings',   icon:'📢', label:'İlan Moderasyonu'  },
  { id:'blog',       icon:'✍️', label:'Blog Başvuruları'  },
  { id:'services',   icon:'🏪', label:'Hizmet Başvuruları'},
  { id:'users',      icon:'👥', label:'Kullanıcılar'      },
  { id:'settings',   icon:'⚙',  label:'Ayarlar'           },
  { id:'vetapps',    icon:'🩺', label:'Veteriner Başvuruları' },
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
      setUser(u); setLoading(false);
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
        <div className="px-4 py-3 border-b border-white/[.06] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">🔐</div>
          <div>
            <div className="text-sm font-medium text-white truncate max-w-[140px]">{user?.email?.split('@')[0]}</div>
            <div className="text-[10px] text-red-400 font-semibold tracking-[.1em] uppercase">Admin</div>
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
          <Link href="/" className="flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm text-white/40 hover:bg-white/[.05] transition-all mb-1">
            <span>🌐</span> Siteye Git
          </Link>
          <button onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-sm text-white/40 hover:bg-white/[.05] transition-all">
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
          {active==='dashboard' && <DashView setActive={setActive}/>}
          {active==='listings'  && <ListingsView user={user}/>}
          {active==='blog'      && <BlogView/>}
          {active==='services'  && <ServicesView/>}
          {active==='users'     && <UsersView/>}
          {active==='settings'  && <SettingsView/>}
          {active==='vetapps'  && <VetApplicationsView/>}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashView({ setActive }: { setActive:(p:string)=>void }) {
  const [stats,  setStats]  = useState({users:0,listings:0,pending:0,pets:0,blogPending:0,servicePending:0});
  const [loading,setLoading]= useState(true);

  useEffect(()=>{
    async function load() {
      try {
        const [uSnap,lSnap,pSnap,bSnap,sSnap] = await Promise.all([
          getDocs(collection(db,'users')),
          getDocs(collection(db,'listings')),
          getDocs(collection(db,'pets')),
          getDocs(query(collection(db,'blogSubmissions'),where('status','==','pending'))),
          getDocs(query(collection(db,'services'),where('status','==','pending'))),
        ]);
        const allListings = lSnap.docs.map(d=>d.data());
        setStats({
          users:          uSnap.size,
          listings:       lSnap.size,
          pending:        allListings.filter((l:any)=>l.status==='pending').length,
          pets:           pSnap.size,
          blogPending:    bSnap.size,
          servicePending: sSnap.size,
        });
      } catch(e){console.error(e);}
      finally{setLoading(false);}
    }
    load();
  },[]);

  const totalPending = stats.pending + stats.blogPending + stats.servicePending;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-1">Genel Bakış</h2>
        <p className="text-sm text-white/40">{new Date().toLocaleString('tr-TR')}</p>
      </div>

      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            {[
              {i:'👥', l:'Kullanıcı',    v:stats.users,          c:'rgba(201,131,46,.15)', a:'users'   },
              {i:'📢', l:'Toplam İlan',  v:stats.listings,       c:'rgba(107,124,92,.15)', a:'listings'},
              {i:'🐾', l:'Pet Profili',  v:stats.pets,           c:'rgba(201,131,46,.12)', a:'dashboard'},
              {i:'⏳', l:'Bekleyen İlan',v:stats.pending,        c:'rgba(231,76,60,.15)',  a:'listings'},
              {i:'✍️', l:'Blog Başvuru', v:stats.blogPending,    c:'rgba(100,149,237,.15)',a:'blog'    },
              {i:'🏪', l:'Hizmet Başv.', v:stats.servicePending, c:'rgba(147,112,219,.15)',a:'services'},
            ].map(s=>(
              <button key={s.l} onClick={()=>s.a!=='dashboard'&&setActive(s.a)}
                className="rounded-[16px] p-4 border border-white/[.06] text-left hover:border-white/[.12] transition-all" style={{background:s.c}}>
                <div className="text-2xl mb-2">{s.i}</div>
                <div className="text-2xl font-bold text-white">{s.v}</div>
                <div className="text-xs text-white/50 mt-1">{s.l}</div>
              </button>
            ))}
          </div>

          {totalPending > 0 && (
            <div className="bg-[rgba(231,76,60,.1)] border border-red-500/20 rounded-[16px] p-4">
              <div className="text-sm font-semibold text-red-400 mb-3">⚠️ Toplam {totalPending} onay bekleyen içerik var</div>
              <div className="flex flex-wrap gap-2">
                {stats.pending>0 && <button onClick={()=>setActive('listings')} className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full hover:bg-red-500/30 transition-colors">{stats.pending} İlan →</button>}
                {stats.blogPending>0 && <button onClick={()=>setActive('blog')} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-colors">{stats.blogPending} Blog →</button>}
                {stats.servicePending>0 && <button onClick={()=>setActive('services')} className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full hover:bg-purple-500/30 transition-colors">{stats.servicePending} Hizmet →</button>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Blog Başvuruları ──────────────────────────────────────────────────────────
function BlogView() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState<'pending'|'approved'|'rejected'>('pending');
  const [selected,    setSelected]    = useState<any|null>(null);
  const [processing,  setProcessing]  = useState<string|null>(null);

  useEffect(()=>{ load(); },[]);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db,'blogSubmissions'), orderBy('createdAt','desc')));
      setSubmissions(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  async function handleApprove(id:string) {
    setProcessing(id);
    await updateDoc(doc(db,'blogSubmissions',id),{status:'approved'});
    setSubmissions(prev=>prev.map(s=>s.id===id?{...s,status:'approved'}:s));
    setSelected(null); setProcessing(null);
  }

  async function handleReject(id:string) {
    setProcessing(id);
    await updateDoc(doc(db,'blogSubmissions',id),{status:'rejected'});
    setSubmissions(prev=>prev.map(s=>s.id===id?{...s,status:'rejected'}:s));
    setSelected(null); setProcessing(null);
  }

  const filtered = submissions.filter(s=>s.status===filter);

  const STATUS_COLOR: Record<string,string> = {
    pending:  'bg-[rgba(201,131,46,.15)] text-[#C9832E]',
    approved: 'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
  };

  return (
    <div>
      {/* Detay modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-[800] flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/[.1] rounded-[20px] w-full max-w-[680px] p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{selected.title}</h3>
                <div className="text-xs text-white/40">{selected.name} · {selected.email} · {selected.category}</div>
              </div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 rounded-full bg-white/[.06] flex items-center justify-center text-white/50 hover:bg-white/[.1] flex-shrink-0">✕</button>
            </div>
            <div className="bg-white/[.04] rounded-[12px] p-4 mb-5 text-sm text-white/70 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {selected.content}
            </div>
            {selected.status==='pending' && (
              <div className="flex gap-3">
                <button onClick={()=>handleReject(selected.id)} disabled={!!processing}
                  className="flex-1 py-3 rounded-[12px] bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-colors disabled:opacity-50">
                  ✗ Reddet
                </button>
                <button onClick={()=>handleApprove(selected.id)} disabled={!!processing}
                  className="flex-1 py-3 rounded-[12px] bg-green-500/15 text-green-400 text-sm font-medium hover:bg-green-500/25 transition-colors disabled:opacity-50">
                  ✓ Onayla
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtreler */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          {val:'pending',  label:'Bekleyen',   count:submissions.filter(s=>s.status==='pending').length  },
          {val:'approved', label:'Onaylanan',  count:submissions.filter(s=>s.status==='approved').length },
          {val:'rejected', label:'Reddedilen', count:submissions.filter(s=>s.status==='rejected').length },
        ].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>
            {f.label} <span className="opacity-60">({f.count})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40 hover:bg-white/[.1]">↻ Yenile</button>
      </div>

      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : filtered.length === 0 ? <div className="text-center py-16 text-white/40"><div className="text-4xl mb-3">📭</div><p>Bu kategoride başvuru yok.</p></div>
      : (
        <div className="flex flex-col gap-3">
          {filtered.map(s=>(
            <div key={s.id} className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-4 cursor-pointer hover:border-white/[.12] transition-all" onClick={()=>setSelected(s)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white text-sm">{s.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[s.status]}`}>
                      {s.status==='pending'?'Bekliyor':s.status==='approved'?'Onaylandı':'Reddedildi'}
                    </span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{s.category}</span>
                  </div>
                  <div className="text-xs text-white/40 mb-2">{s.name} · {s.email}</div>
                  <p className="text-xs text-white/40 line-clamp-2">{s.content}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {s.status==='pending' && (
                    <>
                      <button onClick={e=>{e.stopPropagation();handleApprove(s.id);}} disabled={processing===s.id}
                        className="text-xs px-3 py-[6px] rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">✓ Onayla</button>
                      <button onClick={e=>{e.stopPropagation();handleReject(s.id);}} disabled={!!processing}
                        className="text-xs px-3 py-[6px] rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">✗ Reddet</button>
                    </>
                  )}
                  <button onClick={e=>{e.stopPropagation();setSelected(s);}} className="text-xs px-3 py-[6px] rounded-lg bg-white/[.06] text-white/50 hover:bg-white/[.1] transition-colors">Oku</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Services View ─────────────────────────────────────────────────────────────
function ServicesView() {
  const [services,   setServices]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<'pending'|'active'|'rejected'>('pending');
  const [processing, setProcessing] = useState<string|null>(null);

  useEffect(()=>{ load(); },[]);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db,'services'), orderBy('createdAt','desc')));
      setServices(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  async function handleApprove(id:string) {
    setProcessing(id);
    await updateDoc(doc(db,'services',id),{status:'active'});
    setServices(prev=>prev.map(s=>s.id===id?{...s,status:'active'}:s));
    setProcessing(null);
  }

  async function handleReject(id:string) {
    setProcessing(id);
    await updateDoc(doc(db,'services',id),{status:'rejected'});
    setServices(prev=>prev.map(s=>s.id===id?{...s,status:'rejected'}:s));
    setProcessing(null);
  }

  const filtered = services.filter(s=>s.status===filter);
  const TYPE: Record<string,string> = {groomer:'✂️ Kuaför', hotel:'🏨 Otel', trainer:'🎓 Eğitmen', vet:'🩺 Veteriner'};
  const STATUS_COLOR: Record<string,string> = {
    pending:'bg-[rgba(201,131,46,.15)] text-[#C9832E]',
    active:'bg-green-500/15 text-green-400',
    rejected:'bg-red-500/15 text-red-400',
  };

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          {val:'pending',  label:'Bekleyen',  count:services.filter(s=>s.status==='pending').length },
          {val:'active',   label:'Aktif',     count:services.filter(s=>s.status==='active').length  },
          {val:'rejected', label:'Reddedilen',count:services.filter(s=>s.status==='rejected').length},
        ].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>
            {f.label} <span className="opacity-60">({f.count})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40 hover:bg-white/[.1]">↻ Yenile</button>
      </div>

      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : filtered.length===0 ? <div className="text-center py-16 text-white/40"><div className="text-4xl mb-3">📭</div><p>Bu kategoride başvuru yok.</p></div>
      : (
        <div className="flex flex-col gap-3">
          {filtered.map(s=>(
            <div key={s.id} className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{s.businessName}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[s.status]||''}`}>
                      {s.status==='pending'?'Bekliyor':s.status==='active'?'Aktif':'Reddedildi'}
                    </span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{TYPE[s.type]||s.type}</span>
                    <span className="text-[10px] bg-[rgba(201,131,46,.15)] text-[#C9832E] px-2 py-[2px] rounded-full">{s.plan==='premium'?'Premium':'Temel'}</span>
                  </div>
                  <div className="text-xs text-white/40 mb-1">📍 {s.city}{s.district?`, ${s.district}`:''} · 📞 {s.phone}</div>
                  <div className="text-xs text-white/40 mb-1">👤 {s.ownerName} · {s.ownerEmail}</div>
                  <p className="text-xs text-white/50 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {s.status==='pending' && (
                    <>
                      <button onClick={()=>handleApprove(s.id)} disabled={processing===s.id}
                        className="text-xs px-4 py-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50">✓ Onayla</button>
                      <button onClick={()=>handleReject(s.id)} disabled={!!processing}
                        className="text-xs px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">✗ Reddet</button>
                    </>
                  )}
                  {s.status==='active' && (
                    <button onClick={()=>handleReject(s.id)}
                      className="text-xs px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Kaldır</button>
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

// ── Listings View ─────────────────────────────────────────────────────────────
function ListingsView({ user }: { user: User|null }) {
  const [listings,  setListings]  = useState<Listing[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState<'pending'|'active'|'rejected'|'all'>('pending');
  const [rejectId,  setRejectId]  = useState<string|null>(null);
  const [reason,    setReason]    = useState('');
  const [processing,setProcessing]= useState<string|null>(null);

  useEffect(()=>{ load(); },[]);

  async function load() {
    setLoading(true);
    try { setListings(await getAllListings()); }
    catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  async function handleApprove(id:string) {
    if(!user)return;
    setProcessing(id);
    await approveListing(id,user.uid);
    setListings(prev=>prev.map(l=>l.id===id?{...l,status:'active'}:l));
    setProcessing(null);
  }

  async function handleReject(id:string) {
    if(!reason.trim()){alert('Red sebebi yazın.');return;}
    setProcessing(id);
    await rejectListing(id,reason);
    setListings(prev=>prev.map(l=>l.id===id?{...l,status:'rejected',rejectionReason:reason}:l));
    setRejectId(null); setReason(''); setProcessing(null);
  }

  const filtered = listings.filter(l=>filter==='all'?true:l.status===filter);
  const STATUS_COLOR: Record<string,string> = {
    pending:'bg-[rgba(201,131,46,.15)] text-[#C9832E]',
    active:'bg-green-500/15 text-green-400',
    rejected:'bg-red-500/15 text-red-400',
    closed:'bg-white/[.06] text-white/40',
  };
  const TYPE_LABEL: Record<string,string> = {adoption:'Sahiplendirme',temp:'Geçici Yuva',lost:'Kayıp',found:'Bulundu'};

  return (
    <div>
      {rejectId && (
        <div className="fixed inset-0 bg-black/60 z-[800] flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/[.1] rounded-[20px] w-full max-w-[480px] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">İlanı Reddet</h3>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Red sebebini yazın…" rows={4}
              className="w-full px-3 py-3 rounded-[12px] bg-white/[.06] border border-white/[.1] text-white text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none mb-4"/>
            <div className="flex gap-2">
              <button onClick={()=>{setRejectId(null);setReason('');}} className="flex-1 py-3 rounded-[12px] border border-white/[.1] text-white/60 text-sm hover:bg-white/[.05]">İptal</button>
              <button onClick={()=>handleReject(rejectId)} disabled={!!processing} className="flex-1 py-3 rounded-[12px] bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-60">Reddet</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          {val:'pending', label:'Bekleyen', count:listings.filter(l=>l.status==='pending').length},
          {val:'active',  label:'Aktif',    count:listings.filter(l=>l.status==='active').length },
          {val:'rejected',label:'Reddedilen',count:listings.filter(l=>l.status==='rejected').length},
          {val:'all',     label:'Tümü',     count:listings.length},
        ].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>
            {f.label} <span className="opacity-60">({f.count})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40 hover:bg-white/[.1]">↻ Yenile</button>
      </div>

      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : filtered.length===0 ? <div className="text-center py-16 text-white/40"><div className="text-4xl mb-3">📭</div><p>Bu kategoride ilan yok.</p></div>
      : (
        <div className="flex flex-col gap-3">
          {filtered.map(l=>(
            <div key={l.id} className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-16 h-16 rounded-[12px] bg-white/[.06] flex-shrink-0 overflow-hidden">
                  {l.imageUrls?.[0]
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={l.imageUrls[0]} alt={l.name} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{l.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[l.status]||''}`}>
                      {l.status==='pending'?'Bekliyor':l.status==='active'?'Aktif':l.status==='rejected'?'Reddedildi':'Kapalı'}
                    </span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{TYPE_LABEL[l.type]||l.type}</span>
                  </div>
                  <div className="text-xs text-white/40 mb-1">{l.breed} · {l.city}{l.district?`, ${l.district}`:''}</div>
                  <div className="text-xs text-white/40 mb-1">👤 {l.ownerName} · {l.ownerEmail}</div>
                  <p className="text-xs text-white/50 line-clamp-2">{l.description}</p>
                  {l.status==='rejected'&&l.rejectionReason&&<div className="text-xs text-red-400 mt-1">Red: {l.rejectionReason}</div>}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {l.status==='pending' && (
                    <>
                      <button onClick={()=>handleApprove(l.id!)} disabled={processing===l.id}
                        className="text-xs px-4 py-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50">✓ Onayla</button>
                      <button onClick={()=>{setRejectId(l.id!);setReason('');}} disabled={!!processing}
                        className="text-xs px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">✗ Reddet</button>
                    </>
                  )}
                  {l.status==='active'&&(
                    <button onClick={()=>{setRejectId(l.id!);setReason('');}}
                      className="text-xs px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Kaldır</button>
                  )}
                  {l.status==='rejected'&&(
                    <button onClick={()=>handleApprove(l.id!)}
                      className="text-xs px-4 py-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">Yeniden Onayla</button>
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

  useEffect(()=>{
    async function load() {
      try {
        const snap = await getDocs(query(collection(db,'users'),orderBy('createdAt','desc')));
        setUsers(snap.docs.map(d=>({id:d.id,...d.data()})));
      } catch(e){console.error(e);}
      finally{setLoading(false);}
    }
    load();
  },[]);

  async function toggleBan(userId:string, currentRole:string) {
    const newRole = currentRole==='banned'?'user':'banned';
    await updateDoc(doc(db,'users',userId),{role:newRole});
    setUsers(prev=>prev.map(u=>u.id===userId?{...u,role:newRole}:u));
  }

  async function makeAdmin(userId:string) {
    if(!confirm('Bu kullanıcıyı admin yapmak istediğinizden emin misiniz?'))return;
    await updateDoc(doc(db,'users',userId),{role:'admin'});
    setUsers(prev=>prev.map(u=>u.id===userId?{...u,role:'admin'}:u));
  }

  const ROLE_COLOR: Record<string,string> = {
    admin:'bg-red-500/15 text-red-400',
    vet:'bg-blue-500/15 text-blue-400',
    user:'bg-white/[.06] text-white/50',
    banned:'bg-red-900/30 text-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Kullanıcılar ({users.length})</h2>
      </div>
      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div> : (
        <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[.06]">
                  {['Ad Soyad','E-posta','Rol','Plan','Kayıt','İşlem'].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold tracking-[.12em] uppercase text-white/30 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u,i)=>(
                  <tr key={u.id} className={`border-b border-white/[.04] hover:bg-white/[.02] transition-colors ${i%2===0?'':'bg-white/[.01]'}`}>
                    <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">{u.name} {u.surname}</td>
                    <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${ROLE_COLOR[u.role]||ROLE_COLOR.user}`}>{u.role||'user'}</span></td>
                    <td className="px-4 py-3 text-xs text-white/40">{u.plan||'free'}</td>
                    <td className="px-4 py-3 text-xs text-white/30 whitespace-nowrap">{u.createdAt?.toDate?.()?.toLocaleDateString('tr-TR')||'—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {u.role!=='admin'&&<button onClick={()=>makeAdmin(u.id)} className="text-[10px] px-2 py-1 rounded bg-[rgba(201,131,46,.15)] text-[#C9832E] hover:bg-[rgba(201,131,46,.25)] transition-colors whitespace-nowrap">Admin Yap</button>}
                        <button onClick={()=>toggleBan(u.id,u.role)} className={`text-[10px] px-2 py-1 rounded transition-colors whitespace-nowrap ${u.role==='banned'?'bg-green-500/15 text-green-400 hover:bg-green-500/25':'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                          {u.role==='banned'?'Banı Kaldır':'Banla'}
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
        <h3 className="text-base font-semibold text-white mb-4">Hızlı Linkler</h3>
        <div className="flex flex-col gap-2">
          {[
            {label:'Firebase Console', url:'https://console.firebase.google.com'},
            {label:'Vercel Dashboard', url:'https://vercel.com/patipetra'},
            {label:'GitHub Repo',      url:'https://github.com/patipetra/patipetra'},
          ].map(l=>(
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

// Bu satırı sil - sadece aşağıdaki fonksiyonu ekle

// ── Veteriner Başvuruları ─────────────────────────────────────────────────────
function VetApplicationsView() {
  const [apps,       setApps]       = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('pending');
  const [selected,   setSelected]   = useState<any|null>(null);
  const [processing, setProcessing] = useState<string|null>(null);
  const [adminNote,  setAdminNote]  = useState('');
  const [meetDate,   setMeetDate]   = useState('');
  const [showContract, setShowContract] = useState(false);
  const [contractData, setContractData] = useState({
    startDate:   new Date().toISOString().split('T')[0],
    endDate:     '',
    monthlyFee:  '599',
    yearlyFee:   '5990',
    planType:    'monthly',
    notes:       '',
  });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db,'vetApplications'), orderBy('createdAt','desc')));
      setApps(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  async function updateStatus(id: string, status: string, extra: any = {}) {
    setProcessing(id);
    try {
      await updateDoc(doc(db,'vetApplications',id), {
        status, ...extra,
        updatedAt: serverTimestamp(),
      });
      setApps(prev=>prev.map(a=>a.id===id?{...a,status,...extra}:a));
      if (selected?.id===id) setSelected((prev: any)=>({...prev,status,...extra}));
    } catch(e:any){alert('Hata: '+e.message);}
    finally{setProcessing(null);}
  }

  async function sendMeetingRequest(app: any) {
    if (!meetDate) { alert('Görüşme tarihi seçin.'); return; }
    await updateStatus(app.id, 'meeting_scheduled', {
      meetingDate: meetDate,
      adminNotes:  adminNote,
    });
    setMeetDate('');
  }

  async function sendContract(app: any) {
    if (!user) return;
    // Sözleşme Firestore'a kaydet
    await addDoc(collection(db,'vetContracts'), {
      vetApplicationId: app.id,
      vetUserId:        app.userId,
      vetName:          `${app.title} ${app.name}`,
      clinicName:       app.clinicName,
      city:             app.city,
      ...contractData,
      status:           'sent',
      sentAt:           serverTimestamp(),
      sentBy:           user?.uid,
      signedAt:         null,
    });
    await updateStatus(app.id, 'contract_sent', {contractSentAt: new Date().toISOString()});
    setShowContract(false);
    alert('Sözleşme gönderildi!');
  }

  async function approveVet(app: any) {
    if (!confirm(`${app.title} ${app.name} onaylanacak. Emin misiniz?`)) return;
    // Kullanıcı rolünü vet yap
    try {
      await updateDoc(doc(db,'users',app.userId), {
        role:        'vet',
        vetSlug:     app.slug,
        updatedAt:   serverTimestamp(),
      });
    } catch(e) { console.error('User update error:', e); }
    // Vets koleksiyonuna ekle
    try {
      await addDoc(collection(db,'vets'), {
        userId:      app.userId,
        name:        `${app.title} ${app.name}`,
        slug:        app.slug,
        clinic:      app.clinicName,
        city:        app.city,
        district:    app.district||'',
        phone:       app.phone,
        email:       app.email,
        website:     app.website||'',
        instagram:   app.instagram||'',
        spec:        app.specs||[],
        bio:         app.bio||'',
        education:   app.education,
        gradYear:    app.gradYear||'',
        experience:  app.experience||'',
        workingHours:app.workHours||'',
        avatar:      app.avatarUrl||'',
        rating:      0,
        reviewCount: 0,
        online:      false,
        verified:    true,
        planType:    app.planType||'monthly',
        status:      'active',
        createdAt:   serverTimestamp(),
      });
    } catch(e) { console.error('Vet create error:', e); }
    await updateStatus(app.id,'approved',{approvedAt:new Date().toISOString()});
    alert('Veteriner onaylandı ve profili yayına alındı!');
  }

  async function rejectApp(app: any) {
    const reason = prompt('Red sebebi:');
    if (!reason) return;
    await updateStatus(app.id,'rejected',{rejectionReason:reason});
  }

  const filtered = apps.filter(a => filter==='all' ? true : a.status===filter);

  const STATUS_LABEL: Record<string,string> = {
    pending:           'Bekliyor',
    reviewing:         'İnceleniyor',
    meeting_scheduled: 'Görüşme Planlandı',
    contract_sent:     'Sözleşme Gönderildi',
    approved:          'Onaylandı',
    rejected:          'Reddedildi',
  };
  const STATUS_COLOR: Record<string,string> = {
    pending:           'bg-[rgba(201,131,46,.15)] text-[#C9832E]',
    reviewing:         'bg-blue-500/15 text-blue-400',
    meeting_scheduled: 'bg-purple-500/15 text-purple-400',
    contract_sent:     'bg-yellow-500/15 text-yellow-500',
    approved:          'bg-green-500/15 text-green-400',
    rejected:          'bg-red-500/15 text-red-400',
  };

  const FILTERS = [
    {val:'pending',           label:'Bekleyen'          },
    {val:'reviewing',         label:'İnceleniyor'       },
    {val:'meeting_scheduled', label:'Görüşme'           },
    {val:'contract_sent',     label:'Sözleşme'          },
    {val:'approved',          label:'Onaylı'            },
    {val:'all',               label:'Tümü'              },
  ];

  return (
    <div>
      {/* Detay modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-[800] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a2e] border border-white/[.1] rounded-[20px] w-full max-w-[700px] p-6 my-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">{selected.title} {selected.name}</h3>
                <div className="text-sm text-white/40">{selected.clinicName} · {selected.city}</div>
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[selected.status]}`}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 rounded-full bg-white/[.06] flex items-center justify-center text-white/50 hover:bg-white/[.1]">✕</button>
            </div>

            {/* Bilgiler */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
              {[
                {l:'Telefon',    v:selected.phone},
                {l:'E-posta',    v:selected.email},
                {l:'Şehir',      v:`${selected.city} ${selected.district||''}`},
                {l:'Eğitim',     v:selected.education},
                {l:'Mezuniyet',  v:selected.gradYear},
                {l:'Deneyim',    v:`${selected.experience} yıl`},
                {l:'Plan',       v:selected.planType==='yearly'?'Yıllık':'Aylık'},
                {l:'Başvuru',    v:selected.createdAt?.toDate?.()?.toLocaleDateString('tr-TR')||''},
              ].map(f=>(
                <div key={f.l} className="bg-white/[.04] rounded-[10px] p-3">
                  <div className="text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">{f.l}</div>
                  <div className="text-white/80 text-xs">{f.v}</div>
                </div>
              ))}
            </div>

            {/* Uzmanlıklar */}
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-[.1em] text-white/30 mb-2">Uzmanlık Alanları</div>
              <div className="flex flex-wrap gap-1">
                {(selected.specs||[]).map((s: string)=>(
                  <span key={s} className="text-[10px] bg-white/[.08] text-white/60 px-2 py-[2px] rounded-full">{s}</span>
                ))}
              </div>
            </div>

            {/* Bio */}
            {selected.bio && (
              <div className="bg-white/[.04] rounded-[12px] p-4 mb-4 text-sm text-white/60 leading-relaxed">{selected.bio}</div>
            )}

            {/* Diploma */}
            {selected.diplomaUrl && (
              <a href={selected.diplomaUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#C9832E] hover:underline mb-4">
                📄 Diploma/Sertifika Görüntüle →
              </a>
            )}

            {/* Admin not */}
            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Admin Notu</label>
              <textarea value={adminNote||selected.adminNotes||''} onChange={e=>setAdminNote(e.target.value)}
                placeholder="İç not…" rows={2}
                className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E] resize-none"/>
            </div>

            {/* Görüşme planla */}
            {['pending','reviewing'].includes(selected.status) && (
              <div className="border border-white/[.08] rounded-[14px] p-4 mb-4">
                <div className="text-sm font-semibold text-white/70 mb-3">📅 Görüntülü Görüşme Planla</div>
                <div className="flex gap-2">
                  <input type="datetime-local" value={meetDate} onChange={e=>setMeetDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E]"/>
                  <button onClick={()=>sendMeetingRequest(selected)} disabled={!meetDate||!!processing}
                    className="px-4 py-2 rounded-[10px] bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors disabled:opacity-50 whitespace-nowrap">
                    Davet Gönder
                  </button>
                </div>
              </div>
            )}

            {/* Sözleşme gönder */}
            {['meeting_scheduled','reviewing'].includes(selected.status) && (
              <div className="border border-white/[.08] rounded-[14px] p-4 mb-4">
                <button onClick={()=>setShowContract(v=>!v)} className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  📋 Dijital Sözleşme Oluştur {showContract?'▲':'▼'}
                </button>
                {showContract && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-white/30 mb-1">Başlangıç Tarihi</label>
                        <input type="date" value={contractData.startDate} onChange={e=>setContractData(p=>({...p,startDate:e.target.value}))}
                          className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E]"/>
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/30 mb-1">Bitiş Tarihi</label>
                        <input type="date" value={contractData.endDate} onChange={e=>setContractData(p=>({...p,endDate:e.target.value}))}
                          className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E]"/>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-white/30 mb-1">Aylık Ücret (₺)</label>
                        <input value={contractData.monthlyFee} onChange={e=>setContractData(p=>({...p,monthlyFee:e.target.value}))}
                          className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E]"/>
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/30 mb-1">Yıllık Ücret (₺)</label>
                        <input value={contractData.yearlyFee} onChange={e=>setContractData(p=>({...p,yearlyFee:e.target.value}))}
                          className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E]"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/30 mb-1">Plan Türü</label>
                      <select value={contractData.planType} onChange={e=>setContractData(p=>({...p,planType:e.target.value}))}
                        className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E]">
                        <option value="monthly">Aylık</option>
                        <option value="yearly">Yıllık</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/30 mb-1">Sözleşme Notları</label>
                      <textarea value={contractData.notes} onChange={e=>setContractData(p=>({...p,notes:e.target.value}))}
                        placeholder="Özel şartlar…" rows={3}
                        className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none focus:border-[#C9832E] resize-none"/>
                    </div>
                    <button onClick={()=>sendContract(selected)}
                      className="w-full py-2 rounded-[10px] bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-colors">
                      📧 Sözleşmeyi Gönder
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Aksiyon butonları */}
            <div className="flex gap-2 flex-wrap">
              {selected.status==='pending' && (
                <button onClick={()=>updateStatus(selected.id,'reviewing',{adminNotes:adminNote})}
                  className="flex-1 py-2 rounded-[10px] bg-blue-500/15 text-blue-400 text-sm hover:bg-blue-500/25 transition-colors">
                  🔍 İncelemeye Al
                </button>
              )}
              {selected.status==='contract_sent' && (
                <button onClick={()=>approveVet(selected)} disabled={!!processing}
                  className="flex-1 py-2 rounded-[10px] bg-green-500/15 text-green-400 text-sm font-semibold hover:bg-green-500/25 transition-colors disabled:opacity-50">
                  ✓ Onayla & Yayına Al
                </button>
              )}
              {!['approved','rejected'].includes(selected.status) && (
                <button onClick={()=>rejectApp(selected)} disabled={!!processing}
                  className="flex-1 py-2 rounded-[10px] bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition-colors disabled:opacity-50">
                  ✗ Reddet
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filtreler */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val)}
            className={`text-sm px-3 py-[6px] rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>
            {f.label} <span className="opacity-50 text-[10px]">({apps.filter(a=>f.val==='all'?true:a.status===f.val).length})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40 hover:bg-white/[.1]">↻</button>
      </div>

      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : filtered.length===0 ? <div className="text-center py-16 text-white/40"><div className="text-4xl mb-3">🩺</div><p>Bu kategoride başvuru yok.</p></div>
      : (
        <div className="space-y-3">
          {filtered.map(a=>(
            <div key={a.id} className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-4 cursor-pointer hover:border-white/[.12] transition-all"
              onClick={()=>{setSelected(a);setAdminNote(a.adminNotes||'');setShowContract(false);}}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{a.title} {a.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[a.status]}`}>{STATUS_LABEL[a.status]}</span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{a.planType==='yearly'?'Yıllık':'Aylık'}</span>
                  </div>
                  <div className="text-xs text-white/40 mb-1">{a.clinicName} · {a.city}{a.district?`, ${a.district}`:''}</div>
                  <div className="text-xs text-white/40">{a.email} · {a.phone}</div>
                  {a.meetingDate && <div className="text-xs text-purple-400 mt-1">📅 Görüşme: {new Date(a.meetingDate).toLocaleString('tr-TR')}</div>}
                </div>
                <div className="text-white/30 text-sm">→</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
