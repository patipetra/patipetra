'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { onAuthChange } from '@/lib/auth';
import ReviewSystem from '@/components/ReviewSystem';
import FavoriteButton from '@/components/FavoriteButton';
import {
  collection, addDoc, getDocs, query,
  where, orderBy, serverTimestamp, doc, getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

function timeAgo(date: any): string {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff/60000);
  if (m < 1) return 'az önce';
  if (m < 60) return `${m} dk önce`;
  if (m < 1440) return `${Math.floor(m/60)} sa önce`;
  return `${Math.floor(m/1440)} gün önce`;
}

export default function VetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug   = params.slug as string;

  const [user,      setUser]      = useState<User|null>(null);
  const [vet,       setVet]       = useState<any|null>(null);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<'hakkinda'|'sorular'|'randevu'>('hakkinda');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQ,  setLoadingQ]  = useState(false);

  // Soru formu
  const [qText,    setQText]    = useState('');
  const [qPet,     setQPet]     = useState('');
  const [sendingQ, setSendingQ] = useState(false);
  const [qSent,    setQSent]    = useState(false);

  // Randevu formu
  const [apptDate,  setApptDate]  = useState('');
  const [apptTime,  setApptTime]  = useState('');
  const [apptPet,   setApptPet]   = useState('');
  const [apptPhone, setApptPhone] = useState('');
  const [apptNote,  setApptNote]  = useState('');
  const [sendingA,  setSendingA]  = useState(false);
  const [apptSent,  setApptSent]  = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db,'vets'), where('slug','==',slug)));
        if (!snap.empty) {
          setVet({id: snap.docs[0].id, ...snap.docs[0].data()});
        }
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (tab === 'sorular' && vet) loadQuestions();
  }, [tab, vet]);

  async function loadQuestions() {
    setLoadingQ(true);
    try {
      const snap = await getDocs(query(
        collection(db,'vetQuestions'),
        where('vetSlug','==',slug)
      ));
      setQuestions(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e) { console.error(e); }
    finally { setLoadingQ(false); }
  }

  async function handleQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push('/giris'); return; }
    if (!qText.trim()) return;
    setSendingQ(true);
    try {
      await addDoc(collection(db,'vetQuestions'), {
        vetSlug:   slug,
        vetId:     vet.userId || vet.id,
        vetName:   vet.name,
        userId:    user.uid,
        userEmail: user.email || '',
        userName:  user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        question:  qText.trim(),
        petInfo:   qPet,
        answer:    null,
        isPublic:  true,
        createdAt: serverTimestamp(),
      });
      // Veterinere mail gönder
      if (vet.email) {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'vet_new_question',
            data: {
              vetEmail: vet.email,
              userName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
              question: qText.trim(),
              petInfo:  qPet,
            }
          })
        }).catch(console.error);
      }
      setQSent(true); setQText(''); setQPet('');
    } catch(err:any) { alert('Hata: '+err.message); }
    finally { setSendingQ(false); }
  }

  async function handleAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push('/giris'); return; }
    setSendingA(true);
    try {
      await addDoc(collection(db,'appointments'), {
        serviceId:       vet.id,
        serviceName:     `${vet.name} - ${vet.clinic}`,
        serviceOwnerId:  vet.userId || vet.id,
        serviceType:     'vet',
        userId:          user.uid,
        userName:        user.displayName || user.email?.split('@')[0] || '',
        userEmail:       user.email || '',
        userPhone:       apptPhone,
        petName:         apptPet,
        date:            apptDate,
        time:            apptTime,
        note:            apptNote,
        status:          'pending',
        createdAt:       serverTimestamp(),
      });
      // Veterinere randevu maili gönder
      if (vet.email) {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'vet_new_appointment',
            data: {
              vetEmail:  vet.email,
              userName:  user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
              userPhone: apptPhone,
              petName:   apptPet,
              date:      apptDate,
              time:      apptTime,
              note:      apptNote,
            }
          })
        }).catch(console.error);
      }
      setApptSent(true);
    } catch(err:any) { alert('Hata: '+err.message); }
    finally { setSendingA(false); }
  }

  if (loading) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
      </div>
      <Footer/>
    </>
  );

  if (!vet) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">Veteriner bulunamadı</h2>
          <Link href="/veterinerler" className="text-[#C9832E] hover:underline">← Veterinerlere Dön</Link>
        </div>
      </div>
      <Footer/>
    </>
  );

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pb-20 lg:pb-0">

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#2F2622] to-[#5C4A32] pt-[108px] pb-8">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
            <Link href="/veterinerler" className="text-sm text-white/50 hover:text-white mb-5 inline-flex items-center gap-1">
              ← Veterinerlere Dön
            </Link>
            <div className="flex items-start gap-5 flex-wrap">
              <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-4xl relative">
                {vet.avatar
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={vet.avatar} alt={vet.name} className="w-full h-full object-cover"/>
                  : '🩺'
                }
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${vet.online?'bg-green-500':'bg-gray-400'}`}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white">{vet.name}</h1>
                  {vet.verified && <span className="text-[11px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-[2px] rounded-full font-semibold">✓ Doğrulandı</span>}
                  <span className={`text-[11px] px-2 py-[2px] rounded-full font-semibold ${vet.online?'bg-green-500/20 text-green-400':'bg-white/10 text-white/40'}`}>
                    {vet.online?'🟢 Çevrimiçi':'⚫ Çevrimdışı'}
                  </span>
                </div>
                <div className="text-sm text-white/70 mb-1">{vet.clinic}</div>
                <div className="text-sm text-white/50 mb-3">📍 {vet.city}{vet.district?`, ${vet.district}`:''}</div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {(vet.spec||[]).map((s: string)=>(
                    <span key={s} className="text-[10px] bg-white/10 text-white/70 px-2 py-[2px] rounded-full border border-white/20">{s}</span>
                  ))}
                </div>
                {vet.rating > 0 && (
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <span>⭐ {vet.rating} ({vet.reviewCount||0} yorum)</span>
                  </div>
                )}
              </div>
              {/* Aksiyon butonları */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {vet && <FavoriteButton targetId={vet.id} targetType="vet" targetName={vet.name}/>}
                <button onClick={()=>setTab('sorular')}
                  className="bg-white/10 border border-white/20 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-white/20 transition-colors">
                  💬 Soru Sor
                </button>
                <button onClick={()=>setTab('randevu')}
                  className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
                  📅 Randevu Al
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_.32fr] gap-6">

            {/* Sol */}
            <div>
              {/* Tabs */}
              <div className="flex gap-1 bg-white rounded-[14px] border border-[rgba(196,169,107,.12)] p-1 mb-5">
                {[
                  {val:'hakkinda', label:'Hakkında'},
                  {val:'sorular',  label:'Soru & Cevap'},
                  {val:'randevu',  label:'Randevu Al'},
    {val:'yorumlar',  label:'Değerlendirmeler'},
                ].map(t=>(
                  <button key={t.val} onClick={()=>setTab(t.val as any)}
                    className={`flex-1 py-2 rounded-[10px] text-sm font-medium transition-all ${tab===t.val?'bg-[#5C4A32] text-white':'text-[#7A7368] hover:text-[#2F2622]'}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Yorumlar */}
              {tab==='yorumlar' && vet && (
                <ReviewSystem
                  targetId={vet.id}
                  targetName={vet.name}
                  targetType="vet"
                />
              )}

            {/* Hakkında */}
              {tab==='hakkinda' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                    <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-3">Hakkında</h3>
                    <p className="text-sm leading-[1.9] text-[#5C4A32] mb-5">{vet.bio || 'Profil açıklaması bulunmuyor.'}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        {icon:'🎓', label:'Eğitim',          val:vet.education    },
                        {icon:'📅', label:'Mezuniyet',        val:vet.gradYear     },
                        {icon:'💼', label:'Deneyim',          val:vet.experience ? `${vet.experience} yıl` : null },
                        {icon:'🕐', label:'Çalışma Saatleri', val:vet.workingHours },
                        {icon:'📞', label:'Telefon',          val:vet.phone        },
                        {icon:'📧', label:'E-posta',          val:vet.email        },
                        {icon:'🌐', label:'Website',          val:vet.website      },
                        {icon:'📷', label:'Instagram',        val:vet.instagram    },
                      ].filter(f=>f.val).map(f=>(
                        <div key={f.label} className="bg-[#F7F2EA] rounded-[12px] p-3">
                          <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188] mb-1">{f.label}</div>
                          <div className="text-sm text-[#5C4A32] font-medium flex items-center gap-2">
                            <span>{f.icon}</span><span>{f.val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Soru-Cevap */}
              {tab==='sorular' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                    <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">💬 Soru Sor</h3>
                    {!user ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-[#7A7368] mb-3">Soru sormak için giriş yapın.</p>
                        <Link href="/giris" className="inline-flex bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523]">Giriş Yap</Link>
                      </div>
                    ) : qSent ? (
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="font-semibold text-[#2F2622] mb-1">Sorunuz İletildi!</p>
                        <p className="text-sm text-[#7A7368] mb-3">Veteriner en kısa sürede yanıtlayacak.</p>
                        <button onClick={()=>setQSent(false)} className="text-sm text-[#C9832E] hover:underline">Yeni soru sor</button>
                      </div>
                    ) : (
                      <form onSubmit={handleQuestion}>
                        <div className="mb-3">
                          <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Pet Bilgisi</label>
                          <input value={qPet} onChange={e=>setQPet(e.target.value)} placeholder="3 yaşında dişi Golden Retriever"
                            className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                        </div>
                        <div className="mb-4">
                          <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Sorunuz *</label>
                          <textarea value={qText} onChange={e=>setQText(e.target.value)} placeholder="Veterinere sormak istediğiniz soruyu yazın…" rows={4} required
                            className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
                        </div>
                        <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[12px] px-4 py-3 text-xs text-[#8B7355] mb-4">
                          ℹ️ Sorunuz herkese açık yayınlanacak. Kişisel bilgi paylaşmayın.
                        </div>
                        <button type="submit" disabled={sendingQ||!qText.trim()}
                          className="w-full py-3 rounded-[14px] bg-[#5C4A32] text-white text-sm font-semibold hover:bg-[#2F2622] transition-all disabled:opacity-60">
                          {sendingQ?'Gönderiliyor…':'Soruyu Gönder →'}
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                    <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">Yanıtlanan Sorular</h3>
                    {loadingQ ? (
                      <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
                    ) : questions.filter(q=>q.answer).length === 0 ? (
                      <div className="text-center py-8 text-[#7A7368] text-sm">Henüz yanıtlanmış soru yok.</div>
                    ) : (
                      <div className="space-y-4">
                        {questions.filter(q=>q.answer).map(q=>(
                          <div key={q.id} className="border border-[#E3D9C6] rounded-[14px] p-4">
                            <div className="flex items-start gap-2 mb-3">
                              <span className="text-lg">❓</span>
                              <div>
                                <div className="text-xs text-[#9A9188] mb-1">{q.userName} · {timeAgo(q.createdAt)}</div>
                                {q.petInfo&&<div className="text-[11px] text-[#C9832E] mb-1">🐾 {q.petInfo}</div>}
                                <p className="text-sm text-[#2F2622] font-medium">{q.question}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 bg-[#F7F2EA] rounded-[10px] p-3">
                              <span className="text-lg">🩺</span>
                              <div>
                                <div className="text-xs text-[#C9832E] font-semibold mb-1">{vet.name} yanıtladı</div>
                                <p className="text-sm text-[#5C4A32]">{q.answer}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Randevu */}
              {tab==='randevu' && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">📅 Randevu Al</h3>
                  {!user ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-[#7A7368] mb-3">Randevu almak için giriş yapın.</p>
                      <Link href="/giris" className="inline-flex bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523]">Giriş Yap</Link>
                    </div>
                  ) : apptSent ? (
                    <div className="text-center py-6">
                      <div className="text-5xl mb-3">✅</div>
                      <h3 className="font-semibold text-[#2F2622] mb-2">Randevu Talebiniz Alındı!</h3>
                      <p className="text-sm text-[#7A7368] mb-4">Veteriner en kısa sürede sizinle iletişime geçecek.</p>
                      <button onClick={()=>setApptSent(false)} className="text-sm text-[#C9832E] hover:underline">Yeni randevu al</button>
                    </div>
                  ) : (
                    <form onSubmit={handleAppointment}>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Tarih *</label>
                          <input type="date" value={apptDate} onChange={e=>setApptDate(e.target.value)} required min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Saat *</label>
                          <select value={apptTime} onChange={e=>setApptTime(e.target.value)} required
                            className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all">
                            <option value="">Seç…</option>
                            {['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'].map(t=>(
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Pet Adı ve Türü</label>
                        <input value={apptPet} onChange={e=>setApptPet(e.target.value)} placeholder="Luna - 3 yaşında dişi kedi"
                          className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                      </div>
                      <div className="mb-3">
                        <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Telefon *</label>
                        <input value={apptPhone} onChange={e=>setApptPhone(e.target.value)} placeholder="05XX XXX XX XX" required
                          className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                      </div>
                      <div className="mb-5">
                        <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Şikayet / Not</label>
                        <textarea value={apptNote} onChange={e=>setApptNote(e.target.value)} placeholder="Hayvanınızın şikayeti…" rows={3}
                          className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
                      </div>
                      <button type="submit" disabled={sendingA||!apptDate||!apptTime||!apptPhone}
                        className="w-full py-[13px] rounded-[14px] bg-[#C9832E] text-white text-[15px] font-semibold hover:bg-[#b87523] transition-all disabled:opacity-60">
                        {sendingA?'Gönderiliyor…':'Randevu Talebini Gönder →'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Sağ sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 sticky top-[84px] space-y-3">
                <button onClick={()=>setTab('sorular')}
                  className="w-full py-3 rounded-full bg-[#5C4A32] text-white text-sm font-semibold hover:bg-[#2F2622] transition-all">
                  💬 Soru Sor
                </button>
                <button onClick={()=>setTab('randevu')}
                  className="w-full py-3 rounded-full bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] transition-all">
                  📅 Randevu Al
                </button>
                {user && vet.userId && (
                  <Link href={`/panel/mesajlar?to=${vet.userId}&name=${encodeURIComponent(vet.name)}`}
                    className="w-full py-3 rounded-full border border-[#8B7355] text-[#5C4A32] text-sm font-semibold hover:bg-[#5C4A32] hover:text-white transition-all text-center block">
                    ✉️ Mesaj Gönder
                  </Link>
                )}
                <div className="border-t border-[#F7F2EA] pt-3 space-y-2">
                  {[
                    {icon:'📍', val:`${vet.city}${vet.district?`, ${vet.district}`:''}` },
                    {icon:'📞', val:vet.phone      },
                    {icon:'📧', val:vet.email      },
                    {icon:'🕐', val:vet.workingHours},
                  ].filter(f=>f.val).map((f,i)=>(
                    <div key={i} className="flex items-start gap-2 text-xs text-[#7A7368]">
                      <span className="flex-shrink-0">{f.icon}</span>
                      <span>{f.val}</span>
                    </div>
                  ))}
                  {vet.website && <a href={vet.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#C9832E] hover:underline"><span>🌐</span> Website</a>}
                  {vet.instagram && <a href={`https://instagram.com/${vet.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#C9832E] hover:underline"><span>📷</span> {vet.instagram}</a>}
                </div>
                {vet.rating > 0 && (
                  <div className="border-t border-[#F7F2EA] pt-3 text-center">
                    <div className="font-serif text-2xl font-semibold text-[#C9832E]">⭐ {vet.rating}</div>
                    <div className="text-xs text-[#9A9188]">{vet.reviewCount||0} değerlendirme</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
