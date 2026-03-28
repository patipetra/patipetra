'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { onAuthChange } from '@/lib/auth';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export default function IlanDetayPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const [user,    setUser]    = useState<User|null>(null);
  const [listing, setListing] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx,  setImgIdx]  = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db,'listings',id));
        if (snap.exists()) setListing({id:snap.id,...snap.data()});
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push('/giris'); return; }
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const convId = [user.uid, listing.ownerId].sort().join('_');
      const { setDoc, doc: fsDoc } = await import('firebase/firestore');
      await setDoc(fsDoc(db,'conversations',convId), {
        participants:     [user.uid, listing.ownerId],
        participantNames: {
          [user.uid]:       user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
          [listing.ownerId]:listing.ownerName || 'İlan Sahibi',
        },
        lastMessage:  msgText.trim(),
        updatedAt:    serverTimestamp(),
        createdAt:    serverTimestamp(),
        [`unread_${listing.ownerId}`]: 1,
        [`unread_${user.uid}`]: 0,
      }, {merge:true});
      await addDoc(collection(db,'conversations',convId,'messages'), {
        senderId:   user.uid,
        senderName: user.displayName || user.email?.split('@')[0],
        text:       msgText.trim(),
        createdAt:  serverTimestamp(),
      });
      setSent(true); setMsgText('');
    } catch(err:any) { alert('Hata: '+err.message); }
    finally { setSending(false); }
  }

  if (loading) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
      </div>
    </>
  );

  if (!listing) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">İlan bulunamadı</h2>
          <Link href="/ilanlar" className="text-[#C9832E] hover:underline">← İlanlara Dön</Link>
        </div>
      </div>
      <Footer/>
    </>
  );

  const TYPE_LABEL: Record<string,string> = {adoption:'Sahiplendirme',temp:'Geçici Yuva',lost:'Kayıp',found:'Bulundu'};
  const SPECIES_EMOJI: Record<string,string> = {cat:'🐱',dog:'🐶',bird:'🐦',rabbit:'🐰',hamster:'🐹',turtle:'🐢',fish:'🐟',other:'🐾'};
  const images = listing.imageUrls?.filter(Boolean) || [];

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
          <Link href="/ilanlar" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← İlanlara Dön</Link>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
            {/* Sol — Görseller */}
            <div>
              {/* Ana görsel */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden mb-3 aspect-[4/3] flex items-center justify-center">
                {images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[imgIdx]} alt={listing.name} className="w-full h-full object-cover"/>
                ) : (
                  <span className="text-8xl">{SPECIES_EMOJI[listing.species]||'🐾'}</span>
                )}
              </div>
              {/* Thumbnail'lar */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`w-20 h-20 rounded-[12px] overflow-hidden border-2 flex-shrink-0 transition-all ${imgIdx===i?'border-[#C9832E]':'border-transparent'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}

              {/* Özellikler */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 mt-4">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-3">Özellikler</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {l:'Tür',     v:listing.species},
                    {l:'Cins',    v:listing.breed},
                    {l:'Yaş',     v:listing.age},
                    {l:'Cinsiyet',v:listing.gender==='male'?'Erkek':listing.gender==='female'?'Dişi':'Bilinmiyor'},
                    {l:'Renk',    v:listing.color},
                    {l:'Şehir',   v:`${listing.city}${listing.district?`, ${listing.district}`:''}` },
                  ].filter(f=>f.v).map(f=>(
                    <div key={f.l} className="bg-[#F7F2EA] rounded-[10px] p-3">
                      <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188] mb-1">{f.l}</div>
                      <div className="text-sm font-medium text-[#2F2622] capitalize">{f.v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {listing.isVaccinated && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">✓ Aşılı</span>}
                  {listing.isSterilized && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">✓ Kısırlaştırılmış</span>}
                  {listing.isMicrochipped && <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full">✓ Mikroçipli</span>}
                  {listing.isUrgent && <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full">⚡ Acil</span>}
                </div>
              </div>
            </div>

            {/* Sağ — Detaylar */}
            <div>
              {/* Başlık */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 mb-4">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-[10px] font-semibold tracking-[.1em] uppercase bg-[rgba(201,131,46,.1)] text-[#C9832E] px-3 py-1 rounded-full">
                    {TYPE_LABEL[listing.type]||listing.type}
                  </span>
                  {listing.isUrgent && (
                    <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-3 py-1 rounded-full animate-pulse">⚡ Acil</span>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2F2622] mb-2">{listing.name}</h1>
                <div className="text-sm text-[#7A7368] mb-4">📍 {listing.city}{listing.district?`, ${listing.district}`:''}</div>

                {/* Açıklama */}
                {listing.description && (
                  <div className="bg-[#F7F2EA] rounded-[14px] p-4 mb-4">
                    <p className="text-sm leading-[1.9] text-[#5C4A32]">{listing.description}</p>
                  </div>
                )}

                {/* İlan sahibi */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#F7F2EA]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-lg flex-shrink-0">🧑</div>
                  <div>
                    <div className="font-semibold text-sm text-[#2F2622]">{listing.ownerName || 'İlan Sahibi'}</div>
                    <div className="text-xs text-[#9A9188]">İlan sahibi</div>
                  </div>
                </div>
              </div>

              {/* İletişim */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 mb-4">
                <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-4">İletişim</h3>

                {/* Telefon */}
                {listing.contactPhone && (
                  <a href={`tel:${listing.contactPhone}`}
                    className="flex items-center gap-3 p-3 bg-[#F7F2EA] rounded-[12px] mb-3 hover:bg-[#EDE5D3] transition-colors">
                    <span className="text-xl">📞</span>
                    <div>
                      <div className="text-[10px] text-[#9A9188] uppercase tracking-[.1em]">Telefon</div>
                      <div className="text-sm font-medium text-[#2F2622]">{listing.contactPhone}</div>
                    </div>
                  </a>
                )}

                {/* Mesaj gönder */}
                {!sent ? (
                  <>
                    {!showMsg ? (
                      <button onClick={() => user ? setShowMsg(true) : router.push('/giris')}
                        className="w-full py-3 rounded-full bg-[#5C4A32] text-white text-sm font-semibold hover:bg-[#2F2622] transition-all">
                        💬 Mesaj Gönder
                      </button>
                    ) : (
                      <form onSubmit={sendMessage}>
                        <textarea value={msgText} onChange={e=>setMsgText(e.target.value)}
                          placeholder={`${listing.name} için mesajınızı yazın…`} rows={4} required
                          className="w-full px-3 py-3 rounded-[14px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none mb-3"/>
                        <div className="flex gap-2">
                          <button type="button" onClick={()=>setShowMsg(false)} className="flex-1 py-3 rounded-full border border-[#8B7355] text-[#5C4A32] text-sm">İptal</button>
                          <button type="submit" disabled={sending||!msgText.trim()} className="flex-1 py-3 rounded-full bg-[#C9832E] text-white text-sm font-semibold disabled:opacity-60">
                            {sending?'Gönderiliyor…':'Gönder →'}
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div className="text-center py-3">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-sm font-semibold text-[#2F2622]">Mesajınız İletildi!</p>
                    <Link href="/panel/mesajlar" className="text-xs text-[#C9832E] hover:underline mt-1 block">Mesajlarıma Git →</Link>
                  </div>
                )}
              </div>

              {/* Güvenlik uyarısı */}
              <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.15)] rounded-[16px] p-4">
                <div className="text-xs font-semibold text-[#8B7355] mb-2">🛡️ Güvenli Sahiplendirme</div>
                <ul className="text-xs text-[#8B7355] space-y-1 leading-relaxed">
                  <li>• Hayvanı görmeden ödeme yapmayın</li>
                  <li>• Güvenli bir yerde buluşun</li>
                  <li>• Sahiplendirme belgesini isteyin</li>
                  <li>• Şüpheli durumları bildirin</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
