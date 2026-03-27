'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { onAuthChange } from '@/lib/auth';
import {
  getServiceBySlug, createAppointment, getServiceReviews, addReview,
  SERVICE_TYPE_LABEL, type Service, type Review,
} from '@/lib/services';
import type { User } from 'firebase/auth';

// Mock service for demo
const MOCK: Service = {
  id:'demo', ownerId:'system', ownerName:'Demo', ownerEmail:'demo@email.com', ownerPhone:'0555 555 55 55',
  type:'groomer', status:'active', plan:'premium',
  businessName:'Pati Bakım Salonu', slug:'pati-bakim-salonu',
  description:'10 yılı aşkın deneyimimizle tüm ırklara özel bakım hizmetleri sunuyoruz. Uzman kadromuz ve modern ekipmanlarımızla petinize en iyi bakımı veriyoruz.',
  city:'Ankara', district:'Çankaya', address:'Kızılay Mah. Atatürk Cad. No:15',
  phone:'0312 XXX XX XX', email:'pati@email.com', website:'https://patisalon.com', instagram:'@patisalon',
  workingHours:'Hafta içi 09:00-19:00 | Cumartesi 09:00-17:00',
  coverUrl:'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
  imageUrls:[
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80',
  ],
  prices:[
    {name:'Temel Tıraş',      price:150, desc:'Tıraş + tırnak kesimi'},
    {name:'Full Bakım',        price:280, desc:'Tıraş + banyo + kurutma + tırnak'},
    {name:'SPA Paketi',        price:450, desc:'Full bakım + deri bakımı + parfüm'},
  ],
  rating:4.9, reviewCount:87,
};

function timeAgo(date: any): string {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff/86400000);
  if (days < 1)  return 'bugün';
  if (days < 7)  return `${days} gün önce`;
  if (days < 30) return `${Math.floor(days/7)} hafta önce`;
  return `${Math.floor(days/30)} ay önce`;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug   = params.slug as string;

  const [user,       setUser]       = useState<User|null>(null);
  const [service,    setService]    = useState<Service|null>(null);
  const [reviews,    setReviews]    = useState<Review[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeImg,  setActiveImg]  = useState(0);
  const [activeTab,  setActiveTab]  = useState<'info'|'prices'|'reviews'>('info');
  const [apptModal,  setApptModal]  = useState(false);
  const [reviewModal,setReviewModal]= useState(false);

  // Appointment form
  const [apptDate,  setApptDate]   = useState('');
  const [apptTime,  setApptTime]   = useState('');
  const [apptPet,   setApptPet]    = useState('');
  const [apptPhone, setApptPhone]  = useState('');
  const [apptNote,  setApptNote]   = useState('');
  const [apptSaving,setApptSaving] = useState(false);
  const [apptDone,  setApptDone]   = useState(false);

  // Review form
  const [rvRating,  setRvRating]   = useState(5);
  const [rvComment, setRvComment]  = useState('');
  const [rvSaving,  setRvSaving]   = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      setUser(u);
      setApptPhone(u?.phoneNumber||'');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const svc = await getServiceBySlug(slug);
        setService(svc || MOCK);
        if (svc) {
          const rvs = await getServiceReviews(svc.id!);
          setReviews(rvs);
        }
      } catch { setService(MOCK); }
      finally { setLoading(false); }
    }
    load();
  }, [slug]);

  async function handleAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !service) return;
    setApptSaving(true);
    try {
      await createAppointment({
        serviceId:       service.id!,
        serviceName:     service.businessName,
        serviceOwnerId:  service.ownerId,
        userId:          user.uid,
        userName:        user.displayName||user.email?.split('@')[0]||'',
        userEmail:       user.email||'',
        userPhone:       apptPhone,
        petName:         apptPet,
        date:            apptDate,
        time:            apptTime,
        note:            apptNote,
      });
      setApptDone(true);
    } finally { setApptSaving(false); }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !service || !rvComment.trim()) return;
    setRvSaving(true);
    try {
      await addReview({
        serviceId:   service.id!,
        authorId:    user.uid,
        authorName:  user.displayName||user.email?.split('@')[0]||'',
        authorAvatar:user.photoURL||'',
        rating:      rvRating,
        comment:     rvComment,
      });
      setReviewModal(false);
      setRvComment(''); setRvRating(5);
      const updated = await getServiceReviews(service.id!);
      setReviews(updated);
    } finally { setRvSaving(false); }
  }

  if (loading) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
      </div>
    </>
  );

  const svc = service || MOCK;

  return (
    <>
      <Navbar/>

      {/* Randevu Modal */}
      {apptModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[800] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] p-6 shadow-xl">
            {apptDone ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Randevu Talebiniz Alındı!</h3>
                <p className="text-sm text-[#7A7368] mb-5">İşletme en kısa sürede sizinle iletişime geçecek.</p>
                <button onClick={()=>{setApptModal(false);setApptDone(false);}} className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">Kapat</button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-1">Randevu Talebi 📅</h3>
                <p className="text-sm text-[#7A7368] mb-5">{svc.businessName}</p>
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
                        {['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'].map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Pet Adı</label>
                    <input value={apptPet} onChange={e=>setApptPet(e.target.value)} placeholder="Luna"
                      className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                  </div>
                  <div className="mb-3">
                    <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Telefon *</label>
                    <input value={apptPhone} onChange={e=>setApptPhone(e.target.value)} placeholder="05XX XXX XX XX" required
                      className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                  </div>
                  <div className="mb-5">
                    <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Not</label>
                    <textarea value={apptNote} onChange={e=>setApptNote(e.target.value)} placeholder="Özel istek veya bilgi…" rows={2}
                      className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={()=>setApptModal(false)} className="flex-1 py-3 rounded-[12px] border border-[#8B7355] text-[#5C4A32] text-sm hover:bg-[#F7F2EA] transition-all">İptal</button>
                    <button type="submit" disabled={apptSaving} className="flex-1 py-3 rounded-[12px] bg-[#C9832E] text-white text-sm font-medium hover:bg-[#b87523] transition-all disabled:opacity-60">
                      {apptSaving?'Gönderiliyor…':'Randevu Al'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Yorum Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[800] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] p-6 shadow-xl">
            <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-5">Yorum Yaz ⭐</h3>
            <form onSubmit={handleReview}>
              <div className="mb-4">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Puanınız</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} type="button" onClick={()=>setRvRating(n)}
                      className={`text-2xl transition-transform hover:scale-110 ${n<=rvRating?'text-[#C9832E]':'text-[#E3D9C6]'}`}>★</button>
                  ))}
                  <span className="text-sm text-[#7A7368] ml-2 self-center">{rvRating}/5</span>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Yorumunuz *</label>
                <textarea value={rvComment} onChange={e=>setRvComment(e.target.value)} placeholder="Deneyiminizi paylaşın…" rows={4} required
                  className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={()=>setReviewModal(false)} className="flex-1 py-3 rounded-[12px] border border-[#8B7355] text-[#5C4A32] text-sm hover:bg-[#F7F2EA] transition-all">İptal</button>
                <button type="submit" disabled={rvSaving} className="flex-1 py-3 rounded-[12px] bg-[#5C4A32] text-white text-sm font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
                  {rvSaving?'Gönderiliyor…':'Yorum Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#F7F2EA] pb-20 lg:pb-0">
        {/* Kapak */}
        <div className="h-[300px] lg:h-[400px] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={svc.coverUrl||svc.imageUrls[0]} alt={svc.businessName} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
          <div className="absolute top-[84px] left-4 sm:left-8">
            <Link href="/hizmetler" className="text-sm text-white/70 hover:text-white transition-colors">← Hizmetlere Dön</Link>
          </div>
          <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs text-white/60 mb-1">{SERVICE_TYPE_LABEL[svc.type]}</div>
                <h1 className="font-serif text-[clamp(24px,4vw,40px)] font-semibold text-white mb-1">{svc.businessName}</h1>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span>📍 {svc.city}{svc.district?`, ${svc.district}`:''}</span>
                  <span>⭐ {svc.rating} ({svc.reviewCount} yorum)</span>
                  {svc.plan==='premium'&&<span className="bg-[rgba(201,131,46,.9)] text-white text-[10px] font-semibold px-2 py-[2px] rounded-full">✦ Premium</span>}
                </div>
              </div>
              <button onClick={()=>user?setApptModal(true):router.push('/giris')}
                className="flex-shrink-0 bg-[#C9832E] text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-[#b87523] transition-all shadow-lg">
                📅 Randevu Al
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_.35fr] gap-8">

            {/* Sol */}
            <div>
              {/* Fotoğraf galerisi */}
              {svc.imageUrls.length > 0 && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-4 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={svc.imageUrls[activeImg]} alt="" className="w-full h-[240px] object-cover rounded-[14px] mb-3"/>
                  <div className="flex gap-2 overflow-x-auto">
                    {svc.imageUrls.map((img,i)=>(
                      <button key={i} onClick={()=>setActiveImg(i)} className={`flex-shrink-0 w-16 h-16 rounded-[10px] overflow-hidden border-2 transition-all ${i===activeImg?'border-[#C9832E]':'border-transparent'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="w-full h-full object-cover"/>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 bg-white rounded-[14px] border border-[rgba(196,169,107,.12)] p-1 mb-5">
                {[{val:'info',label:'Hakkında'},{val:'prices',label:'Fiyatlar'},{val:'reviews',label:`Yorumlar (${svc.reviewCount})`}].map(t=>(
                  <button key={t.val} onClick={()=>setActiveTab(t.val as any)}
                    className={`flex-1 py-2 rounded-[10px] text-sm font-medium transition-all ${activeTab===t.val?'bg-[#5C4A32] text-white':'text-[#7A7368] hover:text-[#2F2622]'}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab==='info' && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-3">Hakkında</h3>
                  <p className="text-sm leading-[1.85] text-[#5C4A32] mb-5">{svc.description}</p>
                  {svc.workingHours && (
                    <div className="bg-[#F7F2EA] rounded-[12px] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[.1em] text-[#9A9188] mb-1">Çalışma Saatleri</div>
                      <div className="text-sm text-[#5C4A32]">{svc.workingHours}</div>
                    </div>
                  )}
                </div>
              )}

              {activeTab==='prices' && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">Hizmetler & Fiyatlar</h3>
                  <div className="flex flex-col gap-3">
                    {svc.prices.map((p,i)=>(
                      <div key={i} className="flex items-center justify-between p-4 bg-[#F7F2EA] rounded-[14px]">
                        <div>
                          <div className="font-semibold text-sm text-[#2F2622]">{p.name}</div>
                          {p.desc&&<div className="text-xs text-[#7A7368] mt-[2px]">{p.desc}</div>}
                        </div>
                        <div className="font-serif text-lg font-semibold text-[#C9832E]">₺{p.price}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>user?setApptModal(true):router.push('/giris')}
                    className="w-full mt-5 py-3 rounded-[14px] bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] transition-all">
                    📅 Randevu Al
                  </button>
                </div>
              )}

              {activeTab==='reviews' && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#2F2622]">Yorumlar</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#C9832E] font-semibold">⭐ {svc.rating}</span>
                        <span className="text-sm text-[#7A7368]">({svc.reviewCount} yorum)</span>
                      </div>
                    </div>
                    <button onClick={()=>user?setReviewModal(true):router.push('/giris')}
                      className="text-sm bg-[#5C4A32] text-white px-4 py-2 rounded-full hover:bg-[#2F2622] transition-colors">
                      + Yorum Yaz
                    </button>
                  </div>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-[#7A7368] text-sm">Henüz yorum yok. İlk yorumu siz yapın!</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {reviews.map(r=>(
                        <div key={r.id} className="border-b border-[#F7F2EA] pb-4 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-sm overflow-hidden">
                              {r.authorAvatar
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={r.authorAvatar} alt="" className="w-full h-full object-cover"/>
                                : '🧑'
                              }
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-[#2F2622]">{r.authorName}</div>
                              <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(n=><span key={n} className={`text-xs ${n<=r.rating?'text-[#C9832E]':'text-[#E3D9C6]'}`}>★</span>)}
                                <span className="text-[11px] text-[#9A9188] ml-1">{timeAgo(r.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-[#5C4A32] leading-relaxed">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sağ sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 sticky top-[84px]">
                <div className="text-center mb-5">
                  <div className="font-serif text-2xl font-semibold text-[#C9832E] mb-1">
                    ₺{svc.prices[0]?.price||0}
                  </div>
                  <div className="text-xs text-[#9A9188]">den başlayan fiyatlarla</div>
                </div>
                <button onClick={()=>user?setApptModal(true):router.push('/giris')}
                  className="w-full py-3 rounded-full bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] transition-all mb-3">
                  📅 Randevu Al
                </button>
                <button onClick={()=>user?setReviewModal(true):router.push('/giris')}
                  className="w-full py-3 rounded-full border border-[#8B7355] text-[#5C4A32] text-sm font-medium hover:bg-[#5C4A32] hover:text-white transition-all mb-4">
                  ⭐ Yorum Yaz
                </button>
                <div className="border-t border-[#F7F2EA] pt-4 space-y-3">
                  {[
                    {icon:'📍', label:'Konum',    val:`${svc.city}${svc.district?`, ${svc.district}`:''}` },
                    {icon:'📞', label:'Telefon',   val:svc.phone                                          },
                    {icon:'📧', label:'E-posta',   val:svc.email                                          },
                    {icon:'🕐', label:'Saatler',   val:svc.workingHours||'—'                              },
                  ].map(f=>f.val&&(
                    <div key={f.label} className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0 mt-[1px]">{f.icon}</span>
                      <div>
                        <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188]">{f.label}</div>
                        <div className="text-xs text-[#5C4A32] font-medium">{f.val}</div>
                      </div>
                    </div>
                  ))}
                  {svc.instagram && (
                    <a href={`https://instagram.com/${svc.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-[#C9832E] hover:underline">
                      <span>📷</span> {svc.instagram}
                    </a>
                  )}
                  {svc.website && (
                    <a href={svc.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-[#C9832E] hover:underline">
                      <span>🌐</span> Website
                    </a>
                  )}
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
