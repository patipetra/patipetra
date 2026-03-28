'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import {
  collection, addDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, doc, setDoc,
  getDoc, updateDoc, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

function timeAgo(date: any): string {
  if (!date) return '';
  const d = date instanceof Timestamp ? date.toDate() : date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff/60000);
  if (m < 1)    return 'şimdi';
  if (m < 60)   return `${m} dk`;
  if (m < 1440) return `${Math.floor(m/60)} sa`;
  const days = Math.floor(m/1440);
  if (days < 7) return `${days} gün`;
  return d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
}

function MesajlarContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const msgEndRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const [user,       setUser]       = useState<User|null>(null);
  const [convs,      setConvs]      = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any|null>(null);
  const [messages,   setMessages]   = useState<any[]>([]);
  const [text,       setText]       = useState('');
  const [sending,    setSending]    = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [mobileView, setMobileView] = useState<'list'|'chat'>('list');

  const unsubConvsRef = useRef<(()=>void)|null>(null);
  const unsubMsgsRef  = useRef<(()=>void)|null>(null);

  // Auth
  useEffect(() => {
    const unsub = onAuthChange(u => {
      if (!u) { router.push('/giris'); return; }
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  // Konuşmaları realtime dinle
  useEffect(() => {
    if (!user) return;

    if (unsubConvsRef.current) unsubConvsRef.current();

    const q = query(
      collection(db,'conversations'),
      where('participants','array-contains',user.uid),
      orderBy('updatedAt','desc')
    );

    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d=>({id:d.id,...d.data()}));
      setConvs(list);
      setLoading(false);

      // URL'den conv aç
      const convId = searchParams.get('conv');
      if (convId) {
        const found = list.find(c=>c.id===convId);
        if (found && (!activeConv || activeConv.id!==convId)) {
          openConv(found, user);
        }
      }
    }, err => { console.error('Convs error:',err); setLoading(false); });

    unsubConvsRef.current = unsub;
    return () => unsub();
  }, [user]);

  // URL'den yeni konuşma başlat
  useEffect(() => {
    if (!user) return;
    const toId   = searchParams.get('to');
    const toName = searchParams.get('name') || 'Kullanıcı';
    if (!toId || toId === user.uid) return;

    async function startNew() {
      const convId  = [user!.uid, toId].sort().join('_');
      const convRef = doc(db,'conversations',convId);
      const snap    = await getDoc(convRef);
      if (!snap.exists()) {
        await setDoc(convRef, {
          participants: [user!.uid, toId!],
          participantNames: {
            [user!.uid]: user!.displayName || user!.email?.split('@')[0] || 'Ben',
            [toId!]:     toName,
          },
          lastMessage:  '',
          lastSenderId: '',
          createdAt:    serverTimestamp(),
          updatedAt:    serverTimestamp(),
          [`unread_${user!.uid}`]: 0,
          [`unread_${toId}`]:      0,
        });
      }
      const conv = snap.exists()
        ? {id:convId,...snap.data()}
        : {id:convId, participants:[user!.uid,toId], participantNames:{[user!.uid]:user!.displayName||'Ben',[toId!]:toName}, lastMessage:'', unread_:[0]};
      openConv(conv, user!);
    }
    startNew();
  }, [user, searchParams]);

  function openConv(conv: any, u: User) {
    setActiveConv(conv);
    setMobileView('chat');

    // Okundu işaretle
    updateDoc(doc(db,'conversations',conv.id), {
      [`unread_${u.uid}`]: 0,
    }).catch(()=>{});

    // Mesajları dinle
    if (unsubMsgsRef.current) unsubMsgsRef.current();

    const q = query(
      collection(db,'conversations',conv.id,'messages'),
      orderBy('createdAt','asc')
    );

    const unsub = onSnapshot(q, snap => {
      const msgs = snap.docs.map(d=>({id:d.id,...d.data()}));
      setMessages(msgs);
      setTimeout(() => {
        msgEndRef.current?.scrollIntoView({behavior:'smooth'});
        inputRef.current?.focus();
      }, 100);
    }, err => console.error('Messages error:', err));

    unsubMsgsRef.current = unsub;
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !activeConv || !user || sending) return;
    const msgText = text.trim();
    setText('');
    setSending(true);

    try {
      const otherId = activeConv.participants?.find((p:string)=>p!==user.uid);

      // Mesajı ekle
      await addDoc(collection(db,'conversations',activeConv.id,'messages'), {
        senderId:   user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        text:       msgText,
        createdAt:  serverTimestamp(),
        read:       false,
      });

      // Konuşmayı güncelle
      await updateDoc(doc(db,'conversations',activeConv.id), {
        lastMessage:   msgText,
        lastSenderId:  user.uid,
        updatedAt:     serverTimestamp(),
        [`unread_${otherId}`]: (activeConv[`unread_${otherId}`]||0) + 1,
        [`unread_${user.uid}`]: 0,
      });
    } catch(err) { console.error(err); setText(msgText); }
    finally { setSending(false); }
  }

  function getOtherName(conv: any): string {
    if (!user) return 'Kullanıcı';
    const otherId = conv.participants?.find((p:string)=>p!==user.uid);
    return conv.participantNames?.[otherId] || 'Kullanıcı';
  }

  function getUnread(conv: any): number {
    if (!user) return 0;
    return conv[`unread_${user.uid}`] || 0;
  }

  function getAvatar(name: string): string {
    return name?.charAt(0)?.toUpperCase() || '?';
  }

  const totalUnread = convs.reduce((a,c)=>a+getUnread(c),0);

  return (
    <div className="h-screen flex flex-col lg:ml-[260px] bg-[#F7F2EA]">
      {/* Header */}
      <div className="h-14 bg-white border-b border-[rgba(196,169,107,.15)] flex items-center px-4 gap-3 flex-shrink-0 shadow-sm">
        {mobileView==='chat' && activeConv ? (
          <>
            <button onClick={()=>{setMobileView('list');setActiveConv(null);if(unsubMsgsRef.current)unsubMsgsRef.current();}} className="lg:hidden text-[#7A7368] hover:text-[#2F2622] mr-1">
              ←
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {getAvatar(getOtherName(activeConv))}
            </div>
            <div>
              <div className="font-semibold text-sm text-[#2F2622]">{getOtherName(activeConv)}</div>
              <div className="text-[10px] text-green-500">● Aktif</div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Link href="/" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all flex-shrink-0">🌐 Ana Sayfa</Link>
          <Link href="/panel" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all flex-shrink-0">← Kontrol Paneli</Link>
        </div>
        <h1 className="font-serif text-xl font-semibold text-[#2F2622]">💬 Mesajlar</h1>
            {totalUnread > 0 && (
              <span className="bg-[#C9832E] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Konuşma listesi */}
        <div className={`${mobileView==='chat'?'hidden lg:flex':'flex'} flex-col w-full lg:w-[300px] lg:border-r border-[rgba(196,169,107,.15)] bg-white flex-shrink-0`}>
          {loading ? (
            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
          ) : convs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">Henüz mesaj yok</h3>
              <p className="text-sm text-[#7A7368] leading-relaxed mb-4">
                Veteriner veya ilan sahipleriyle iletişime geçtiğinizde mesajlarınız burada görünür.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {convs.map(conv => {
                const unread  = getUnread(conv);
                const isActive = activeConv?.id === conv.id;
                const otherName = getOtherName(conv);
                return (
                  <button key={conv.id} onClick={()=>openConv(conv, user!)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-[#F7F2EA] text-left transition-all ${isActive?'bg-[rgba(201,131,46,.06)]':'hover:bg-[#F7F2EA]'}`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-base font-bold text-white">
                        {getAvatar(otherName)}
                      </div>
                      {unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C9832E] text-white text-[10px] font-bold flex items-center justify-center">
                          {unread > 9 ? '9+' : unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-[2px]">
                        <span className={`text-sm truncate ${unread>0?'font-bold text-[#2F2622]':'font-medium text-[#2F2622]'}`}>
                          {otherName}
                        </span>
                        <span className="text-[10px] text-[#9A9188] flex-shrink-0 ml-2">
                          {timeAgo(conv.updatedAt)}
                        </span>
                      </div>
                      <div className={`text-xs truncate ${unread>0?'text-[#2F2622] font-medium':'text-[#9A9188]'}`}>
                        {conv.lastMessage || 'Konuşma başladı'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mesaj alanı */}
        <div className={`${mobileView==='list'?'hidden lg:flex':'flex'} flex-1 flex-col overflow-hidden`}>
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center bg-[#F7F2EA]">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Mesajlaşmaya Başla</h3>
                <p className="text-sm text-[#7A7368]">Sol taraftan bir konuşma seç.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mesajlar */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F2EA]">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="text-sm text-[#9A9188]">Konuşmayı başlatmak için mesaj gönderin.</p>
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isMe    = msg.senderId === user?.uid;
                  const msgDate = msg.createdAt instanceof Timestamp ? msg.createdAt.toDate() : msg.createdAt?.toDate?.() ? msg.createdAt.toDate() : null;
                  const showTime = idx === 0 || (idx > 0 && msgDate && (() => {
                    const prevDate = messages[idx-1].createdAt instanceof Timestamp ? messages[idx-1].createdAt.toDate() : messages[idx-1].createdAt?.toDate?.();
                    return prevDate && (msgDate.getTime() - prevDate.getTime()) > 5*60*1000;
                  })());

                  return (
                    <div key={msg.id}>
                      {showTime && msgDate && (
                        <div className="text-center text-[10px] text-[#9A9188] my-2">
                          {msgDate.toLocaleString('tr-TR',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})}
                        </div>
                      )}
                      <div className={`flex ${isMe?'justify-end':'justify-start'} items-end gap-2`}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mb-1">
                            {getAvatar(msg.senderName)}
                          </div>
                        )}
                        <div className={`max-w-[72%] ${isMe?'items-end':'items-start'} flex flex-col gap-1`}>
                          <div className={`px-4 py-2 rounded-[18px] text-sm leading-relaxed ${
                            isMe
                              ? 'bg-[#5C4A32] text-white rounded-br-[4px]'
                              : 'bg-white text-[#2F2622] rounded-bl-[4px] shadow-sm border border-[rgba(196,169,107,.1)]'
                          }`}>
                            {msg.text}
                          </div>
                          <div className={`text-[10px] text-[#9A9188] ${isMe?'text-right':'text-left'}`}>
                            {msgDate ? msgDate.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}) : ''}
                            {isMe && ' ✓'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgEndRef}/>
              </div>

              {/* Mesaj gönder */}
              <form onSubmit={sendMessage} className="p-3 bg-white border-t border-[rgba(196,169,107,.15)] flex gap-2 items-center">
                <input
                  ref={inputRef}
                  value={text}
                  onChange={e=>setText(e.target.value)}
                  placeholder="Mesaj yaz…"
                  disabled={sending}
                  className="flex-1 px-4 py-3 rounded-full border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"
                  onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage(e as any);}}}
                />
                <button type="submit" disabled={sending||!text.trim()}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${text.trim()?'bg-[#C9832E] hover:bg-[#b87523] text-white':'bg-[#F7F2EA] text-[#9A9188]'} disabled:opacity-50`}>
                  {sending
                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MesajlarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <MesajlarContent/>
    </Suspense>
  );
}
