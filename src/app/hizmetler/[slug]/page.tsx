'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { onAuthChange } from '@/lib/auth';
import {
  collection, getDocs, query, where,
  addDoc, serverTimestamp, doc, getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ReviewSystem from '@/components/ReviewSystem';
import FavoriteButton from '@/components/FavoriteButton';
import type { User } from 'firebase/auth';

const TYPE_LABEL: Record<string,string> = {
  groomer:'Pet Kuaför', hotel:'Pet Otel', trainer:'Pet Eğitmen',
  vet:'Veteriner', petshop:'Pet Shop', sitter:'Pet Bakıcı',
};
const TYPE_ICON: Record<string,string> = {
  groomer:'✂️', hotel:'🏨', trainer:'🎓',
  vet:'🩺', petshop:'🛒', sitter:'🐾',
};

export default function HizmetDetayPage() {
  const params = useParams();
  const router = useRouter();
  const slug   = params.slug as string;

  const [user,     setUser]     = useState<User|null>(null);
  const [service,  setService]  = useState<any|null>(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<'hakkinda'|'randevu'|'yorumlar'>('hakkinda');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptPet,  setApptPet]  = useState('');
  const [apptPhone,setApptPhone]= useState('');
  const [apptNote, setApptNote] = useState('');
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        // slug veya id ile ara
        let snap = await getDocs(query(collection(db,'services'), where('slug','==',slug)));
        if (snap.empty) {
          // id ile dene
          const d = await getDoc(doc(db,'services',slug));
          if (d.exists()) setService({id:d.id,...d.data()});
        } else {
          const s = {id:snap.docs[0].id,...snap.docs[0].data()} as any; setService(s); if(s.businessName) document.title = `${s.businessName} | Patıpetra`;
        }
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [slug]);

  async function handleAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push('/giris'); return; }
    setSending(true);
    try {
      await addDoc(collection(db,'appointments'), {
        serviceId:      service.id,
        serviceName:    service.businessName,
        serviceOwnerId: service.ownerId||service.userId||'',
        serviceType:    service.type,
        userId:         user.uid,
        userName:       user.displayName || user.email?.split('@')[0] || '',
        userEmail:      user.email || '',
        userPhone:      apptPhone,
        petName:        apptPet,
        date:           apptDate,
        time:           apptTime,
        note:           apptNote,
        status:         'pending',
        createdAt:      serverTimestamp(),
      });
      setSent(true);
      // Mail gönder
      await fetch('/api/email', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          type: 'vet_new_appointment',
          data: {
            vetEmail:  service.ownerEmail||service.email||'',
            userName:  user.displayName || user.email?.split('@')[0],
            userPhone: apptPhone,
            petName:   apptPet,
            date:      apptDate,
            time:      apptTime,
            note:      apptNote,
          }
        })
      }).catch(console.error);
    } catch(err:any) { alert('Hata: '+err.message); }
    finally { setSending(false); }
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

  if (!service) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">Hizmet bulunamadı</h2>
          <Link href="/hizmetler" className="text-[#C9832E] hover:underline">← Hizmetlere Dön</Link>
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
            <Link href="/hizmetler" className="text-sm text-white/50 hover:text-white mb-5 inline-flex items-center gap-1">← Hizmetlere Dön</Link>
            <div className="flex items-start gap-5 flex-wrap">
              <div className="w-20 h-20 rounded-[20px] border-2 border-white/20 overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center text-4xl relative">
                {service.coverUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={service.coverUrl} alt={service.businessName} className="w-full h-full object-cover"/>
                  : TYPE_ICON[service.type]||'🏪'
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white">{service.businessName}</h1>
                  <span className="text-[11px] bg-white/10 text-white/70 px-2 py-[2px] rounded-full border border-white/20">
                    {TYPE_ICON[service.type]} {TYPE_LABEL[service.type]||service.type}
                  </span>
                </div>
                <div className="text-sm text-white/70 mb-1">📍 {service.city}{service.district?`, ${service.district}`:''}</div>
                {service.phone && <div className="text-sm text-white/60">📞 {service.phone}</div>}
                {service.rating > 0 && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-white/60">
                    <span>⭐ {service.rating}</span>
                    <span>({service.reviewCount||0} yorum)</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={()=>setTab('randevu')}
                  className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
                  📅 Randevu Al
                </button>
                {service && <FavoriteButton targetId={service.id} targetType="service" targetName={service.businessName}/>}
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
                  {val:'randevu',  label:'Randevu Al'},
                  {val:'yorumlar', label:'Değerlendirmeler'},
                ].map(t=>(
                  <button key={t.val} onClick={()=>setTab(t.val as any)}
                    className={`flex-1 py-2 rounded-[10px] text-sm font-medium transition-all ${tab===t.val?'bg-[#5C4A32] text-white':'text-[#7A7368] hover:text-[#2F2622]'}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Hakkında */}
              {tab==='hakkinda' && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622]">Hakkında</h3>
                  {service.description && (
                    <p className="text-sm leading-[1.9] text-[#5C4A32]">{service.description}</p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {icon:'📍', label:'Konum',           val:`${service.city}${service.district?`, ${service.district}`:''}`},
                      {icon:'📞', label:'Telefon',          val:service.phone         },
                      {icon:'📧', label:'E-posta',          val:service.email||service.ownerEmail},
                      {icon:'🕐', label:'Çalışma Saatleri', val:service.workHours     },
                      {icon:'🌐', label:'Website',          val:service.website       },
                      {icon:'📷', label:'Instagram',        val:service.instagram     },
                    ].filter(f=>f.val).map(f=>(
                      <div key={f.label} className="bg-[#F7F2EA] rounded-[12px] p-3">
                        <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188] mb-1">{f.label}</div>
                        <div className="text-sm text-[#5C4A32] font-medium flex items-center gap-2">
                          <span>{f.icon}</span><span>{f.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {service.services && (
                    <div>
                      <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188] mb-2">Hizmetler</div>
                      <div className="flex flex-wrap gap-2">
                        {service.services.map((s:string)=>(
                          <span key={s} className="text-xs bg-[#F7F2EA] text-[#5C4A32] border border-[#E3D9C6] px-3 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Randevu */}
              {tab==='randevu' && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">📅 Randevu Al</h3>
                  {!user ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-[#7A7368] mb-3">Randevu almak için giriş yapın.</p>
                      <Link href="/giris" className="inline-flex bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full">Giriş Yap</Link>
                    </div>
                  ) : sent ? (
                    <div className="text-center py-6">
                      <div className="text-5xl mb-3">✅</div>
                      <h3 className="font-semibold text-[#2F2622] mb-2">Randevu Talebiniz Alındı!</h3>
                      <p className="text-sm text-[#7A7368] mb-4">İşletme en kısa sürede sizinle iletişime geçecek.</p>
                      <button onClick={()=>setSent(false)} className="text-sm text-[#C9832E] hover:underline">Yeni randevu al</button>
                    </div>
                  ) : (
                    <form onSubmit={handleAppointment}>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Tarih *</label>
                          <input type="date" value={apptDate} onChange={e=>setApptDate(e.target.value)} required min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E]"/>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Saat *</label>
                          <select value={apptTime} onChange={e=>setApptTime(e.target.value)} required
                            className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E]">
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
                          className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E]"/>
                      </div>
                      <div className="mb-3">
                        <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Telefon *</label>
                        <input value={apptPhone} onChange={e=>setApptPhone(e.target.value)} placeholder="05XX XXX XX XX" required
                          className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E]"/>
                      </div>
                      <div className="mb-5">
                        <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Not</label>
                        <textarea value={apptNote} onChange={e=>setApptNote(e.target.value)} placeholder="Hizmet hakkında not…" rows={3}
                          className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] resize-none"/>
                      </div>
                      <button type="submit" disabled={sending||!apptDate||!apptTime||!apptPhone}
                        className="w-full py-[13px] rounded-[14px] bg-[#C9832E] text-white text-[15px] font-semibold hover:bg-[#b87523] disabled:opacity-60">
                        {sending?'Gönderiliyor…':'Randevu Talebini Gönder →'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Yorumlar */}
              {tab==='yorumlar' && service && (
                <ReviewSystem targetId={service.id} targetName={service.businessName} targetType="service"/>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 sticky top-[84px] space-y-3">
                <button onClick={()=>setTab('randevu')}
                  className="w-full py-3 rounded-full bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523]">
                  📅 Randevu Al
                </button>
                {service.phone && (
                  <a href={`tel:${service.phone}`}
                    className="w-full py-3 rounded-full border border-[#8B7355] text-[#5C4A32] text-sm font-semibold hover:bg-[#5C4A32] hover:text-white transition-all flex items-center justify-center gap-2">
                    📞 Ara
                  </a>
                )}
                {service && <FavoriteButton targetId={service.id} targetType="service" targetName={service.businessName}/>}
                <div className="border-t border-[#F7F2EA] pt-3 space-y-2 text-xs text-[#7A7368]">
                  <div>📍 {service.city}{service.district?`, ${service.district}`:''}</div>
                  {service.phone     && <div>📞 {service.phone}</div>}
                  {service.workHours && <div>🕐 {service.workHours}</div>}
                  {service.website   && <a href={service.website} target="_blank" rel="noopener noreferrer" className="text-[#C9832E] hover:underline block">🌐 Website</a>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
