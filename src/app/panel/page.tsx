'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, logout } from '@/lib/auth';
import Logo from '@/components/layout/Logo';
import { CITIES_81 } from '@/data/cities';
import type { User } from 'firebase/auth';

const NAV=[
  {id:'dashboard',  icon:'🏠', label:'Dashboard'},
  {id:'petlerim',   icon:'🐾', label:'Pet Pasaportlarım'},
  {id:'ilanlarim',  icon:'📢', label:'İlanlarım', badge:2},
  {id:'mesajlar',   icon:'💬', label:'Mesajlarım', badge:3},
  {id:'bildirimler',icon:'🔔', label:'Bildirimler', badge:5},
  {id:'profil',     icon:'👤', label:'Profilim'},
  {id:'premium',    icon:'✦',  label:"Premium'a Geç"},
  {id:'ayarlar',    icon:'⚙',  label:'Ayarlar'},
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({active,setActive,user,open,setOpen}:{active:string;setActive:(p:string)=>void;user:User|null;open:boolean;setOpen:(v:boolean)=>void}) {
  const router = useRouter();
  return (
    <>
      {open&&<div className="fixed inset-0 bg-black/50 z-[190] lg:hidden" onClick={()=>setOpen(false)}/>}
      <aside className={`fixed top-0 left-0 bottom-0 w-[260px] bg-[#2F2622] z-[200] flex flex-col overflow-y-auto transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-5 border-b border-white/[.07] flex-shrink-0">
          <Link href="/" onClick={()=>setOpen(false)}><Logo dark height={38}/></Link>
        </div>
        <div className="px-4 py-4 border-b border-white/[.07] flex items-center gap-3 cursor-pointer hover:bg-white/[.04] transition-colors" onClick={()=>setActive('profil')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-lg flex-shrink-0">🧑</div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.displayName||user?.email?.split('@')[0]||'Kullanıcı'}</div>
            <div className="text-[10px] tracking-[.1em] uppercase text-[#E8B86D] mt-[2px]">✦ Ücretsiz Plan</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3">
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>{setActive(item.id);setOpen(false);}}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] text-sm font-normal transition-all text-left mb-[2px] ${active===item.id?'bg-[rgba(201,131,46,.18)] text-[#E8B86D] font-medium':'text-white/60 hover:bg-white/[.07] hover:text-white/90'}`}>
              <span className="w-[18px] text-center text-[15px] flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge&&<span className="bg-[#C9832E] text-[#2F2622] text-[10px] font-bold px-[7px] py-[2px] rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-3 border-t border-white/[.07] pt-3">
          <div className="bg-gradient-to-br from-[rgba(201,131,46,.25)] to-[rgba(201,131,46,.1)] border border-[rgba(201,131,46,.3)] rounded-[14px] p-4 mb-2">
            <div className="font-serif text-base font-semibold text-[#E8B86D] mb-1">Premium'u keşfet ✦</div>
            <div className="text-[11px] text-white/45 mb-3 leading-relaxed">Sınırsız pet, özel rehberler</div>
            <button onClick={()=>setActive('premium')} className="w-full bg-[#C9832E] text-[#2F2622] text-xs font-semibold py-2 rounded-[9px] hover:bg-[#E8B86D] transition-colors">Planları Gör →</button>
          </div>
          <button onClick={async()=>{await logout();router.push('/');}}
            className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] text-sm text-white/50 hover:bg-white/[.07] hover:text-white/80 transition-all">
            <span className="text-base">🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Topbar ────────────────────────────────────────────────────────────────────
function Topbar({title,sidebarOpen,setSidebarOpen,setActive}:{title:string;sidebarOpen:boolean;setSidebarOpen:(v:boolean)=>void;setActive:(p:string)=>void}) {
  return (
    <header className="h-16 bg-[rgba(247,242,234,.95)] backdrop-blur-[16px] border-b border-[rgba(196,169,107,.15)] sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-9 h-9 rounded-[10px] flex flex-col items-center justify-center gap-[5px] hover:bg-[#EDE5D3] transition-colors" onClick={()=>setSidebarOpen(!sidebarOpen)} aria-label="Menü">
          <span className="w-[18px] h-[1.5px] bg-[#2F2622] rounded"/><span className="w-[18px] h-[1.5px] bg-[#2F2622] rounded"/><span className="w-[18px] h-[1.5px] bg-[#2F2622] rounded"/>
        </button>
        <h1 className="font-serif text-xl font-semibold text-[#2F2622]">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={()=>setActive('mesajlar')} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[17px] text-[#7A7368] hover:bg-[#EDE5D3] relative transition-colors">
          💬<span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-[#C9832E] border-2 border-[rgba(247,242,234,.95)]"/>
        </button>
        <button onClick={()=>setActive('bildirimler')} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[17px] text-[#7A7368] hover:bg-[#EDE5D3] transition-colors">🔔</button>
        <button onClick={()=>setActive('profil')} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[22px] hover:bg-[#EDE5D3] transition-colors">🧑</button>
      </div>
    </header>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashView({setActive,user}:{setActive:(p:string)=>void;user:User|null}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622]">Merhaba, {user?.displayName?.split(' ')[0]||'Hoş geldiniz'} 👋</h2>
        <p className="text-sm text-[#7A7368] mt-1">Petlerinizin durumuna genel bakış</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {[{i:'🐾',l:'Pet Profilim',v:'3',t:'↑ 1 bu ay',c:'rgba(201,131,46,.1)'},{i:'📢',l:'Aktif İlan',v:'2',t:'347 görüntülenme',c:'rgba(107,124,92,.1)'},{i:'💬',l:'Okunmamış Mesaj',v:'3',t:'Yanıt bekliyor',c:'rgba(193,123,92,.1)'},{i:'💉',l:'Yaklaşan Aşı',v:'1',t:'⚠ Luna — 12 Nis',c:'rgba(201,131,46,.12)'}].map(s=>(
          <div key={s.l} className="bg-white rounded-[18px] p-5 border border-[rgba(196,169,107,.12)] hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-lg mb-3" style={{background:s.c}}>{s.i}</div>
            <div className="font-serif text-[28px] font-semibold text-[#2F2622] leading-none">{s.v}</div>
            <div className="text-xs text-[#7A7368] mt-1">{s.l}</div>
            <div className="text-[11px] text-[#C9832E] mt-[6px]">{s.t}</div>
          </div>
        ))}
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-3">Hızlı İşlemler</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[{l:'+ İlan Ver',p:'ilanlarim',s:0},{l:'+ Pet Ekle',p:'petlerim',s:1},{l:'İlanlarım →',p:'ilanlarim',s:2},{l:'Pet Pasaport →',p:'petlerim',s:2}].map((b,i)=>(
          <button key={i} onClick={()=>setActive(b.p)}
            className={`py-4 rounded-[14px] text-sm font-medium transition-all hover:-translate-y-[1px] ${b.s===0?'bg-[#C9832E] text-white border border-[#C9832E] hover:bg-[#b87523]':b.s===1?'bg-[#5C4A32] text-white border border-[#5C4A32] hover:bg-[#2F2622]':'bg-white text-[#5C4A32] border border-[#8B7355] hover:bg-[#5C4A32] hover:text-white'}`}>
            {b.l}
          </button>
        ))}
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-3">Yaklaşan Aşılar</h3>
      <div className="flex flex-col gap-2">
        {[{i:'💉',t:'Luna — Karma Aşı',s:'12 Nisan 2026 · Dr. Ayşe Kaya',tag:'7 Gün'},{i:'🩺',t:'Max — Yıllık Kontrol',s:'24 Nisan 2026',tag:'19 Gün'},{i:'💊',t:'Pamuk — Parazit İlacı',s:'1 Mayıs 2026',tag:'26 Gün'}].map(v=>(
          <div key={v.t} className="bg-white rounded-[14px] p-4 flex items-center gap-4 border border-[rgba(196,169,107,.12)] hover:bg-[#F7F2EA] cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-[12px] bg-[#F7F2EA] flex items-center justify-center text-lg border border-[rgba(196,169,107,.15)] flex-shrink-0">{v.i}</div>
            <div className="flex-1 min-w-0"><div className="text-sm font-medium text-[#2F2622]">{v.t}</div><div className="text-xs text-[#7A7368]">{v.s}</div></div>
            <span className="text-[10px] font-medium px-[10px] py-1 rounded-full flex-shrink-0 bg-[rgba(201,131,46,.12)] text-[#C9832E]">{v.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pet Pasaportlarım ─────────────────────────────────────────────────────────
function PetsView() {
  const PETS=[
    {name:'Luna', breed:'British Shorthair',gender:'Dişi',age:'3 yaş',emoji:'🐱',bg:'from-[#EDD5BE] to-[#C9A98C]',w:'4.2 kg'},
    {name:'Max',  breed:'Golden Retriever', gender:'Erkek',age:'2 yaş',emoji:'🐶',bg:'from-[#D8E8D0] to-[#9EC49A]',w:'28 kg'},
    {name:'Pamuk',breed:'Van Kedisi',       gender:'Dişi',age:'5 yaş',emoji:'🐾',bg:'from-[#D5E0E8] to-[#9AB0C4]',w:'3.8 kg'},
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl font-semibold text-[#2F2622]">Pet Pasaportlarım</h2>
        <button className="bg-[#C9832E] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#b87523] transition-colors">+ Yeni Pet Ekle</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PETS.map(p=>(
          <div key={p.name} className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
            <div className={`h-32 bg-gradient-to-br ${p.bg} flex items-center justify-center text-5xl`}>{p.emoji}</div>
            <div className="p-4">
              <div className="font-serif text-xl font-semibold text-[#2F2622] mb-1">{p.name}</div>
              <div className="text-xs text-[#7A7368] mb-3">{p.breed} · {p.gender} · {p.age}</div>
              <div className="flex gap-2 flex-wrap mb-3">
                <span className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-1 rounded-full">{p.w}</span>
                <span className="text-[10px] bg-[rgba(107,124,92,.1)] text-[#6B7C5C] px-2 py-1 rounded-full border border-[rgba(107,124,92,.25)]">Aşılı</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-[#5C4A32] text-white text-xs font-medium py-2 rounded-full hover:bg-[#2F2622] transition-colors">Pasaport</button>
                <button className="flex-1 border border-[#8B7355] text-[#5C4A32] text-xs font-medium py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">Düzenle</button>
              </div>
            </div>
          </div>
        ))}
        <div className="border-2 border-dashed border-[#E3D9C6] rounded-[20px] min-h-[220px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#C9832E] hover:bg-[#F5EDD4] transition-all">
          <div className="text-3xl">+</div>
          <div className="text-sm font-medium text-[#7A7368]">Yeni Pet Ekle</div>
        </div>
      </div>
    </div>
  );
}

// ── İlanlarım ─────────────────────────────────────────────────────────────────
function ListingsView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [city, setCity] = useState('');
  const [isPuppy, setIsPuppy] = useState(false);
  const [listings, setListings] = useState([
    {id:1,name:'Pamuk',species:'Kedi',breed:'Van Kedisi',age:'5 yaş',city:'Ankara',status:'active',views:187,favs:12,emoji:'🐾',bg:'from-[#EDD5BE] to-[#C9A98C]',isPuppy:false},
    {id:2,name:'Karamel',species:'Köpek',breed:'Golden Karışımı',age:'2 yaş',city:'İstanbul',status:'active',views:160,favs:8,emoji:'🐶',bg:'from-[#D8E8D0] to-[#9EC49A]',isPuppy:false},
    {id:3,name:'Yavru x4',species:'Kedi',breed:'Tekir',age:'6 hft',city:'İzmir',status:'pending',views:43,favs:21,emoji:'😸',bg:'from-[#D5E0E8] to-[#9AB0C4]',isPuppy:true},
  ]);

  const statusStyle:Record<string,string>={active:'bg-[rgba(39,174,96,.9)] text-white',pending:'bg-[rgba(201,131,46,.9)] text-white',closed:'bg-[rgba(92,74,50,.7)] text-white',draft:'bg-[rgba(122,115,104,.7)] text-white'};
  const statusLabel:Record<string,string>={active:'Aktif',pending:'İncelemede',closed:'Kapalı',draft:'Taslak'};

  function toggle(id:number){setListings(prev=>prev.map(l=>l.id===id?{...l,status:l.status==='active'?'closed':'active'}:l));}
  function del(id:number){if(confirm('Silmek istediğinizden emin misiniz?'))setListings(prev=>prev.filter(l=>l.id!==id));}

  return (
    <div>
      {/* Modal */}
      {modalOpen&&(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[800] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-[600px] p-8 mt-8 relative shadow-[0_32px_80px_rgba(0,0,0,.2)]">
            <button onClick={()=>setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F2EA] flex items-center justify-center text-[#7A7368] hover:bg-[#EDE5D3] transition-colors">✕</button>
            <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">{editId?'İlanı Düzenle ✏':'Yeni İlan Ver 🐾'}</h2>
            <p className="text-sm text-[#7A7368] mb-6">81 ilde binlerce kullanıcıya ulaşın.</p>
            <form onSubmit={e=>{e.preventDefault();setModalOpen(false);}} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Hayvan Adı</label><input className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all" placeholder="Pamuk…"/></div>
                <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Tür</label>
                  <select className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all">
                    <option value="">Seçin…</option><option>Kedi</option><option>Köpek</option><option>Kuş</option><option>Tavşan</option><option>Diğer</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Şehir (81 İl)</label>
                  <select value={city} onChange={e=>setCity(e.target.value)} className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all" required>
                    <option value="">Şehir seçin…</option>
                    {CITIES_81.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">İlçe</label><input className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all" placeholder="Çankaya…"/></div>
              </div>
              {/* Yavru modu */}
              <label className="flex items-center gap-3 bg-[#F7F2EA] rounded-[12px] p-3 cursor-pointer">
                <input type="checkbox" checked={isPuppy} onChange={e=>setIsPuppy(e.target.checked)} className="w-4 h-4 accent-[#C9832E]"/>
                <div><div className="text-sm font-medium text-[#2F2622]">🍼 Yavru İlanı</div><div className="text-[11px] text-[#7A7368]">Yavru doğumu veya yavru sahiplendirmesi için</div></div>
              </label>
              {isPuppy&&(
                <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[14px] p-4 space-y-3">
                  <div className="text-[11px] font-semibold tracking-[.1em] uppercase text-[#C9832E] mb-2">🍼 Yavru Bilgileri</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Yavru Sayısı</label><input type="number" min="1" max="20" className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm focus:outline-none focus:border-[#C9832E] transition-all" placeholder="4"/></div>
                    <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Doğum Tarihi</label><input type="date" className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm focus:outline-none focus:border-[#C9832E] transition-all"/></div>
                    <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Sahiplenme Tarihi</label><input type="date" className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm focus:outline-none focus:border-[#C9832E] transition-all"/></div>
                  </div>
                </div>
              )}
              <div><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Açıklama</label><textarea className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none" rows={3} placeholder="Hayvanınız hakkında bilgi verin…" required/></div>
              <button type="submit" className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all">
                {editId?'Değişiklikleri Kaydet':'İlanı Yayınla 🐾'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl font-semibold text-[#2F2622]">İlanlarım</h2>
        <button onClick={()=>{setEditId(null);setModalOpen(true);}} className="bg-[#C9832E] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#b87523] transition-colors">+ Yeni İlan Ver</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(l=>(
          <div key={l.id} className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className={`h-[110px] bg-gradient-to-br ${l.bg} flex items-center justify-center text-4xl relative`}>
              {l.emoji}
              <span className={`absolute top-2 left-2 text-[10px] font-semibold px-[10px] py-1 rounded-full ${statusStyle[l.status]}`}>{statusLabel[l.status]}</span>
              {l.isPuppy&&<span className="absolute top-2 right-2 text-[10px] font-semibold px-[10px] py-1 rounded-full bg-[rgba(201,131,46,.9)] text-white">🍼 Yavru</span>}
            </div>
            <div className="p-4">
              <div className="text-[10px] font-medium tracking-[.1em] uppercase text-[#9A9188] mb-1">{l.species}</div>
              <div className="font-serif text-lg font-semibold text-[#2F2622]">{l.name}</div>
              <div className="text-xs text-[#7A7368] mb-2">{l.breed} · {l.age}</div>
              <div className="flex gap-3 text-[11px] text-[#9A9188] mb-3"><span>📍 {l.city}</span><span>👁 {l.views}</span><span>❤ {l.favs}</span></div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={()=>{setEditId(l.id);setModalOpen(true);}} className="flex-1 bg-[#5C4A32] text-white text-xs font-medium py-[7px] rounded-full hover:bg-[#2F2622] transition-colors">✏ Düzenle</button>
                <button onClick={()=>toggle(l.id)} className="flex-1 border border-[#8B7355] text-[#5C4A32] text-xs font-medium py-[7px] rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">{l.status==='active'?'Kapat':'Aktif Et'}</button>
                <button onClick={()=>del(l.id)} className="px-3 py-[7px] rounded-full border border-red-200 text-red-500 text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Premium ───────────────────────────────────────────────────────────────────
function PremiumView() {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-xs font-semibold tracking-[.14em] uppercase text-[#C9832E] mb-2">Patıpetra Premium</div>
        <h2 className="font-serif text-3xl font-light text-[#2F2622]">Dostunuz için en iyisini seçin</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {name:'Ücretsiz',price:'₺0',period:'/ ay',feats:['1 Pet Profili','2 Aktif İlan','Temel rehberler'],featured:false,cta:'Mevcut Plan',disabled:true},
          {name:'Premium',price:'₺199',period:'/ ay',feats:['Sınırsız Pet Profili','10 Aktif İlan','Tüm özel rehberler','İlan öne çıkarma','%10 indirim'],featured:true,cta:"Premium'a Geç ✦",disabled:false},
          {name:'Pro Yıllık',price:'₺1.490',period:'/ yıl',feats:["Premium'un tümü","Sınırsız ilan","Öncelikli destek","%20 indirim","Vet önceliği"],featured:false,cta:"Pro'ya Geç →",disabled:false},
        ].map(p=>(
          <div key={p.name} className={`rounded-[24px] p-6 relative border hover:-translate-y-1 transition-all ${p.featured?'bg-[#5C4A32] border-transparent':'bg-white border-[rgba(196,169,107,.12)] hover:shadow-lg'}`}>
            {p.featured&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9832E] text-[#2F2622] text-[10px] font-bold tracking-[.1em] uppercase px-3 py-1 rounded-full whitespace-nowrap">En Popüler</div>}
            <div className={`text-[10px] font-semibold tracking-[.2em] uppercase mb-2 ${p.featured?'text-white/40':'text-[#9A9188]'}`}>Üyelik Planı</div>
            <div className={`font-serif text-2xl font-semibold mb-1 ${p.featured?'text-white':'text-[#2F2622]'}`}>{p.name}</div>
            <div className={`font-serif text-3xl font-semibold mb-1 ${p.featured?'text-[#F5E2C7]':'text-[#C9832E]'}`}>{p.price}</div>
            <div className={`text-xs mb-5 ${p.featured?'text-white/40':'text-[#9A9188]'}`}>{p.period}</div>
            <div className="flex flex-col gap-2 mb-5">
              {p.feats.map(f=><div key={f} className={`text-sm rounded-[12px] px-3 py-[10px] ${p.featured?'bg-white/10 text-white':'bg-[#F7F2EA] text-[#5C4A32]'}`}>✓ {f}</div>)}
            </div>
            <button disabled={p.disabled} className={`w-full py-[11px] rounded-full text-sm font-semibold transition-all ${p.disabled?'bg-[#EDE5D3] text-[#9A9188] cursor-not-allowed':p.featured?'bg-[#C9832E] text-white hover:bg-[#b87523]':'bg-[#5C4A32] text-white hover:bg-[#2F2622]'}`}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function ProfileView({user}:{user:User|null}) {
  return (
    <div className="max-w-[640px]">
      <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 flex items-center gap-5 mb-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-4xl flex-shrink-0">🧑</div>
        <div className="flex-1">
          <div className="font-serif text-2xl font-semibold text-[#2F2622]">{user?.displayName||'Kullanıcı'}</div>
          <div className="text-sm text-[#7A7368]">{user?.email}</div>
          <div className="inline-flex items-center gap-2 bg-[rgba(201,131,46,.1)] border border-[rgba(201,131,46,.25)] rounded-full px-3 py-1 text-xs font-medium text-[#C9832E] mt-2">✦ Ücretsiz Plan</div>
        </div>
      </div>
      <div className="bg-white rounded-[16px] border border-[rgba(196,169,107,.1)] p-5 mb-4">
        <div className="text-sm font-semibold text-[#2F2622] mb-4">👤 Kişisel Bilgiler</div>
        <div className="grid grid-cols-2 gap-3">
          {[{l:'E-posta',v:user?.email||''},{l:'Üyelik',v:'Ücretsiz Plan'}].map(f=>(
            <div key={f.l}><label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">{f.l}</label><div className="px-3 py-[11px] rounded-[12px] bg-[#F7F2EA] text-sm text-[#2F2622]">{f.v}</div></div>
          ))}
        </div>
      </div>
      <button className="bg-[#5C4A32] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#2F2622] transition-colors">Değişiklikleri Kaydet</button>
    </div>
  );
}

function Placeholder({icon,title,desc}:{icon:string;title:string;desc:string}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">{title}</h2>
      <p className="text-sm text-[#7A7368] max-w-xs leading-relaxed">{desc}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PanelPage() {
  const router = useRouter();
  const [user,       setUser]       = useState<User|null>(null);
  const [loading,    setLoading]    = useState(true);
  const [active,     setActive]     = useState('dashboard');
  const [sidebarOpen,setSidebarOpen]= useState(false);

  useEffect(()=>{
    const unsub=onAuthChange(u=>{
      if(!u){router.push('/giris');return;}
      setUser(u); setLoading(false);
    });
    return ()=>unsub();
  },[router]);

  if(loading) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="text-center"><div className="text-4xl mb-4">🐾</div><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin mx-auto"/></div>
    </div>
  );

  const title=NAV.find(n=>n.id===active)?.label||'Dashboard';

  return (
    <div className="flex min-h-screen bg-[#F7F2EA]">
      <Sidebar active={active} setActive={setActive} user={user} open={sidebarOpen} setOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col lg:ml-[260px] min-h-screen">
        <Topbar title={title} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActive={setActive}/>
        <main className="flex-1 p-4 sm:p-6 max-w-[1200px] w-full">
          {active==='dashboard'   &&<DashView setActive={setActive} user={user}/>}
          {active==='petlerim'    &&<PetsView/>}
          {active==='ilanlarim'   &&<ListingsView/>}
          {active==='premium'     &&<PremiumView/>}
          {active==='profil'      &&<ProfileView user={user}/>}
          {active==='mesajlar'    &&<Placeholder icon="💬" title="Mesajlarım" desc="Gelen mesajlarınız burada görünecek."/>}
          {active==='bildirimler' &&<Placeholder icon="🔔" title="Bildirimler" desc="Tüm bildirimleriniz burada."/>}
          {active==='ayarlar'     &&<Placeholder icon="⚙" title="Ayarlar" desc="Hesap ve gizlilik ayarları."/>}
        </main>
      </div>
    </div>
  );
}
