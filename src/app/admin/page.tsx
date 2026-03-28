'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, logout } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getAllListings, approveListing, rejectListing, type Listing } from '@/lib/listings';
import {
  collection, getDocs, query, orderBy, updateDoc, doc, where,
  addDoc, serverTimestamp, setDoc, getDoc, deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const NAV = [
  { id:'dashboard',   icon:'📊', label:'Dashboard',            group:'genel'    },
  { id:'siteSettings',icon:'⚙️', label:'Site Ayarları',        group:'genel'    },
  { id:'seo',         icon:'🔍', label:'SEO Yönetimi',         group:'genel'    },
  { id:'popup',       icon:'📣', label:'Popup Yönetimi',       group:'genel'    },
  { id:'homepage',    icon:'🏠', label:'Ana Sayfa Düzenleyici',group:'genel'    },
  { id:'notify',      icon:'🔔', label:'Bildirim Gönder',      group:'genel'    },
  { id:'listings',    icon:'📢', label:'İlan Moderasyonu',     group:'icerik'   },
  { id:'blog',        icon:'✍️', label:'Blog Yönetimi',        group:'icerik'   },
  { id:'blog_subs',   icon:'📬', label:'Blog Başvuruları',     group:'icerik'   },
  { id:'services',    icon:'🏪', label:'Hizmet Başvuruları',   group:'icerik'   },
  { id:'vetapps',     icon:'🩺', label:'Veteriner Başvuruları',group:'icerik'   },
  { id:'vetprofiles', icon:'👨‍⚕️',label:'Veteriner Profilleri', group:'icerik'   },
  { id:'communities', icon:'🏘️', label:'Topluluk Başvuruları', group:'icerik'   },
  { id:'store',       icon:'🛒', label:'Mağaza Yönetimi',      group:'magaza'   },
  { id:'plans',       icon:'💎', label:'Premium Planlar',      group:'magaza'   },
  { id:'users',       icon:'👥', label:'Kullanıcılar',         group:'sistem'   },
  { id:'settings',    icon:'🔧', label:'Sistem Ayarları',      group:'sistem'   },
];

const GROUPS = [
  { id:'genel',   label:'Genel'   },
  { id:'icerik',  label:'İçerik'  },
  { id:'magaza',  label:'Mağaza'  },
  { id:'sistem',  label:'Sistem'  },
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
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin mx-auto"/>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0f0f1a]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[190] lg:hidden" onClick={()=>setSidebarOpen(false)}/>}

      <aside className={`fixed top-0 left-0 bottom-0 w-[240px] bg-[#1a1a2e] z-[200] flex flex-col border-r border-white/[.06] transition-transform duration-300 overflow-y-auto ${sidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-4 border-b border-white/[.06] flex-shrink-0">
          <div className="text-[10px] font-semibold tracking-[.2em] uppercase text-white/30 mb-1">Patıpetra</div>
          <div className="text-base font-semibold text-white">Süper Admin</div>
        </div>
        <div className="px-4 py-3 border-b border-white/[.06] flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-sm">🔐</div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-white truncate">{user?.email?.split('@')[0]}</div>
            <div className="text-[10px] text-red-400 font-semibold">Admin</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3">
          {GROUPS.map(group=>(
            <div key={group.id} className="mb-3">
              <div className="text-[9px] font-semibold tracking-[.15em] uppercase text-white/20 px-3 mb-1">{group.label}</div>
              {NAV.filter(n=>n.group===group.id).map(item=>(
                <button key={item.id} onClick={()=>{setActive(item.id);setSidebarOpen(false);}}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs mb-[1px] transition-all text-left ${active===item.id?'bg-[#C9832E]/20 text-[#E8B86D] font-medium':'text-white/50 hover:bg-white/[.05] hover:text-white/80'}`}>
                  <span className="text-sm">{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[.06] flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors mb-1">
            <span>🌐</span> Siteye Git
          </Link>
          <button onClick={async()=>{await logout();router.push('/');}}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors">
            <span>🚪</span> Çıkış
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[240px]">
        <header className="h-12 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/[.06] sticky top-0 z-[100] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={()=>setSidebarOpen(v=>!v)}>
              <div className="space-y-[4px]">
                <span className="block w-4 h-[1.5px] bg-white/60 rounded"/>
                <span className="block w-4 h-[1.5px] bg-white/60 rounded"/>
                <span className="block w-4 h-[1.5px] bg-white/60 rounded"/>
              </div>
            </button>
            <h1 className="text-sm font-semibold text-white">{NAV.find(n=>n.id===active)?.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-[10px] text-white/40">Sistem aktif</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {active==='dashboard'    && <DashView setActive={setActive}/>}
          {active==='siteSettings' && <SiteSettingsView/>}
          {active==='seo'          && <SEOView/>}
          {active==='popup'        && <PopupView/>}
          {active==='homepage'     && <HomepageView/>}
          {active==='notify'       && <NotifyView/>}
          {active==='listings'     && <ListingsView user={user}/>}
          {active==='blog'         && <BlogManagerView/>}
          {active==='blog_subs'    && <BlogSubsView/>}
          {active==='services'     && <ServicesView/>}
          {active==='vetapps'      && <VetApplicationsView user={user}/>}
          {active==='vetprofiles'  && <VetProfilesView/>}
          {active==='communities'  && <CommunitiesView/>}
          {active==='store'        && <StoreView/>}
          {active==='plans'        && <PlansView/>}
          {active==='users'        && <UsersView/>}
          {active==='settings'     && <SettingsView/>}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashView({setActive}:{setActive:(s:string)=>void}) {
  const [stats,setStats]=useState({users:0,listings:0,pending:0,vets:0,services:0,blogPending:0,vetApps:0});
  useEffect(()=>{
    async function load(){
      try{
        const [u,l,v,s,b,va]=await Promise.all([
          getDocs(collection(db,'users')),
          getDocs(collection(db,'listings')),
          getDocs(collection(db,'vets')),
          getDocs(collection(db,'services')),
          getDocs(query(collection(db,'blogSubmissions'),where('status','==','pending'))),
          getDocs(query(collection(db,'vetApplications'),where('status','==','pending'))),
        ]);
        const ls=l.docs.map(d=>d.data());
        setStats({users:u.size,listings:l.size,pending:ls.filter((x:any)=>x.status==='pending').length,vets:v.size,services:s.size,blogPending:b.size,vetApps:va.size});
      }catch(e){console.error(e);}
    }
    load();
  },[]);
  const cards=[
    {i:'👥',l:'Kullanıcı',    v:stats.users,      c:'rgba(201,131,46,.12)', a:'users'   },
    {i:'🩺',l:'Veteriner',    v:stats.vets,       c:'rgba(100,149,237,.12)',a:'vetprofiles'},
    {i:'📢',l:'İlan',         v:stats.listings,   c:'rgba(107,124,92,.12)', a:'listings'},
    {i:'⏳',l:'Bekleyen İlan',v:stats.pending,    c:'rgba(231,76,60,.12)',  a:'listings'},
    {i:'🏪',l:'Hizmet',       v:stats.services,   c:'rgba(147,112,219,.12)',a:'services'},
    {i:'✍️',l:'Blog Başvuru', v:stats.blogPending,c:'rgba(52,152,219,.12)', a:'blog_subs'},
    {i:'🩺',l:'Vet Başvuru',  v:stats.vetApps,    c:'rgba(231,76,60,.12)',  a:'vetapps' },
  ];
  return(
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Genel Bakış</h2>
        <p className="text-xs text-white/40">{new Date().toLocaleString('tr-TR')}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map(c=>(
          <button key={c.l} onClick={()=>setActive(c.a)}
            className="rounded-[14px] p-4 border border-white/[.06] text-left hover:border-white/[.12] transition-all" style={{background:c.c}}>
            <div className="text-xl mb-2">{c.i}</div>
            <div className="text-2xl font-bold text-white">{c.v}</div>
            <div className="text-[10px] text-white/50 mt-1">{c.l}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Site Ayarları ─────────────────────────────────────────────────────────────
function SiteSettingsView() {
  const [settings,setSettings]=useState<any>({
    siteName:'Patıpetra', slogan:'Türkiye\'nin Pet Yaşam Platformu',
    phone:'', whatsapp:'', email:'info@patipetra.com',
    instagram:'', twitter:'', facebook:'', youtube:'', tiktok:'',
    footerText:'© 2025 Patıpetra. Tüm hakları saklıdır.',
    maintenanceMode:false, allowRegistration:true,
  });
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    getDoc(doc(db,'siteSettings','main')).then(snap=>{
      if(snap.exists()) setSettings((p:any)=>({...p,...snap.data()}));
    });
  },[]);

  async function save(){
    setSaving(true);
    await setDoc(doc(db,'siteSettings','main'),{...settings,updatedAt:serverTimestamp()});
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E] transition-all";
  const LABEL="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1";

  return(
    <div className="max-w-[700px] space-y-5">
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">🏷️ Genel Bilgiler</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className={LABEL}>Site Adı</label><input value={settings.siteName} onChange={e=>setSettings((p:any)=>({...p,siteName:e.target.value}))} className={INPUT}/></div>
          <div><label className={LABEL}>E-posta</label><input value={settings.email} onChange={e=>setSettings((p:any)=>({...p,email:e.target.value}))} className={INPUT}/></div>
        </div>
        <div className="mb-3"><label className={LABEL}>Slogan</label><input value={settings.slogan} onChange={e=>setSettings((p:any)=>({...p,slogan:e.target.value}))} className={INPUT}/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={LABEL}>Telefon</label><input value={settings.phone} onChange={e=>setSettings((p:any)=>({...p,phone:e.target.value}))} className={INPUT}/></div>
          <div><label className={LABEL}>WhatsApp</label><input value={settings.whatsapp} onChange={e=>setSettings((p:any)=>({...p,whatsapp:e.target.value}))} className={INPUT}/></div>
        </div>
      </div>

      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">📱 Sosyal Medya</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['Instagram','instagram'],['Twitter/X','twitter'],['Facebook','facebook'],['YouTube','youtube'],['TikTok','tiktok']].map(([l,k])=>(
            <div key={k}><label className={LABEL}>{l}</label><input value={settings[k]||''} onChange={e=>setSettings((p:any)=>({...p,[k]:e.target.value}))} placeholder={`@${k}`} className={INPUT}/></div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">⚙️ Site Durumu</h3>
        <div className="flex flex-col gap-3">
          {[
            {l:'Bakım Modu',k:'maintenanceMode',desc:'Aktif edilirse site ziyaretçilere kapanır'},
            {l:'Yeni Kayıt',k:'allowRegistration',desc:'Kapatılırsa yeni kullanıcı kaydı durur'},
          ].map(f=>(
            <label key={f.k} className="flex items-center justify-between p-3 bg-white/[.04] rounded-[10px] cursor-pointer">
              <div>
                <div className="text-sm text-white/70">{f.l}</div>
                <div className="text-[10px] text-white/30">{f.desc}</div>
              </div>
              <div onClick={()=>setSettings((p:any)=>({...p,[f.k]:!p[f.k]}))}
                className={`w-10 h-6 rounded-full transition-all relative ${settings[f.k]?'bg-[#C9832E]':'bg-white/[.1]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings[f.k]?'left-5':'left-1'}`}/>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3"><label className={LABEL}>Footer Metni</label><input value={settings.footerText} onChange={e=>setSettings((p:any)=>({...p,footerText:e.target.value}))} className={INPUT}/></div>

      <button onClick={save} disabled={saving}
        className="w-full py-3 rounded-[12px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] transition-all disabled:opacity-60">
        {saving?'Kaydediliyor…':saved?'✓ Kaydedildi!':'Ayarları Kaydet'}
      </button>
    </div>
  );
}

// ── SEO ───────────────────────────────────────────────────────────────────────
function SEOView() {
  const [pages,setPages]=useState<any>({
    home:     {title:'Patıpetra — Türkiye\'nin Pet Yaşam Platformu', desc:'Pet profili, veteriner, sahiplendirme. Türkiye\'nin en kapsamlı pet platformu.', keywords:'pet, veteriner, kedi, köpek'},
    listings: {title:'Pet Sahiplendirme İlanları — Patıpetra', desc:'81 ilde kedi köpek sahiplendirme ilanları.', keywords:'pet sahiplendirme, kedi yuva'},
    vets:     {title:'Veterinerler — Patıpetra', desc:'Doğrulanmış veteriner klinikleri.', keywords:'veteriner, veteriner klinik'},
    blog:     {title:'Blog — Patıpetra', desc:'Pet bakım rehberleri ve ipuçları.', keywords:'pet bakım, kedi köpek sağlık'},
  });
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    getDoc(doc(db,'siteSettings','seo')).then(snap=>{
      if(snap.exists()) setPages((p:any)=>({...p,...snap.data()}));
    });
  },[]);

  async function save(){
    setSaving(true);
    await setDoc(doc(db,'siteSettings','seo'),{...pages,updatedAt:serverTimestamp()});
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";
  const PAGE_LABELS: Record<string,string> = {home:'Ana Sayfa',listings:'İlanlar',vets:'Veterinerler',blog:'Blog'};

  return(
    <div className="max-w-[700px] space-y-4">
      {Object.keys(pages).map(page=>(
        <div key={page} className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">📄 {PAGE_LABELS[page]}</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Meta Title</label>
              <input value={pages[page].title} onChange={e=>setPages((p:any)=>({...p,[page]:{...p[page],title:e.target.value}}))} className={INPUT}/>
              <div className="text-[10px] text-white/20 mt-1">{pages[page].title.length}/60 karakter</div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Meta Description</label>
              <textarea value={pages[page].desc} onChange={e=>setPages((p:any)=>({...p,[page]:{...p[page],desc:e.target.value}}))} rows={2} className={`${INPUT} resize-none`}/>
              <div className="text-[10px] text-white/20 mt-1">{pages[page].desc.length}/160 karakter</div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Keywords</label>
              <input value={pages[page].keywords} onChange={e=>setPages((p:any)=>({...p,[page]:{...p[page],keywords:e.target.value}}))} className={INPUT}/>
            </div>
          </div>
        </div>
      ))}
      <button onClick={save} disabled={saving} className="w-full py-3 rounded-[12px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] disabled:opacity-60">
        {saving?'Kaydediliyor…':saved?'✓ Kaydedildi!':'SEO Ayarlarını Kaydet'}
      </button>
    </div>
  );
}

// ── Popup Yönetimi ────────────────────────────────────────────────────────────
function PopupView() {
  const [popups,setPopups]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({title:'',message:'',buttonText:'',buttonUrl:'',bgColor:'#C9832E',active:true,type:'announcement'});
  const [editing,setEditing]=useState<string|null>(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    const snap=await getDocs(query(collection(db,'popups'),orderBy('createdAt','desc')));
    setPopups(snap.docs.map(d=>({id:d.id,...d.data()})));
    setLoading(false);
  }

  async function save(){
    if(!form.title||!form.message) return;
    if(editing){
      await updateDoc(doc(db,'popups',editing),{...form,updatedAt:serverTimestamp()});
    } else {
      await addDoc(collection(db,'popups'),{...form,createdAt:serverTimestamp()});
    }
    setForm({title:'',message:'',buttonText:'',buttonUrl:'',bgColor:'#C9832E',active:true,type:'announcement'});
    setEditing(null); load();
  }

  async function toggleActive(id:string, active:boolean){
    await updateDoc(doc(db,'popups',id),{active:!active});
    setPopups(prev=>prev.map(p=>p.id===id?{...p,active:!active}:p));
  }

  async function del(id:string){
    if(!confirm('Silinsin mi?')) return;
    await deleteDoc(doc(db,'popups',id)); load();
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";

  return(
    <div className="max-w-[700px] space-y-5">
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">{editing?'Popup Düzenle':'Yeni Popup'}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Başlık *</label>
              <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} className={INPUT}/>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Tip</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} className={INPUT}>
                <option value="announcement">Duyuru</option>
                <option value="campaign">Kampanya</option>
                <option value="warning">Uyarı</option>
                <option value="info">Bilgi</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Mesaj *</label>
            <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={3} className={`${INPUT} resize-none`}/>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Buton Metni</label>
              <input value={form.buttonText} onChange={e=>setForm(p=>({...p,buttonText:e.target.value}))} className={INPUT}/>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Buton URL</label>
              <input value={form.buttonUrl} onChange={e=>setForm(p=>({...p,buttonUrl:e.target.value}))} placeholder="/ilanlar" className={INPUT}/>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Renk</label>
              <input type="color" value={form.bgColor} onChange={e=>setForm(p=>({...p,bgColor:e.target.value}))} className="w-full h-[38px] rounded-[10px] bg-white/[.06] border border-white/[.1] cursor-pointer px-1"/>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-2 rounded-[10px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523]">
              {editing?'Güncelle':'Popup Oluştur'}
            </button>
            {editing && <button onClick={()=>{setEditing(null);setForm({title:'',message:'',buttonText:'',buttonUrl:'',bgColor:'#C9832E',active:true,type:'announcement'});}} className="px-4 py-2 rounded-[10px] bg-white/[.06] text-white/50 text-sm">İptal</button>}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
        : popups.map(p=>(
          <div key={p.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:p.bgColor}}/>
                <div>
                  <div className="text-sm font-semibold text-white">{p.title}</div>
                  <div className="text-xs text-white/40 mt-[2px]">{p.message?.slice(0,60)}…</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={()=>toggleActive(p.id,p.active)} className={`text-[10px] px-2 py-1 rounded-full ${p.active?'bg-green-500/15 text-green-400':'bg-white/[.06] text-white/40'}`}>
                  {p.active?'Aktif':'Pasif'}
                </button>
                <button onClick={()=>{setEditing(p.id);setForm({title:p.title,message:p.message,buttonText:p.buttonText||'',buttonUrl:p.buttonUrl||'',bgColor:p.bgColor||'#C9832E',active:p.active,type:p.type||'announcement'});}} className="text-[10px] px-2 py-1 rounded-full bg-blue-500/15 text-blue-400">Düzenle</button>
                <button onClick={()=>del(p.id)} className="text-[10px] px-2 py-1 rounded-full bg-red-500/15 text-red-400">Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Ana Sayfa Düzenleyici ─────────────────────────────────────────────────────
function HomepageView() {
  const [data,setData]=useState<any>({
    heroTitle:'Petiniz için her şey burada',
    heroSubtitle:'Pet pasaport, veteriner iletişimi, sahiplendirme ilanı ve premium hizmetler — tek platformda.',
    heroImage:'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80',
    heroBtnText:'Ücretsiz Başla',
    heroBtnUrl:'/kayit',
    heroBtnSecText:'İlanları Gör',
    heroBtnSecUrl:'/ilanlar',
    stat1n:'10K+', stat1l:'Pet Sahibi',
    stat2n:'500+', stat2l:'Veteriner',
    stat3n:'81',   stat3l:'İl',
    stat4n:'%100', stat4l:'Güvenli',
    showListings:true, showVets:true, showServices:true,
  });
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    getDoc(doc(db,'siteSettings','homepage')).then(snap=>{
      if(snap.exists()) setData((p:any)=>({...p,...snap.data()}));
    });
  },[]);

  async function save(){
    setSaving(true);
    await setDoc(doc(db,'siteSettings','homepage'),{...data,updatedAt:serverTimestamp()});
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";
  const LABEL="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1";

  return(
    <div className="max-w-[700px] space-y-5">
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">🦸 Hero Bölümü</h3>
        <div className="space-y-3">
          <div><label className={LABEL}>Hero Başlık</label><input value={data.heroTitle} onChange={e=>setData((p:any)=>({...p,heroTitle:e.target.value}))} className={INPUT}/></div>
          <div><label className={LABEL}>Hero Alt Başlık</label><textarea value={data.heroSubtitle} onChange={e=>setData((p:any)=>({...p,heroSubtitle:e.target.value}))} rows={2} className={`${INPUT} resize-none`}/></div>
          <div><label className={LABEL}>Hero Görsel URL</label><input value={data.heroImage} onChange={e=>setData((p:any)=>({...p,heroImage:e.target.value}))} className={INPUT}/></div>
          {data.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.heroImage} alt="preview" className="w-full h-32 object-cover rounded-[10px] opacity-60"/>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LABEL}>Buton 1 Metni</label><input value={data.heroBtnText} onChange={e=>setData((p:any)=>({...p,heroBtnText:e.target.value}))} className={INPUT}/></div>
            <div><label className={LABEL}>Buton 1 URL</label><input value={data.heroBtnUrl} onChange={e=>setData((p:any)=>({...p,heroBtnUrl:e.target.value}))} className={INPUT}/></div>
            <div><label className={LABEL}>Buton 2 Metni</label><input value={data.heroBtnSecText} onChange={e=>setData((p:any)=>({...p,heroBtnSecText:e.target.value}))} className={INPUT}/></div>
            <div><label className={LABEL}>Buton 2 URL</label><input value={data.heroBtnSecUrl} onChange={e=>setData((p:any)=>({...p,heroBtnSecUrl:e.target.value}))} className={INPUT}/></div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">📊 İstatistikler</h3>
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i=>(
            <div key={i} className="flex gap-2">
              <input value={data[`stat${i}n`]} onChange={e=>setData((p:any)=>({...p,[`stat${i}n`]:e.target.value}))} placeholder="10K+" className={`${INPUT} w-20`}/>
              <input value={data[`stat${i}l`]} onChange={e=>setData((p:any)=>({...p,[`stat${i}l`]:e.target.value}))} placeholder="Pet Sahibi" className={INPUT}/>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">📦 Bölüm Gösterimi</h3>
        {[{l:'İlanlar Bölümü',k:'showListings'},{l:'Veterinerler Bölümü',k:'showVets'},{l:'Hizmetler Bölümü',k:'showServices'}].map(f=>(
          <label key={f.k} className="flex items-center justify-between p-3 bg-white/[.04] rounded-[10px] mb-2 cursor-pointer">
            <span className="text-sm text-white/70">{f.l}</span>
            <div onClick={()=>setData((p:any)=>({...p,[f.k]:!p[f.k]}))}
              className={`w-10 h-6 rounded-full transition-all relative ${data[f.k]?'bg-[#C9832E]':'bg-white/[.1]'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data[f.k]?'left-5':'left-1'}`}/>
            </div>
          </label>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="w-full py-3 rounded-[12px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] disabled:opacity-60">
        {saving?'Kaydediliyor…':saved?'✓ Kaydedildi!':'Ana Sayfa Ayarlarını Kaydet'}
      </button>
    </div>
  );
}

// ── Bildirim Gönder ───────────────────────────────────────────────────────────
function NotifyView() {
  const [title,setTitle]=useState('');
  const [message,setMessage]=useState('');
  const [target,setTarget]=useState<'all'|'vet'|'user'>('all');
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);

  async function send(){
    if(!title||!message) return;
    setSending(true);
    try{
      const q = target==='all' ? getDocs(collection(db,'users'))
               : getDocs(query(collection(db,'users'),where('role','==',target)));
      const snap = await q;
      const batch: Promise<any>[] = [];
      snap.docs.forEach(u=>{
        batch.push(addDoc(collection(db,'notifications'),{
          userId:   u.id,
          type:     'system',
          title,
          message,
          isRead:   false,
          createdAt:serverTimestamp(),
        }));
      });
      await Promise.all(batch);
      setSent(true); setTitle(''); setMessage('');
      setTimeout(()=>setSent(false),3000);
    }finally{setSending(false);}
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";

  return(
    <div className="max-w-[600px]">
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">🔔 Toplu Bildirim Gönder</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Hedef Kitle</label>
            <div className="flex gap-2">
              {[{v:'all',l:'Tüm Kullanıcılar'},{v:'user',l:'Pet Sahipleri'},{v:'vet',l:'Sadece Veterinerler'}].map(t=>(
                <button key={t.v} onClick={()=>setTarget(t.v as any)}
                  className={`text-xs px-3 py-2 rounded-full transition-all ${target===t.v?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/50 hover:bg-white/[.1]'}`}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>
          <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Başlık *</label><input value={title} onChange={e=>setTitle(e.target.value)} className={INPUT}/></div>
          <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Mesaj *</label><textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} className={`${INPUT} resize-none`}/></div>
          <div className="bg-[rgba(201,131,46,.08)] border border-[rgba(201,131,46,.2)] rounded-[10px] p-3 text-xs text-[#C9832E]">
            ⚠️ Bu bildirim seçilen tüm kullanıcıların panel bildirimlerine gönderilecek.
          </div>
          <button onClick={send} disabled={sending||!title||!message}
            className="w-full py-3 rounded-[12px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] disabled:opacity-60">
            {sending?'Gönderiliyor…':sent?'✓ Gönderildi!':'Bildirimi Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Blog Yönetimi ─────────────────────────────────────────────────────────────
function BlogManagerView() {
  const [posts,setPosts]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState<any|null>(null);
  const [form,setForm]=useState({title:'',slug:'',excerpt:'',content:'',cat:'Sağlık',img:'',featured:false,published:true});

  const CATS=['Sağlık','Beslenme','Bakım','Eğitim','Sahiplendirme','Rehber','Güvenlik'];

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    const snap=await getDocs(query(collection(db,'blogPosts'),orderBy('createdAt','desc')));
    setPosts(snap.docs.map(d=>({id:d.id,...d.data()})));
    setLoading(false);
  }

  function slugify(t:string){return t.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

  async function save(){
    if(!form.title||!form.content) return;
    const data={...form,slug:form.slug||slugify(form.title),updatedAt:serverTimestamp()};
    if(editing){
      await updateDoc(doc(db,'blogPosts',editing.id),data);
    } else {
      await addDoc(collection(db,'blogPosts'),{...data,createdAt:serverTimestamp(),readTime:Math.ceil(form.content.split(' ').length/200)});
    }
    setEditing(null); setForm({title:'',slug:'',excerpt:'',content:'',cat:'Sağlık',img:'',featured:false,published:true}); load();
  }

  async function del(id:string){
    if(!confirm('Silinsin mi?')) return;
    await deleteDoc(doc(db,'blogPosts',id)); load();
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";

  if(editing!==null || editing===false) return(
    <div className="max-w-[700px] space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={()=>{setEditing(null);setForm({title:'',slug:'',excerpt:'',content:'',cat:'Sağlık',img:'',featured:false,published:true});}} className="text-white/50 hover:text-white text-sm">← Geri</button>
        <h3 className="text-sm font-semibold text-white">{editing?.id?'Makale Düzenle':'Yeni Makale'}</h3>
      </div>
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5 space-y-3">
        <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Başlık *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value,slug:slugify(e.target.value)}))} className={INPUT}/></div>
        <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Slug</label><input value={form.slug} onChange={e=>setForm(p=>({...p,slug:e.target.value}))} className={INPUT}/></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Kategori</label>
            <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))} className={INPUT}>
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Görsel URL</label><input value={form.img} onChange={e=>setForm(p=>({...p,img:e.target.value}))} className={INPUT}/></div>
        </div>
        <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Özet</label><textarea value={form.excerpt} onChange={e=>setForm(p=>({...p,excerpt:e.target.value}))} rows={2} className={`${INPUT} resize-none`}/></div>
        <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">İçerik *</label><textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} rows={12} className={`${INPUT} resize-none font-mono text-xs`}/></div>
        <div className="flex gap-4">
          {[{l:'Yayınlandı',k:'published'},{l:'Öne Çıkan',k:'featured'}].map(f=>(
            <label key={f.k} className="flex items-center gap-2 cursor-pointer">
              <div onClick={()=>setForm(p=>({...p,[f.k]:!(p as any)[f.k]}))}
                className={`w-8 h-5 rounded-full transition-all relative ${(form as any)[f.k]?'bg-[#C9832E]':'bg-white/[.1]'}`}>
                <div className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white transition-all ${(form as any)[f.k]?'left-[18px]':'left-[3px]'}`}/>
              </div>
              <span className="text-xs text-white/50">{f.l}</span>
            </label>
          ))}
        </div>
        <button onClick={save} className="w-full py-3 rounded-[12px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523]">
          {editing?.id?'Güncelle':'Yayınla'}
        </button>
      </div>
    </div>
  );

  return(
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Blog Makaleleri ({posts.length})</h3>
        <button onClick={()=>setEditing(false)} className="text-xs px-4 py-2 rounded-full bg-[#C9832E] text-white hover:bg-[#b87523]">+ Yeni Makale</button>
      </div>
      {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : posts.length===0 ? <div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">✍️</div><p>Henüz makale yok.</p></div>
      : (
        <div className="space-y-3">
          {posts.map(p=>(
            <div key={p.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4 flex items-center gap-4">
              {p.img && <img src={p.img} alt="" className="w-16 h-12 object-cover rounded-[8px] flex-shrink-0"/>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-white truncate">{p.title}</span>
                  {p.featured&&<span className="text-[10px] bg-[rgba(201,131,46,.2)] text-[#C9832E] px-2 py-[1px] rounded-full">Öne Çıkan</span>}
                  <span className={`text-[10px] px-2 py-[1px] rounded-full ${p.published?'bg-green-500/15 text-green-400':'bg-white/[.06] text-white/30'}`}>{p.published?'Yayında':'Taslak'}</span>
                </div>
                <div className="text-xs text-white/30">{p.cat} · {p.slug}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={()=>{setEditing(p);setForm({title:p.title,slug:p.slug,excerpt:p.excerpt||'',content:p.content||'',cat:p.cat,img:p.img||'',featured:p.featured||false,published:p.published!==false});}} className="text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-400">Düzenle</button>
                <button onClick={()=>del(p.id)} className="text-xs px-3 py-1 rounded-full bg-red-500/15 text-red-400">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mağaza Yönetimi ───────────────────────────────────────────────────────────
function StoreView() {
  const [products,setProducts]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState<any|null>(null);
  const [form,setForm]=useState({name:'',description:'',price:0,salePrice:0,category:'Mama',stock:0,img:'',active:true});

  const CATS=['Mama','Aksesuar','Oyuncak','Bakım','Sağlık','Kıyafet','Kafes & Taşıyıcı','Diğer'];

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    const snap=await getDocs(query(collection(db,'products'),orderBy('createdAt','desc')));
    setProducts(snap.docs.map(d=>({id:d.id,...d.data()})));
    setLoading(false);
  }

  async function save(){
    if(!form.name) return;
    const data={...form,price:Number(form.price),salePrice:Number(form.salePrice),stock:Number(form.stock),updatedAt:serverTimestamp()};
    if(editing?.id){
      await updateDoc(doc(db,'products',editing.id),data);
    } else {
      await addDoc(collection(db,'products'),{...data,createdAt:serverTimestamp(),sold:0});
    }
    setEditing(null); setForm({name:'',description:'',price:0,salePrice:0,category:'Mama',stock:0,img:'',active:true}); load();
  }

  async function del(id:string){
    if(!confirm('Silinsin mi?')) return;
    await deleteDoc(doc(db,'products',id)); load();
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";

  return(
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Ürünler ({products.length})</h3>
        <button onClick={()=>setEditing({})} className="text-xs px-4 py-2 rounded-full bg-[#C9832E] text-white hover:bg-[#b87523]">+ Yeni Ürün</button>
      </div>

      {editing !== null && (
        <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5 mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{editing?.id?'Ürün Düzenle':'Yeni Ürün'}</h3>
            <button onClick={()=>{setEditing(null);setForm({name:'',description:'',price:0,salePrice:0,category:'Mama',stock:0,img:'',active:true});}} className="text-white/30 hover:text-white text-xs">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Ürün Adı *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className={INPUT}/></div>
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Kategori</label>
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className={INPUT}>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Fiyat (₺)</label><input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:Number(e.target.value)}))} className={INPUT}/></div>
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">İndirimli Fiyat (₺)</label><input type="number" value={form.salePrice} onChange={e=>setForm(p=>({...p,salePrice:Number(e.target.value)}))} className={INPUT}/></div>
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Stok</label><input type="number" value={form.stock} onChange={e=>setForm(p=>({...p,stock:Number(e.target.value)}))} className={INPUT}/></div>
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Görsel URL</label><input value={form.img} onChange={e=>setForm(p=>({...p,img:e.target.value}))} className={INPUT}/></div>
          </div>
          <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Açıklama</label><textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} className={`${INPUT} resize-none`}/></div>
          <button onClick={save} className="w-full py-2 rounded-[10px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523]">
            {editing?.id?'Güncelle':'Ürün Ekle'}
          </button>
        </div>
      )}

      {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : products.length===0 ? <div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">🛒</div><p>Henüz ürün yok.</p></div>
      : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p=>(
            <div key={p.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] overflow-hidden">
              <div className="h-32 bg-white/[.04] flex items-center justify-center overflow-hidden">
                {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-cover"/> : <span className="text-4xl">🛍️</span>}
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm text-white mb-1">{p.name}</div>
                <div className="text-xs text-white/40 mb-2">{p.category} · Stok: {p.stock}</div>
                <div className="flex items-center gap-2 mb-3">
                  {p.salePrice>0 ? (<><span className="text-[#C9832E] font-semibold text-sm">₺{p.salePrice}</span><span className="text-white/30 text-xs line-through">₺{p.price}</span></>) : <span className="text-white/70 text-sm">₺{p.price}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>{setEditing(p);setForm({name:p.name,description:p.description||'',price:p.price,salePrice:p.salePrice||0,category:p.category,stock:p.stock,img:p.img||'',active:p.active!==false});}} className="flex-1 text-xs py-1 rounded-full bg-blue-500/15 text-blue-400">Düzenle</button>
                  <button onClick={()=>del(p.id)} className="flex-1 text-xs py-1 rounded-full bg-red-500/15 text-red-400">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Premium Planlar ───────────────────────────────────────────────────────────
function PlansView() {
  const [plans,setPlans]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState<any|null>(null);
  const [form,setForm]=useState({name:'',description:'',price:0,yearlyPrice:0,features:'',type:'user',active:true,highlighted:false});

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    const snap=await getDocs(query(collection(db,'plans'),orderBy('price','asc')));
    setPlans(snap.docs.map(d=>({id:d.id,...d.data()})));
    setLoading(false);
  }

  async function save(){
    if(!form.name) return;
    const features=form.features.split('\n').filter(Boolean);
    const data={...form,price:Number(form.price),yearlyPrice:Number(form.yearlyPrice),features,updatedAt:serverTimestamp()};
    if(editing?.id){
      await updateDoc(doc(db,'plans',editing.id),data);
    } else {
      await addDoc(collection(db,'plans'),{...data,createdAt:serverTimestamp()});
    }
    setEditing(null); setForm({name:'',description:'',price:0,yearlyPrice:0,features:'',type:'user',active:true,highlighted:false}); load();
  }

  async function del(id:string){
    if(!confirm('Silinsin mi?')) return;
    await deleteDoc(doc(db,'plans',id)); load();
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";

  return(
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Premium Planlar ({plans.length})</h3>
        <button onClick={()=>setEditing({})} className="text-xs px-4 py-2 rounded-full bg-[#C9832E] text-white hover:bg-[#b87523]">+ Yeni Plan</button>
      </div>

      {editing!==null && (
        <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5 mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{editing?.id?'Plan Düzenle':'Yeni Plan'}</h3>
            <button onClick={()=>setEditing(null)} className="text-white/30 hover:text-white text-xs">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Plan Adı *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className={INPUT}/></div>
            <div>
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Tür</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} className={INPUT}>
                <option value="user">Bireysel</option>
                <option value="vet">Veteriner</option>
                <option value="business">İşletme</option>
              </select>
            </div>
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Aylık Fiyat (₺)</label><input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:Number(e.target.value)}))} className={INPUT}/></div>
            <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Yıllık Fiyat (₺)</label><input type="number" value={form.yearlyPrice} onChange={e=>setForm(p=>({...p,yearlyPrice:Number(e.target.value)}))} className={INPUT}/></div>
          </div>
          <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Açıklama</label><input value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} className={INPUT}/></div>
          <div><label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Özellikler (her satıra bir tane)</label><textarea value={form.features} onChange={e=>setForm(p=>({...p,features:e.target.value}))} rows={5} placeholder="Pet pasaport&#10;Sınırsız ilan&#10;Öncelikli destek" className={`${INPUT} resize-none`}/></div>
          <div className="flex gap-4">
            {[{l:'Aktif',k:'active'},{l:'Öne Çıkan',k:'highlighted'}].map(f=>(
              <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                <div onClick={()=>setForm(p=>({...p,[f.k]:!(p as any)[f.k]}))}
                  className={`w-8 h-5 rounded-full transition-all relative ${(form as any)[f.k]?'bg-[#C9832E]':'bg-white/[.1]'}`}>
                  <div className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white transition-all ${(form as any)[f.k]?'left-[18px]':'left-[3px]'}`}/>
                </div>
                <span className="text-xs text-white/50">{f.l}</span>
              </label>
            ))}
          </div>
          <button onClick={save} className="w-full py-2 rounded-[10px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523]">
            {editing?.id?'Güncelle':'Plan Ekle'}
          </button>
        </div>
      )}

      {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : plans.length===0 ? <div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">💎</div><p>Henüz plan yok.</p></div>
      : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(p=>(
            <div key={p.id} className={`bg-[#1a1a2e] rounded-[16px] border p-4 ${p.highlighted?'border-[#C9832E]':'border-white/[.06]'}`}>
              {p.highlighted&&<div className="text-[10px] bg-[#C9832E] text-white px-2 py-[2px] rounded-full inline-block mb-2">Öne Çıkan</div>}
              <div className="font-semibold text-white mb-1">{p.name}</div>
              <div className="text-2xl font-bold text-[#C9832E] mb-1">₺{p.price}<span className="text-sm text-white/30">/ay</span></div>
              {p.yearlyPrice>0&&<div className="text-xs text-white/40 mb-2">₺{p.yearlyPrice}/yıl</div>}
              <div className="text-xs text-white/40 mb-3">{p.description}</div>
              <div className="space-y-1 mb-3">
                {(p.features||[]).slice(0,3).map((f:string,i:number)=>(
                  <div key={i} className="text-xs text-white/50 flex items-center gap-1"><span className="text-green-400">✓</span>{f}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>{setEditing(p);setForm({name:p.name,description:p.description||'',price:p.price,yearlyPrice:p.yearlyPrice||0,features:(p.features||[]).join('\n'),type:p.type||'user',active:p.active!==false,highlighted:p.highlighted||false});}} className="flex-1 text-xs py-1 rounded-full bg-blue-500/15 text-blue-400">Düzenle</button>
                <button onClick={()=>del(p.id)} className="flex-1 text-xs py-1 rounded-full bg-red-500/15 text-red-400">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Veteriner Profilleri ──────────────────────────────────────────────────────
function VetProfilesView() {
  const [vets,setVets]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState<any|null>(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    const snap=await getDocs(collection(db,'vets'));
    setVets(snap.docs.map(d=>({id:d.id,...d.data()})));
    setLoading(false);
  }

  async function save(id:string, data:any){
    await updateDoc(doc(db,'vets',id),{...data,updatedAt:serverTimestamp()});
    setVets(prev=>prev.map(v=>v.id===id?{...v,...data}:v));
    setEditing(null);
  }

  async function toggleOnline(id:string, online:boolean){
    await updateDoc(doc(db,'vets',id),{online:!online});
    setVets(prev=>prev.map(v=>v.id===id?{...v,online:!online}:v));
  }

  async function del(id:string){
    if(!confirm('Veteriner profili silinsin mi?')) return;
    await deleteDoc(doc(db,'vets',id)); load();
  }

  const INPUT="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none focus:border-[#C9832E]";

  return(
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Veteriner Profilleri ({vets.length})</h3>
      </div>

      {editing && (
        <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5 mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Profil Düzenle: {editing.name}</h3>
            <button onClick={()=>setEditing(null)} className="text-white/30 hover:text-white text-xs">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['Ad Soyad','name'],['Klinik','clinic'],['Şehir','city'],['İlçe','district'],['Telefon','phone'],['E-posta','email'],['Website','website'],['Instagram','instagram'],['Çalışma Saatleri','workingHours']].map(([l,k])=>(
              <div key={k}>
                <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">{l}</label>
                <input value={editing[k]||''} onChange={e=>setEditing((p:any)=>({...p,[k]:e.target.value}))} className={INPUT}/>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Hakkında</label>
            <textarea value={editing.bio||''} onChange={e=>setEditing((p:any)=>({...p,bio:e.target.value}))} rows={3} className={`${INPUT} resize-none`}/>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Avatar URL</label>
            <input value={editing.avatar||''} onChange={e=>setEditing((p:any)=>({...p,avatar:e.target.value}))} className={INPUT}/>
          </div>
          <button onClick={()=>save(editing.id,editing)} className="w-full py-2 rounded-[10px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523]">
            Kaydet
          </button>
        </div>
      )}

      {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : vets.length===0 ? <div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">🩺</div><p>Henüz veteriner yok.</p></div>
      : (
        <div className="space-y-3">
          {vets.map(v=>(
            <div key={v.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                  {v.avatar ? <img src={v.avatar} alt="" className="w-full h-full object-cover"/> : '🩺'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-white">{v.name}</span>
                    <span className={`text-[10px] px-2 py-[1px] rounded-full ${v.online?'bg-green-500/15 text-green-400':'bg-white/[.06] text-white/30'}`}>{v.online?'Online':'Offline'}</span>
                    {v.verified&&<span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-[1px] rounded-full">✓ Doğrulandı</span>}
                  </div>
                  <div className="text-xs text-white/40">{v.clinic} · {v.city}{v.district?`, ${v.district}`:''}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={()=>toggleOnline(v.id,v.online)} className={`text-[10px] px-3 py-1 rounded-full ${v.online?'bg-red-500/15 text-red-400':'bg-green-500/15 text-green-400'}`}>
                    {v.online?'Offline Yap':'Online Yap'}
                  </button>
                  <button onClick={()=>setEditing(v)} className="text-[10px] px-3 py-1 rounded-full bg-blue-500/15 text-blue-400">Düzenle</button>
                  <button onClick={()=>del(v.id)} className="text-[10px] px-3 py-1 rounded-full bg-red-500/15 text-red-400">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Blog Başvuruları (eski BlogView) ──────────────────────────────────────────
function BlogSubsView() {
  const [submissions,setSubmissions]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState<'pending'|'approved'|'rejected'>('pending');
  const [selected,setSelected]=useState<any|null>(null);
  const [processing,setProcessing]=useState<string|null>(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    try{const snap=await getDocs(query(collection(db,'blogSubmissions'),orderBy('createdAt','desc')));setSubmissions(snap.docs.map(d=>({id:d.id,...d.data()})));}catch(e){console.error(e);}
    setLoading(false);
  }
  async function handleApprove(id:string){setProcessing(id);await updateDoc(doc(db,'blogSubmissions',id),{status:'approved'});setSubmissions(prev=>prev.map(s=>s.id===id?{...s,status:'approved'}:s));setSelected(null);setProcessing(null);}
  async function handleReject(id:string){setProcessing(id);await updateDoc(doc(db,'blogSubmissions',id),{status:'rejected'});setSubmissions(prev=>prev.map(s=>s.id===id?{...s,status:'rejected'}:s));setSelected(null);setProcessing(null);}
  const filtered=submissions.filter(s=>s.status===filter);
  const STATUS_COLOR:Record<string,string>={pending:'bg-[rgba(201,131,46,.15)] text-[#C9832E]',approved:'bg-green-500/15 text-green-400',rejected:'bg-red-500/15 text-red-400'};

  return(
    <div>
      {selected&&(
        <div className="fixed inset-0 bg-black/70 z-[800] flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/[.1] rounded-[20px] w-full max-w-[680px] p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div><h3 className="text-lg font-semibold text-white mb-1">{selected.title}</h3><div className="text-xs text-white/40">{selected.name} · {selected.email}</div></div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 rounded-full bg-white/[.06] flex items-center justify-center text-white/50">✕</button>
            </div>
            <div className="bg-white/[.04] rounded-[12px] p-4 mb-4 text-sm text-white/70 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">{selected.content}</div>
            {selected.status==='pending'&&(
              <div className="flex gap-3">
                <button onClick={()=>handleReject(selected.id)} disabled={!!processing} className="flex-1 py-3 rounded-[12px] bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 disabled:opacity-50">✗ Reddet</button>
                <button onClick={()=>handleApprove(selected.id)} disabled={!!processing} className="flex-1 py-3 rounded-[12px] bg-green-500/15 text-green-400 text-sm hover:bg-green-500/25 disabled:opacity-50">✓ Onayla</button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{val:'pending',label:'Bekleyen',count:submissions.filter(s=>s.status==='pending').length},{val:'approved',label:'Onaylanan',count:submissions.filter(s=>s.status==='approved').length},{val:'rejected',label:'Reddedilen',count:submissions.filter(s=>s.status==='rejected').length}].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)} className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>{f.label} <span className="opacity-60">({f.count})</span></button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40 hover:bg-white/[.1]">↻</button>
      </div>
      {loading?<div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      :filtered.length===0?<div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">📭</div><p>Başvuru yok.</p></div>
      :(
        <div className="space-y-3">
          {filtered.map(s=>(
            <div key={s.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4 cursor-pointer hover:border-white/[.12]" onClick={()=>setSelected(s)}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white text-sm">{s.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[s.status]}`}>{s.status==='pending'?'Bekliyor':s.status==='approved'?'Onaylandı':'Reddedildi'}</span>
                  </div>
                  <div className="text-xs text-white/40">{s.name} · {s.email}</div>
                </div>
                {s.status==='pending'&&(
                  <div className="flex gap-2">
                    <button onClick={e=>{e.stopPropagation();handleApprove(s.id);}} className="text-xs px-3 py-1 rounded-lg bg-green-500/15 text-green-400">✓</button>
                    <button onClick={e=>{e.stopPropagation();handleReject(s.id);}} className="text-xs px-3 py-1 rounded-lg bg-red-500/15 text-red-400">✗</button>
                  </div>
                )}
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
  const [services,setServices]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState<'pending'|'active'|'rejected'>('pending');
  const [processing,setProcessing]=useState<string|null>(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    setLoading(true);
    try{const snap=await getDocs(query(collection(db,'services'),orderBy('createdAt','desc')));setServices(snap.docs.map(d=>({id:d.id,...d.data()})));}catch(e){console.error(e);}
    setLoading(false);
  }
  async function handleApprove(id:string){setProcessing(id);await updateDoc(doc(db,'services',id),{status:'active'});setServices(prev=>prev.map(s=>s.id===id?{...s,status:'active'}:s));setProcessing(null);}
  async function handleReject(id:string){setProcessing(id);await updateDoc(doc(db,'services',id),{status:'rejected'});setServices(prev=>prev.map(s=>s.id===id?{...s,status:'rejected'}:s));setProcessing(null);}

  const filtered=services.filter(s=>s.status===filter);
  const TYPE:Record<string,string>={groomer:'✂️ Kuaför',hotel:'🏨 Otel',trainer:'🎓 Eğitmen',vet:'🩺 Veteriner'};
  const STATUS_COLOR:Record<string,string>={pending:'bg-[rgba(201,131,46,.15)] text-[#C9832E]',active:'bg-green-500/15 text-green-400',rejected:'bg-red-500/15 text-red-400'};

  return(
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{val:'pending',label:'Bekleyen',count:services.filter(s=>s.status==='pending').length},{val:'active',label:'Aktif',count:services.filter(s=>s.status==='active').length},{val:'rejected',label:'Reddedilen',count:services.filter(s=>s.status==='rejected').length}].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)} className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>{f.label} <span className="opacity-60">({f.count})</span></button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40">↻</button>
      </div>
      {loading?<div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      :filtered.length===0?<div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">📭</div><p>Başvuru yok.</p></div>
      :(
        <div className="space-y-3">
          {filtered.map(s=>(
            <div key={s.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{s.businessName}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[s.status]||''}`}>{s.status==='pending'?'Bekliyor':s.status==='active'?'Aktif':'Reddedildi'}</span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{TYPE[s.type]||s.type}</span>
                  </div>
                  <div className="text-xs text-white/40">📍 {s.city}{s.district?`, ${s.district}`:''} · {s.ownerEmail}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {s.status==='pending'&&(<>
                    <button onClick={()=>handleApprove(s.id)} disabled={processing===s.id} className="text-xs px-4 py-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 disabled:opacity-50">✓ Onayla</button>
                    <button onClick={()=>handleReject(s.id)} disabled={!!processing} className="text-xs px-4 py-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-50">✗ Reddet</button>
                  </>)}
                  {s.status==='active'&&<button onClick={()=>handleReject(s.id)} className="text-xs px-4 py-2 rounded-lg bg-red-500/15 text-red-400">Kaldır</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── İlan Moderasyonu ──────────────────────────────────────────────────────────
function ListingsView({user}:{user:User|null}) {
  const [listings,setListings]=useState<Listing[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState<'pending'|'active'|'rejected'|'all'>('pending');
  const [rejectId,setRejectId]=useState<string|null>(null);
  const [reason,setReason]=useState('');
  const [processing,setProcessing]=useState<string|null>(null);

  useEffect(()=>{ load(); },[]);
  async function load(){setLoading(true);try{setListings(await getAllListings());}catch(e){console.error(e);}setLoading(false);}
  async function handleApprove(id:string){if(!user)return;setProcessing(id);await approveListing(id,user.uid);setListings(prev=>prev.map(l=>l.id===id?{...l,status:'active'}:l));setProcessing(null);}
  async function handleReject(id:string){if(!reason.trim()){alert('Red sebebi yazın.');return;}setProcessing(id);await rejectListing(id,reason);setListings(prev=>prev.map(l=>l.id===id?{...l,status:'rejected',rejectionReason:reason}:l));setRejectId(null);setReason('');setProcessing(null);}

  const filtered=listings.filter(l=>filter==='all'?true:l.status===filter);
  const STATUS_COLOR:Record<string,string>={pending:'bg-[rgba(201,131,46,.15)] text-[#C9832E]',active:'bg-green-500/15 text-green-400',rejected:'bg-red-500/15 text-red-400',closed:'bg-white/[.06] text-white/40'};
  const TYPE_LABEL:Record<string,string>={adoption:'Sahiplendirme',temp:'Geçici Yuva',lost:'Kayıp',found:'Bulundu'};

  return(
    <div>
      {rejectId&&(
        <div className="fixed inset-0 bg-black/60 z-[800] flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/[.1] rounded-[20px] w-full max-w-[480px] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">İlanı Reddet</h3>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Red sebebi…" rows={4} className="w-full px-3 py-3 rounded-[12px] bg-white/[.06] border border-white/[.1] text-white text-sm focus:outline-none resize-none mb-4"/>
            <div className="flex gap-2">
              <button onClick={()=>{setRejectId(null);setReason('');}} className="flex-1 py-3 rounded-[12px] border border-white/[.1] text-white/60 text-sm">İptal</button>
              <button onClick={()=>handleReject(rejectId)} disabled={!!processing} className="flex-1 py-3 rounded-[12px] bg-red-500 text-white text-sm font-medium disabled:opacity-60">Reddet</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{val:'pending',label:'Bekleyen',count:listings.filter(l=>l.status==='pending').length},{val:'active',label:'Aktif',count:listings.filter(l=>l.status==='active').length},{val:'rejected',label:'Reddedilen',count:listings.filter(l=>l.status==='rejected').length},{val:'all',label:'Tümü',count:listings.length}].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)} className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>{f.label} <span className="opacity-60">({f.count})</span></button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40">↻</button>
      </div>
      {loading?<div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      :filtered.length===0?<div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">📭</div><p>İlan yok.</p></div>
      :(
        <div className="space-y-3">
          {filtered.map(l=>(
            <div key={l.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-14 h-14 rounded-[10px] bg-white/[.06] flex-shrink-0 overflow-hidden">
                  {l.imageUrls?.[0] ? <img src={l.imageUrls[0]} alt={l.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{l.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[l.status]||''}`}>{l.status==='pending'?'Bekliyor':l.status==='active'?'Aktif':l.status==='rejected'?'Reddedildi':'Kapalı'}</span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{TYPE_LABEL[l.type]||l.type}</span>
                  </div>
                  <div className="text-xs text-white/40">{l.breed} · {l.city} · {l.ownerEmail}</div>
                  {l.status==='rejected'&&(l as any).rejectionReason&&<div className="text-xs text-red-400 mt-1">Red: {(l as any).rejectionReason}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  {l.status==='pending'&&(<>
                    <button onClick={()=>handleApprove(l.id!)} disabled={processing===l.id} className="text-xs px-3 py-1 rounded-lg bg-green-500/15 text-green-400 disabled:opacity-50">✓ Onayla</button>
                    <button onClick={()=>{setRejectId(l.id!);setReason('');}} disabled={!!processing} className="text-xs px-3 py-1 rounded-lg bg-red-500/15 text-red-400 disabled:opacity-50">✗ Reddet</button>
                  </>)}
                  {l.status==='active'&&<button onClick={()=>{setRejectId(l.id!);setReason('');}} className="text-xs px-3 py-1 rounded-lg bg-red-500/15 text-red-400">Kaldır</button>}
                  {l.status==='rejected'&&<button onClick={()=>handleApprove(l.id!)} className="text-xs px-3 py-1 rounded-lg bg-green-500/15 text-green-400">Onayla</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Kullanıcılar ──────────────────────────────────────────────────────────────
function UsersView() {
  const [users,setUsers]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');

  useEffect(()=>{
    async function load(){
      try{const snap=await getDocs(query(collection(db,'users'),orderBy('createdAt','desc')));setUsers(snap.docs.map(d=>({id:d.id,...d.data()})));}catch(e){console.error(e);}
      setLoading(false);
    }
    load();
  },[]);

  async function toggleBan(userId:string, role:string){
    const newRole=role==='banned'?'user':'banned';
    await updateDoc(doc(db,'users',userId),{role:newRole});
    setUsers(prev=>prev.map(u=>u.id===userId?{...u,role:newRole}:u));
  }
  async function makeAdmin(userId:string){
    if(!confirm('Admin yapılsın mı?')) return;
    await updateDoc(doc(db,'users',userId),{role:'admin'});
    setUsers(prev=>prev.map(u=>u.id===userId?{...u,role:'admin'}:u));
  }

  const filtered=users.filter(u=>!search||(u.name+' '+u.surname+' '+u.email).toLowerCase().includes(search.toLowerCase()));
  const ROLE_COLOR:Record<string,string>={admin:'bg-red-500/15 text-red-400',vet:'bg-blue-500/15 text-blue-400',user:'bg-white/[.06] text-white/50',banned:'bg-red-900/30 text-red-500'};

  return(
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Kullanıcılar ({users.length})</h3>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ara…" className="px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/80 text-sm focus:outline-none w-[200px]"/>
      </div>
      {loading?<div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>:(
        <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/[.06]">
                {['Ad Soyad','E-posta','Rol','Plan','Kayıt','İşlem'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold tracking-[.12em] uppercase text-white/30 whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((u,i)=>(
                  <tr key={u.id} className={`border-b border-white/[.04] hover:bg-white/[.02] ${i%2===0?'':'bg-white/[.01]'}`}>
                    <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">{u.name} {u.surname}</td>
                    <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${ROLE_COLOR[u.role]||ROLE_COLOR.user}`}>{u.role||'user'}</span></td>
                    <td className="px-4 py-3 text-xs text-white/40">{u.plan||'free'}</td>
                    <td className="px-4 py-3 text-xs text-white/30 whitespace-nowrap">{u.createdAt?.toDate?.()?.toLocaleDateString('tr-TR')||'—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {u.role!=='admin'&&<button onClick={()=>makeAdmin(u.id)} className="text-[10px] px-2 py-1 rounded bg-[rgba(201,131,46,.15)] text-[#C9832E] hover:bg-[rgba(201,131,46,.25)]">Admin</button>}
                        <button onClick={()=>toggleBan(u.id,u.role)} className={`text-[10px] px-2 py-1 rounded ${u.role==='banned'?'bg-green-500/15 text-green-400':'bg-red-500/10 text-red-400'}`}>{u.role==='banned'?'Aktif Et':'Banla'}</button>
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

// ── Veteriner Başvuruları ─────────────────────────────────────────────────────
function VetApplicationsView({user}:{user:User|null}) {
  const [apps,setApps]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState('pending');
  const [selected,setSelected]=useState<any|null>(null);
  const [processing,setProcessing]=useState<string|null>(null);
  const [adminNote,setAdminNote]=useState('');
  const [meetDate,setMeetDate]=useState('');
  const [showContract,setShowContract]=useState(false);
  const [contractData,setContractData]=useState({startDate:new Date().toISOString().split('T')[0],endDate:'',monthlyFee:'599',yearlyFee:'5990',planType:'monthly',notes:''});

  useEffect(()=>{ load(); },[]);
  async function load(){setLoading(true);try{const snap=await getDocs(query(collection(db,'vetApplications'),orderBy('createdAt','desc')));setApps(snap.docs.map(d=>({id:d.id,...d.data()})));}catch(e){console.error(e);}setLoading(false);}

  async function updateStatus(id:string,status:string,extra:any={}){
    setProcessing(id);
    try{await updateDoc(doc(db,'vetApplications',id),{status,...extra,updatedAt:serverTimestamp()});setApps(prev=>prev.map(a=>a.id===id?{...a,status,...extra}:a));if(selected?.id===id)setSelected((prev:any)=>({...prev,status,...extra}));}
    catch(e:any){alert('Hata: '+e.message);}
    finally{setProcessing(null);}
  }

  async function sendMeetingRequest(app:any){
    if(!meetDate){alert('Görüşme tarihi seçin.');return;}
    await updateStatus(app.id,'meeting_scheduled',{meetingDate:meetDate,adminNotes:adminNote});
    await fetch('/api/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'vet_meeting',data:{vetEmail:app.email,vetName:app.fullName,meetingDate:meetDate,adminNotes:adminNote}})});
    setMeetDate('');alert('Görüşme daveti gönderildi!');
  }

  async function sendContract(app:any){
    await addDoc(collection(db,'vetContracts'),{vetApplicationId:app.id,vetUserId:app.userId,vetName:`${app.title} ${app.name}`,clinicName:app.clinicName,city:app.city,...contractData,status:'sent',sentAt:serverTimestamp(),sentBy:'admin',signedAt:null});
    await updateStatus(app.id,'contract_sent',{contractSentAt:new Date().toISOString()});
    await fetch('/api/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'vet_contract',data:{vetEmail:app.email,vetName:app.fullName,clinicName:app.clinicName,...contractData}})});
    setShowContract(false);alert('Sözleşme maili gönderildi!');
  }

  async function approveVet(app:any){
    if(!confirm(`${app.title} ${app.name} onaylanacak?`)) return;
    try{await updateDoc(doc(db,'users',app.userId),{role:'vet',vetSlug:app.slug,updatedAt:serverTimestamp()});}catch(e){console.error(e);}
    try{await addDoc(collection(db,'vets'),{userId:app.userId,name:`${app.title} ${app.name}`,slug:app.slug,clinic:app.clinicName,city:app.city,district:app.district||'',phone:app.phone,email:app.email,website:app.website||'',instagram:app.instagram||'',spec:app.specs||[],bio:app.bio||'',education:app.education,gradYear:app.gradYear||'',experience:app.experience||'',workingHours:app.workHours||'',avatar:app.avatarUrl||'',rating:0,reviewCount:0,online:false,verified:true,planType:app.planType||'monthly',status:'active',createdAt:serverTimestamp()});}catch(e){console.error(e);}
    await updateStatus(app.id,'approved',{approvedAt:new Date().toISOString()});
    await fetch('/api/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'vet_approved',data:{vetEmail:app.email,vetName:app.fullName,vetSlug:app.slug}})});
    alert('Veteriner onaylandı ve profili yayına alındı!');
  }

  async function rejectApp(app:any){const reason=prompt('Red sebebi:');if(!reason)return;await updateStatus(app.id,'rejected',{rejectionReason:reason});}

  async function deleteVetProfile(app:any){
    if(!confirm('Profil silinsin mi?')) return;
    try{
      const snap=await getDocs(query(collection(db,'vets'),where('userId','==',app.userId)));
      for(const d of snap.docs){await deleteDoc(d.ref);}
      await updateDoc(doc(db,'users',app.userId),{role:'user',vetSlug:''});
      await updateStatus(app.id,'rejected',{rejectionReason:'Admin tarafından silindi.'});
      alert('Silindi.');
    }catch(e:any){alert('Hata: '+e.message);}
  }

  const filtered=apps.filter(a=>filter==='all'?true:a.status===filter);
  const STATUS_LABEL:Record<string,string>={pending:'Bekliyor',reviewing:'İnceleniyor',meeting_scheduled:'Görüşme Planlandı',contract_sent:'Sözleşme Gönderildi',approved:'Onaylandı',rejected:'Reddedildi'};
  const STATUS_COLOR:Record<string,string>={pending:'bg-[rgba(201,131,46,.15)] text-[#C9832E]',reviewing:'bg-blue-500/15 text-blue-400',meeting_scheduled:'bg-purple-500/15 text-purple-400',contract_sent:'bg-yellow-500/15 text-yellow-500',approved:'bg-green-500/15 text-green-400',rejected:'bg-red-500/15 text-red-400'};
  const FILTERS=[{val:'pending',label:'Bekleyen'},{val:'reviewing',label:'İnceleniyor'},{val:'meeting_scheduled',label:'Görüşme'},{val:'contract_sent',label:'Sözleşme'},{val:'approved',label:'Onaylı'},{val:'all',label:'Tümü'}];

  return(
    <div>
      {selected&&(
        <div className="fixed inset-0 bg-black/70 z-[800] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a2e] border border-white/[.1] rounded-[20px] w-full max-w-[700px] p-6 my-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-semibold text-white">{selected.title} {selected.name}</h3>
                <div className="text-sm text-white/40">{selected.clinicName} · {selected.city}</div>
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[selected.status]}`}>{STATUS_LABEL[selected.status]}</span>
              </div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 rounded-full bg-white/[.06] flex items-center justify-center text-white/50">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              {[['Telefon',selected.phone],['E-posta',selected.email],['TC No',selected.tcNo],['Vergi No',selected.taxNo||'-'],['Şehir',`${selected.city} ${selected.district||''}`],['Eğitim',selected.education],['Plan',selected.planType==='yearly'?'Yıllık':'Aylık'],['Deneyim',`${selected.experience} yıl`]].map(([l,v])=>(
                <div key={l} className="bg-white/[.04] rounded-[10px] p-2">
                  <div className="text-[10px] text-white/30 mb-1">{l}</div>
                  <div className="text-white/70 text-xs">{v}</div>
                </div>
              ))}
            </div>
            {selected.bio&&<div className="bg-white/[.04] rounded-[12px] p-3 mb-3 text-sm text-white/60">{selected.bio}</div>}
            {selected.diplomaUrl&&<a href={selected.diplomaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#C9832E] hover:underline mb-3">📄 Diploma Görüntüle →</a>}
            <div className="mb-3">
              <label className="block text-[10px] uppercase tracking-[.1em] text-white/30 mb-1">Admin Notu</label>
              <textarea value={adminNote||selected.adminNotes||''} onChange={e=>setAdminNote(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none resize-none"/>
            </div>
            {['pending','reviewing'].includes(selected.status)&&(
              <div className="border border-white/[.08] rounded-[14px] p-4 mb-3">
                <div className="text-sm font-semibold text-white/70 mb-2">📅 Görüşme Planla</div>
                <div className="flex gap-2">
                  <input type="datetime-local" value={meetDate} onChange={e=>setMeetDate(e.target.value)} className="flex-1 px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none"/>
                  <button onClick={()=>sendMeetingRequest(selected)} disabled={!meetDate||!!processing} className="px-4 py-2 rounded-[10px] bg-purple-500/20 text-purple-300 text-sm disabled:opacity-50">Davet Gönder</button>
                </div>
              </div>
            )}
            {['meeting_scheduled','reviewing'].includes(selected.status)&&(
              <div className="border border-white/[.08] rounded-[14px] p-4 mb-3">
                <button onClick={()=>setShowContract(v=>!v)} className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">📋 Dijital Sözleşme {showContract?'▲':'▼'}</button>
                {showContract&&(
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="block text-[10px] text-white/30 mb-1">Başlangıç</label><input type="date" value={contractData.startDate} onChange={e=>setContractData(p=>({...p,startDate:e.target.value}))} className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none"/></div>
                      <div><label className="block text-[10px] text-white/30 mb-1">Bitiş</label><input type="date" value={contractData.endDate} onChange={e=>setContractData(p=>({...p,endDate:e.target.value}))} className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none"/></div>
                      <div><label className="block text-[10px] text-white/30 mb-1">Aylık Ücret (₺)</label><input value={contractData.monthlyFee} onChange={e=>setContractData(p=>({...p,monthlyFee:e.target.value}))} className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none"/></div>
                      <div><label className="block text-[10px] text-white/30 mb-1">Yıllık Ücret (₺)</label><input value={contractData.yearlyFee} onChange={e=>setContractData(p=>({...p,yearlyFee:e.target.value}))} className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none"/></div>
                    </div>
                    <select value={contractData.planType} onChange={e=>setContractData(p=>({...p,planType:e.target.value}))} className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none">
                      <option value="monthly">Aylık</option><option value="yearly">Yıllık</option>
                    </select>
                    <textarea value={contractData.notes} onChange={e=>setContractData(p=>({...p,notes:e.target.value}))} placeholder="Özel şartlar…" rows={2} className="w-full px-3 py-2 rounded-[10px] bg-white/[.06] border border-white/[.1] text-white/70 text-sm focus:outline-none resize-none"/>
                    <button onClick={()=>sendContract(selected)} className="w-full py-2 rounded-[10px] bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30">📧 Sözleşmeyi Gönder</button>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {selected.status==='pending'&&<button onClick={()=>updateStatus(selected.id,'reviewing',{adminNotes:adminNote})} className="flex-1 py-2 rounded-[10px] bg-blue-500/15 text-blue-400 text-sm hover:bg-blue-500/25">🔍 İncelemeye Al</button>}
              {selected.status==='contract_sent'&&<button onClick={()=>approveVet(selected)} disabled={!!processing} className="flex-1 py-2 rounded-[10px] bg-green-500/15 text-green-400 text-sm font-semibold hover:bg-green-500/25 disabled:opacity-50">✓ Onayla & Yayına Al</button>}
              {!['approved','rejected'].includes(selected.status)&&<button onClick={()=>rejectApp(selected)} disabled={!!processing} className="flex-1 py-2 rounded-[10px] bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 disabled:opacity-50">✗ Reddet</button>}
              {selected.status==='approved'&&<button onClick={()=>deleteVetProfile(selected)} className="flex-1 py-2 rounded-[10px] bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25">🗑 Profili Sil</button>}
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val)} className={`text-sm px-3 py-[6px] rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>{f.label} <span className="opacity-50 text-[10px]">({apps.filter(a=>f.val==='all'?true:a.status===f.val).length})</span></button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40">↻</button>
      </div>
      {loading?<div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      :filtered.length===0?<div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">🩺</div><p>Başvuru yok.</p></div>
      :(
        <div className="space-y-3">
          {filtered.map(a=>(
            <div key={a.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4 cursor-pointer hover:border-white/[.12]" onClick={()=>{setSelected(a);setAdminNote(a.adminNotes||'');setShowContract(false);}}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{a.title} {a.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[a.status]}`}>{STATUS_LABEL[a.status]}</span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{a.planType==='yearly'?'Yıllık':'Aylık'}</span>
                  </div>
                  <div className="text-xs text-white/40">{a.clinicName} · {a.city} · {a.email}</div>
                  {a.meetingDate&&<div className="text-xs text-purple-400 mt-1">📅 Görüşme: {new Date(a.meetingDate).toLocaleString('tr-TR')}</div>}
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

// ── Sistem Ayarları ───────────────────────────────────────────────────────────
function SettingsView() {
  return(
    <div className="max-w-[600px] space-y-4">
      <div className="bg-[#1a1a2e] rounded-[16px] border border-white/[.06] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">🔗 Hızlı Linkler</h3>
        <div className="flex flex-col gap-2">
          {[['Firebase Console','https://console.firebase.google.com'],['Vercel Dashboard','https://vercel.com/patipetra'],['GitHub Repo','https://github.com/patipetra/patipetra'],['Google Analytics','https://analytics.google.com'],['Resend Dashboard','https://resend.com'],['Google reCAPTCHA','https://www.google.com/recaptcha/admin']].map(([l,url])=>(
            <a key={l} href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-[12px] bg-white/[.04] border border-white/[.06] text-sm text-white/60 hover:bg-white/[.08] hover:text-white/80 transition-all">
              {l} <span className="text-white/30">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Topluluk Başvuruları ──────────────────────────────────────────────────────
function CommunitiesView() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState<'pending'|'active'|'rejected'>('pending');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db,'communities'),
        where('isDefault','==',false), orderBy('createdAt','desc')));
      setCommunities(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function approve(id: string) {
    await updateDoc(doc(db,'communities',id), {status:'active'});
    setCommunities(prev=>prev.map(c=>c.id===id?{...c,status:'active'}:c));
  }

  async function reject(id: string) {
    const reason = prompt('Red sebebi:');
    if (!reason) return;
    await updateDoc(doc(db,'communities',id), {status:'rejected', rejectionReason:reason});
    setCommunities(prev=>prev.map(c=>c.id===id?{...c,status:'rejected'}:c));
  }

  async function del(id: string) {
    if (!confirm('Silinsin mi?')) return;
    await deleteDoc(doc(db,'communities',id));
    setCommunities(prev=>prev.filter(c=>c.id!==id));
  }

  const filtered = communities.filter(c => c.status === filter || (!c.status && filter==='pending'));
  const STATUS_COLOR: Record<string,string> = {
    pending:  'bg-[rgba(201,131,46,.15)] text-[#C9832E]',
    active:   'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
  };

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          {val:'pending',  label:'Bekleyen',  count:communities.filter(c=>!c.status||c.status==='pending').length},
          {val:'active',   label:'Onaylanan', count:communities.filter(c=>c.status==='active').length},
          {val:'rejected', label:'Reddedilen',count:communities.filter(c=>c.status==='rejected').length},
        ].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#C9832E] text-white':'bg-white/[.06] text-white/60 hover:bg-white/[.1]'}`}>
            {f.label} <span className="opacity-60">({f.count})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white/[.06] text-white/40">↻</button>
      </div>

      {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : filtered.length===0 ? <div className="text-center py-12 text-white/40"><div className="text-4xl mb-3">🏘️</div><p>Başvuru yok.</p></div>
      : (
        <div className="space-y-3">
          {filtered.map(c=>(
            <div key={c.id} className="bg-[#1a1a2e] rounded-[14px] border border-white/[.06] p-4">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="text-3xl flex-shrink-0">{c.emoji||'🐾'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[c.status||'pending']}`}>
                      {c.status==='active'?'Onaylı':c.status==='rejected'?'Reddedildi':'Bekliyor'}
                    </span>
                    <span className="text-[10px] bg-white/[.06] text-white/40 px-2 py-[2px] rounded-full">{c.category}</span>
                  </div>
                  <div className="text-xs text-white/50 mb-1">{c.description}</div>
                  <div className="text-xs text-white/30">👤 {c.creatorName} · {c.creatorEmail}</div>
                  {c.rejectionReason && <div className="text-xs text-red-400 mt-1">Red: {c.rejectionReason}</div>}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {(!c.status||c.status==='pending') && (
                    <>
                      <button onClick={()=>approve(c.id)} className="text-xs px-4 py-2 rounded-full bg-green-500/15 text-green-400 hover:bg-green-500/25">✓ Onayla</button>
                      <button onClick={()=>reject(c.id)} className="text-xs px-4 py-2 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25">✗ Reddet</button>
                    </>
                  )}
                  {c.status==='active' && (
                    <button onClick={()=>reject(c.id)} className="text-xs px-4 py-2 rounded-full bg-red-500/15 text-red-400">Kaldır</button>
                  )}
                  <button onClick={()=>del(c.id)} className="text-xs px-4 py-2 rounded-full bg-white/[.06] text-white/40 hover:bg-white/[.1]">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
