'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, logout } from '@/lib/auth';
import {
  collection, getDocs, query, where,
  orderBy, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const NAV = [
  { id:'dashboard',  icon:'📊', label:'Dashboard'     },
  { id:'questions',  icon:'💬', label:'Gelen Sorular' },
  { id:'appointments',icon:'📅',label:'Randevular'    },
  { id:'profile',    icon:'👤', label:'Profilim'      },
];

export default function VetPanelPage() {
  const router = useRouter();
  const [user,    setUser]    = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState('dashboard');
  const [isVet,   setIsVet]   = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push('/giris?redirect=/vet-panel'); return; }
      setUser(u);
      // Firestore'dan rol kontrolü
      const { getDoc, doc: fsDoc } = await import('firebase/firestore');
      const snap = await getDoc(fsDoc(db, 'users', u.uid));
      const data = snap.data();
      if (data?.role !== 'vet' && data?.role !== 'admin') {
        router.push('/panel');
        return;
      }
      setIsVet(true);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🩺</div>
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin mx-auto"/>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F2EA]">
      <aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-[#2F2622] z-[200] flex flex-col overflow-y-auto hidden lg:flex">
        <div className="px-5 py-5 border-b border-white/[.07]">
          <div className="text-[10px] font-semibold tracking-[.2em] uppercase text-white/30 mb-1">Patıpetra</div>
          <div className="text-lg font-semibold text-white">Veteriner Paneli</div>
        </div>
        <div className="px-4 py-3 border-b border-white/[.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-lg overflow-hidden flex-shrink-0">🩺</div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.displayName || user?.email?.split('@')[0]}</div>
            <div className="text-[10px] text-[#E8B86D] tracking-[.1em] uppercase mt-[2px]">✓ Veteriner</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] text-sm mb-[2px] transition-all text-left ${active===item.id?'bg-[#C9832E]/20 text-[#E8B86D] font-medium':'text-white/60 hover:bg-white/[.07] hover:text-white/90'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[.07]">
          <Link href="/" className="flex items-center gap-3 px-3 py-[10px] text-sm text-white/40 hover:text-white/70 transition-colors mb-1">
            <span>🌐</span> Siteye Git
          </Link>
          <button onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-[10px] text-sm text-white/40 hover:text-white/70 transition-colors">
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[240px]">
        <header className="h-16 bg-[rgba(247,242,234,.95)] backdrop-blur-[16px] border-b border-[rgba(196,169,107,.15)] sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-6">
          <h1 className="font-serif text-xl font-semibold text-[#2F2622]">{NAV.find(n=>n.id===active)?.label||'Dashboard'}</h1>
          <div className="flex items-center gap-2 text-sm text-[#7A7368]">
            <div className="w-2 h-2 rounded-full bg-green-500"/>
            <span>Aktif</span>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {active==='dashboard'    && <VetDashboard user={user} setActive={setActive}/>}
          {active==='questions'    && <VetQuestions user={user}/>}
          {active==='appointments' && <VetAppointments user={user}/>}
          {active==='profile'      && <VetProfile user={user}/>}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function VetDashboard({ user, setActive }: { user: User|null; setActive:(s:string)=>void }) {
  const [stats, setStats] = useState({questions:0, unanswered:0, appointments:0, pending:0});

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const [qSnap, aSnap] = await Promise.all([
          getDocs(query(collection(db,'vetQuestions'), where('vetId','==',user!.uid))),
          getDocs(query(collection(db,'appointments'), where('serviceOwnerId','==',user!.uid))),
        ]);
        const qs = qSnap.docs.map(d=>d.data());
        const as = aSnap.docs.map(d=>d.data());
        setStats({
          questions:   qs.length,
          unanswered:  qs.filter((q:any)=>!q.answer).length,
          appointments:as.length,
          pending:     as.filter((a:any)=>a.status==='pending').length,
        });
      } catch(e){console.error(e);}
    }
    load();
  }, [user]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622]">Merhaba, {user?.displayName?.split(' ')[0] || 'Dr.'} 👋</h2>
        <p className="text-sm text-[#7A7368] mt-1">Veteriner panelinize hoş geldiniz.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {i:'💬', l:'Toplam Soru',     v:stats.questions,   c:'rgba(201,131,46,.1)', a:'questions'   },
          {i:'⏳', l:'Bekleyen Soru',   v:stats.unanswered,  c:'rgba(231,76,60,.1)',  a:'questions'   },
          {i:'📅', l:'Toplam Randevu',  v:stats.appointments,c:'rgba(107,124,92,.1)', a:'appointments'},
          {i:'🔔', l:'Bekleyen Randevu',v:stats.pending,     c:'rgba(201,131,46,.12)',a:'appointments'},
        ].map(s => (
          <button key={s.l} onClick={() => setActive(s.a)}
            className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] p-5 text-left hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xl mb-3" style={{background:s.c}}>{s.i}</div>
            <div className="font-serif text-3xl font-semibold text-[#2F2622]">{s.v}</div>
            <div className="text-xs text-[#7A7368] mt-1">{s.l}</div>
          </button>
        ))}
      </div>
      {(stats.unanswered > 0 || stats.pending > 0) && (
        <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[16px] p-4">
          <div className="font-semibold text-sm text-[#C9832E] mb-2">⚠️ Bekleyen işlemler var</div>
          <div className="flex gap-2 flex-wrap">
            {stats.unanswered > 0 && <button onClick={()=>setActive('questions')} className="text-xs bg-[#C9832E]/10 text-[#C9832E] px-3 py-1 rounded-full hover:bg-[#C9832E]/20">{stats.unanswered} yanıtsız soru →</button>}
            {stats.pending > 0    && <button onClick={()=>setActive('appointments')} className="text-xs bg-[rgba(107,124,92,.1)] text-[#6B7C5C] px-3 py-1 rounded-full hover:bg-[rgba(107,124,92,.2)]">{stats.pending} bekleyen randevu →</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sorular ───────────────────────────────────────────────────────────────────
function VetQuestions({ user }: { user: User|null }) {
  const [questions,  setQuestions]  = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<'all'|'unanswered'|'answered'>('unanswered');
  const [answering,  setAnswering]  = useState<string|null>(null);
  const [answerText, setAnswerText] = useState('');
  const [saving,     setSaving]     = useState(false);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db,'vetQuestions'), where('vetId','==',user!.uid), orderBy('createdAt','desc'));
      const snap = await getDocs(q);
      setQuestions(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  async function handleAnswer(qId: string) {
    if (!answerText.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(db,'vetQuestions',qId), {
        answer:     answerText.trim(),
        answeredAt: serverTimestamp(),
      });
      setQuestions(prev => prev.map(q => q.id===qId ? {...q,answer:answerText.trim()} : q));
      setAnswering(null); setAnswerText('');
    } catch(e:any){alert('Hata: '+e.message);}
    finally{setSaving(false);}
  }

  const filtered = questions.filter(q => filter==='all' ? true : filter==='unanswered' ? !q.answer : !!q.answer);

  function timeAgo(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff/60000);
    if (m < 60) return `${m} dk önce`;
    if (m < 1440) return `${Math.floor(m/60)} sa önce`;
    return `${Math.floor(m/1440)} gün önce`;
  }

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          {val:'unanswered',label:'Bekleyen',   count:questions.filter(q=>!q.answer).length },
          {val:'answered',  label:'Yanıtlanan', count:questions.filter(q=>!!q.answer).length},
          {val:'all',       label:'Tümü',       count:questions.length                      },
        ].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#5C4A32] text-white':'bg-white text-[#5C4A32] border border-[rgba(196,169,107,.2)] hover:border-[#8B7355]'}`}>
            {f.label} <span className="opacity-60">({f.count})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#7A7368] hover:border-[#8B7355]">↻ Yenile</button>
      </div>

      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : filtered.length===0 ? <div className="text-center py-16 bg-white rounded-[20px] border border-[rgba(196,169,107,.12)]"><div className="text-4xl mb-3">💬</div><p className="text-[#7A7368]">Bu kategoride soru yok.</p></div>
      : (
        <div className="space-y-4">
          {filtered.map(q => (
            <div key={q.id} className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] p-5">
              {/* Soru */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#F7F2EA] flex items-center justify-center text-base flex-shrink-0">🧑</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-[#2F2622]">{q.userName}</span>
                    <span className="text-[11px] text-[#9A9188]">{timeAgo(q.createdAt)}</span>
                    {!q.answer && <span className="text-[10px] bg-red-50 text-red-500 px-2 py-[1px] rounded-full">Yanıt bekliyor</span>}
                  </div>
                  {q.petInfo && <div className="text-[11px] text-[#C9832E] mb-1">🐾 {q.petInfo}</div>}
                  <p className="text-sm text-[#2F2622]">{q.question}</p>
                </div>
              </div>

              {/* Mevcut yanıt */}
              {q.answer && (
                <div className="flex items-start gap-3 bg-[#F7F2EA] rounded-[12px] p-3 mb-3">
                  <span className="text-lg">🩺</span>
                  <div>
                    <div className="text-xs text-[#C9832E] font-semibold mb-1">Yanıtınız</div>
                    <p className="text-sm text-[#5C4A32]">{q.answer}</p>
                  </div>
                </div>
              )}

              {/* Yanıt formu */}
              {!q.answer && (
                <>
                  {answering === q.id ? (
                    <div className="mt-3">
                      <textarea value={answerText} onChange={e=>setAnswerText(e.target.value)}
                        placeholder="Soruyu yanıtlayın…" rows={4}
                        className="w-full px-3 py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none mb-2"/>
                      <div className="flex gap-2">
                        <button onClick={()=>{setAnswering(null);setAnswerText('');}} className="flex-1 py-2 rounded-full border border-[#8B7355] text-[#5C4A32] text-sm hover:bg-[#5C4A32] hover:text-white transition-all">İptal</button>
                        <button onClick={()=>handleAnswer(q.id)} disabled={saving||!answerText.trim()}
                          className="flex-1 py-2 rounded-full bg-[#5C4A32] text-white text-sm font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
                          {saving?'Kaydediliyor…':'Yanıtı Kaydet'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={()=>setAnswering(q.id)}
                      className="mt-2 text-sm text-white bg-[#C9832E] px-4 py-2 rounded-full hover:bg-[#b87523] transition-colors">
                      💬 Yanıtla
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Randevular ────────────────────────────────────────────────────────────────
function VetAppointments({ user }: { user: User|null }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState<'pending'|'confirmed'|'all'>('pending');

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db,'appointments'), where('serviceOwnerId','==',user!.uid), orderBy('createdAt','desc'));
      const snap = await getDocs(q);
      setAppointments(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  async function updateStatus(id: string, status: string) {
    await updateDoc(doc(db,'appointments',id), {status});
    setAppointments(prev=>prev.map(a=>a.id===id?{...a,status}:a));
  }

  const filtered = appointments.filter(a => filter==='all' ? true : a.status===filter);
  const STATUS_COLOR: Record<string,string> = {
    pending:  'bg-[rgba(201,131,46,.1)] text-[#C9832E]',
    confirmed:'bg-green-50 text-green-600',
    cancelled:'bg-red-50 text-red-500',
    completed:'bg-[#F7F2EA] text-[#7A7368]',
  };
  const STATUS_LABEL: Record<string,string> = {
    pending:'Bekliyor', confirmed:'Onaylandı', cancelled:'İptal', completed:'Tamamlandı'
  };

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          {val:'pending',  label:'Bekleyen',  count:appointments.filter(a=>a.status==='pending').length  },
          {val:'confirmed',label:'Onaylanan', count:appointments.filter(a=>a.status==='confirmed').length},
          {val:'all',      label:'Tümü',      count:appointments.length                                  },
        ].map(f=>(
          <button key={f.val} onClick={()=>setFilter(f.val as any)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${filter===f.val?'bg-[#5C4A32] text-white':'bg-white text-[#5C4A32] border border-[rgba(196,169,107,.2)] hover:border-[#8B7355]'}`}>
            {f.label} <span className="opacity-60">({f.count})</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#7A7368] hover:border-[#8B7355]">↻ Yenile</button>
      </div>

      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      : filtered.length===0 ? <div className="text-center py-16 bg-white rounded-[20px] border border-[rgba(196,169,107,.12)]"><div className="text-4xl mb-3">📅</div><p className="text-[#7A7368]">Bu kategoride randevu yok.</p></div>
      : (
        <div className="space-y-4">
          {filtered.map(a=>(
            <div key={a.id} className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-[#2F2622]">{a.userName}</span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${STATUS_COLOR[a.status]}`}>
                      {STATUS_LABEL[a.status]||a.status}
                    </span>
                  </div>
                  <div className="text-sm text-[#7A7368] mb-1">📅 {a.date} · {a.time}</div>
                  {a.petName && <div className="text-sm text-[#7A7368] mb-1">🐾 {a.petName}</div>}
                  <div className="text-sm text-[#7A7368] mb-1">📞 {a.userPhone}</div>
                  {a.note && <div className="text-xs text-[#9A9188] bg-[#F7F2EA] rounded-[10px] px-3 py-2 mt-2">{a.note}</div>}
                </div>
                {a.status==='pending' && (
                  <div className="flex flex-col gap-2">
                    <button onClick={()=>updateStatus(a.id,'confirmed')} className="text-xs px-4 py-2 rounded-full bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-colors">✓ Onayla</button>
                    <button onClick={()=>updateStatus(a.id,'cancelled')} className="text-xs px-4 py-2 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors">✗ İptal</button>
                  </div>
                )}
                {a.status==='confirmed' && (
                  <button onClick={()=>updateStatus(a.id,'completed')} className="text-xs px-4 py-2 rounded-full bg-[#F7F2EA] text-[#5C4A32] border border-[#E3D9C6] hover:bg-[#EDE5D3] transition-colors">✓ Tamamlandı</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Profil ────────────────────────────────────────────────────────────────────
function VetProfile({ user }: { user: User|null }) {
  return (
    <div className="max-w-[600px]">
      <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
        <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">Veteriner Profili</h3>
        <p className="text-sm text-[#7A7368] leading-relaxed mb-5">
          Profiliniz admin tarafından oluşturulmuştur. Bilgilerinizi güncellemek için admin ile iletişime geçin.
        </p>
        <div className="bg-[#F7F2EA] rounded-[12px] p-4 text-sm text-[#5C4A32]">
          <div className="font-semibold mb-1">{user?.displayName || user?.email}</div>
          <div className="text-[#7A7368]">{user?.email}</div>
        </div>
        <a href="mailto:patipetraa1@gmail.com" className="mt-4 inline-flex bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
          Admin ile İletişim →
        </a>
      </div>
    </div>
  );
}
