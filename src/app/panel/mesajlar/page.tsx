'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import {
  collection, addDoc, getDocs, query, where,
  orderBy, onSnapshot, serverTimestamp, doc,
  setDoc, getDoc, updateDoc, or,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

function timeAgo(date: any): string {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff/60000);
  if (m < 1) return 'şimdi';
  if (m < 60) return `${m} dk`;
  if (m < 1440) return `${Math.floor(m/60)} sa`;
  return d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
}

export default function MesajlarPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [user,       setUser]       = useState<User|null>(null);
  const [loading,    setLoading]    = useState(true);
  const [convs,      setConvs]      = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any|null>(null);
  const [messages,   setMessages]   = useState<any[]>([]);
  const [text,       setText]       = useState('');
  const [sending,    setSending]    = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthChange(async u => {
      if (!u) { router.push('/giris'); return; }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Konuşmaları yükle
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db,'conversations'),
      where('participants','array-contains',user.uid),
      orderBy('updatedAt','desc')
    );
    const unsub = onSnapshot(q, snap => {
      setConvs(snap.docs.map(d=>({id:d.id,...d.data()})));
    }, err => console.error(err));
    return () => unsub();
  }, [user]);

  // URL'den konuşma aç
  useEffect(() => {
    const convId = searchParams.get('conv');
    if (convId && convs.length > 0) {
      const conv = convs.find(c=>c.id===convId);
      if (conv) setActiveConv(conv);
    }
  }, [searchParams, convs]);

  // Aktif konuşmanın mesajlarını dinle
  useEffect(() => {
    if (!activeConv) return;
    const q = query(
      collection(db,'conversations',activeConv.id,'messages'),
      orderBy('createdAt','asc')
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d=>({id:d.id,...d.data()})));
      setTimeout(()=>messagesEndRef.current?.scrollIntoView({behavior:'smooth'}),100);
    });
    // Okundu işaretle
    if (user) {
      updateDoc(doc(db,'conversations',activeConv.id),{
        [`unread_${user.uid}`]: 0,
      }).catch(()=>{});
    }
    return () => unsub();
  }, [activeConv, user]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !activeConv || !user) return;
    setSending(true);
    try {
      const otherId = activeConv.participants.find((p:string)=>p!==user.uid);
      await addDoc(collection(db,'conversations',activeConv.id,'messages'),{
        senderId:   user.uid,
        senderName: user.displayName || user.email?.split('@')[0],
        text:       text.trim(),
        createdAt:  serverTimestamp(),
      });
      await updateDoc(doc(db,'conversations',activeConv.id),{
        lastMessage: text.trim(),
        updatedAt:   serverTimestamp(),
        [`unread_${otherId}`]: (activeConv[`unread_${otherId}`]||0) + 1,
      });
      setText('');
    } finally { setSending(false); }
  }

  // Yeni konuşma başlat (URL'den userId ile)
  useEffect(() => {
    const toUserId = searchParams.get('to');
    const toName   = searchParams.get('name') || 'Kullanıcı';
    if (!toUserId || !user || toUserId === user.uid) return;

    async function startConv() {
      // Mevcut konuşma var mı?
      const existing = convs.find(c=>c.participants.includes(toUserId));
      if (existing) { setActiveConv(existing); return; }

      // Yeni konuşma oluştur
      const convId = [user!.uid, toUserId].sort().join('_');
      const convRef = doc(db,'conversations',convId);
      const snap = await getDoc(convRef);
      if (!snap.exists()) {
        await setDoc(convRef,{
          participants:  [user!.uid, toUserId],
          participantNames: {
            [user!.uid]: user!.displayName || user!.email?.split('@')[0] || 'Kullanıcı',
            [toUserId]:  toName,
          },
          lastMessage:   '',
          createdAt:     serverTimestamp(),
          updatedAt:     serverTimestamp(),
          [`unread_${user!.uid}`]: 0,
          [`unread_${toUserId}`]:  0,
        });
      }
      const newConv = {id:convId, participants:[user!.uid,toUserId],
        participantNames:{[user!.uid]:user!.displayName||'Ben',[toUserId]:toName}};
      setActiveConv(newConv);
    }
    startConv();
  }, [searchParams, user, convs]);

  if (loading) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  const getOtherName = (conv: any) => {
    if (!user) return 'Kullanıcı';
    const otherId = conv.participants?.find((p:string)=>p!==user.uid);
    return conv.participantNames?.[otherId] || 'Kullanıcı';
  };

  const getUnread = (conv: any) => {
    if (!user) return 0;
    return conv[`unread_${user.uid}`] || 0;
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="h-16 bg-[rgba(247,242,234,.95)] backdrop-blur-[16px] border-b border-[rgba(196,169,107,.15)] flex items-center px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/panel" className="text-sm text-[#7A7368] hover:text-[#2F2622] lg:hidden">←</Link>
            <h1 className="font-serif text-xl font-semibold text-[#2F2622]">Mesajlar</h1>
            {convs.reduce((acc,c)=>acc+getUnread(c),0) > 0 && (
              <span className="bg-[#C9832E] text-white text-[10px] font-bold px-2 py-[2px] rounded-full">
                {convs.reduce((acc,c)=>acc+getUnread(c),0)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Konuşma listesi */}
          <div className={`w-full lg:w-[300px] border-r border-[rgba(196,169,107,.15)] bg-white flex-shrink-0 overflow-y-auto ${activeConv?'hidden lg:flex flex-col':'flex flex-col'}`}>
            {convs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">Henüz mesaj yok</h3>
                <p className="text-sm text-[#7A7368] leading-relaxed">İlan sahipleri veya veterinerlerle iletişime geçtiğinizde mesajlarınız burada görünür.</p>
                <Link href="/veterinerler" className="mt-4 text-sm text-[#C9832E] hover:underline">Veteriner Bul →</Link>
              </div>
            ) : (
              convs.map(conv=>(
                <button key={conv.id} onClick={()=>setActiveConv(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-4 border-b border-[#F7F2EA] text-left hover:bg-[#F7F2EA] transition-colors ${activeConv?.id===conv.id?'bg-[#F7F2EA]':''}`}>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-lg flex-shrink-0">
                    🧑
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-[2px]">
                      <span className="font-semibold text-sm text-[#2F2622] truncate">{getOtherName(conv)}</span>
                      <span className="text-[10px] text-[#9A9188] flex-shrink-0">{timeAgo(conv.updatedAt)}</span>
                    </div>
                    <div className="text-xs text-[#7A7368] truncate">{conv.lastMessage||'Konuşma başladı'}</div>
                  </div>
                  {getUnread(conv) > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#C9832E] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {getUnread(conv)}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Mesaj alanı */}
          {activeConv ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Konuşma header */}
              <div className="h-14 bg-white border-b border-[rgba(196,169,107,.15)] flex items-center px-4 gap-3 flex-shrink-0">
                <button onClick={()=>setActiveConv(null)} className="lg:hidden text-[#7A7368] hover:text-[#2F2622]">←</button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-base flex-shrink-0">🧑</div>
                <div>
                  <div className="font-semibold text-sm text-[#2F2622]">{getOtherName(activeConv)}</div>
                  <div className="text-[10px] text-[#9A9188]">Aktif</div>
                </div>
              </div>

              {/* Mesajlar */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F2EA]">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-[#9A9188] text-sm">
                    Henüz mesaj yok. İlk mesajı gönder!
                  </div>
                )}
                {messages.map(msg=>{
                  const isMe = msg.senderId === user?.uid;
                  return (
                    <div key={msg.id} className={`flex ${isMe?'justify-end':'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-[16px] px-4 py-3 ${isMe?'bg-[#5C4A32] text-white rounded-br-[4px]':'bg-white text-[#2F2622] rounded-bl-[4px] shadow-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={`text-[10px] mt-1 ${isMe?'text-white/50':'text-[#9A9188]'}`}>
                          {timeAgo(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef}/>
              </div>

              {/* Mesaj gönder */}
              <form onSubmit={sendMessage} className="p-4 bg-white border-t border-[rgba(196,169,107,.15)] flex gap-3">
                <input value={text} onChange={e=>setText(e.target.value)}
                  placeholder="Mesaj yaz…" disabled={sending}
                  className="flex-1 px-4 py-3 rounded-full border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                <button type="submit" disabled={sending||!text.trim()}
                  className="w-11 h-11 rounded-full bg-[#C9832E] text-white flex items-center justify-center hover:bg-[#b87523] transition-colors disabled:opacity-50 flex-shrink-0">
                  {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : '→'}
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center bg-[#F7F2EA]">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Mesajlaşmaya Başla</h3>
                <p className="text-sm text-[#7A7368]">Sol taraftan bir konuşma seç.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
