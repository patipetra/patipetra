'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { onAuthChange } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function BottomNav() {
  const pathname = usePathname();
  const [user,       setUser]       = useState<any>(null);
  const [unreadMsg,  setUnreadMsg]  = useState(0);
  const [unreadNot,  setUnreadNot]  = useState(0);

  // Panel/admin/vet-panel sayfalarında gösterme
  const hidden = pathname.startsWith('/panel') || pathname.startsWith('/admin') || pathname.startsWith('/vet-panel');
  if (hidden) return null;

  useEffect(() => {
    const unsub = onAuthChange(u => { setUser(u); });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Okunmamış mesajlar
    const msgQ = query(collection(db,'conversations'),where('participants','array-contains',user.uid),where('unreadCount.'+user.uid,'>',0));
    const unsubMsg = onSnapshot(msgQ, snap => setUnreadMsg(snap.size), () => {});

    // Okunmamış bildirimler
    const notQ = query(collection(db,'notifications'),where('userId','==',user.uid),where('isRead','==',false));
    const unsubNot = onSnapshot(notQ, snap => setUnreadNot(snap.size), () => {});

    return () => { unsubMsg(); unsubNot(); };
  }, [user]);

  const NAV = [
    { href: '/',          icon: '🏠', label: 'Ana Sayfa' },
    { href: '/ilanlar',   icon: '🐾', label: 'İlanlar'   },
    { href: '/ara',       icon: '🔍', label: 'Ara'       },
    { href: user ? '/panel/mesajlar' : '/giris', icon: '💬', label: 'Mesajlar', badge: unreadMsg  },
    { href: user ? '/panel'          : '/giris', icon: user ? '👤' : '🔑', label: user ? 'Panel' : 'Giriş' },
  ];

  return (
    <>
      {/* Mobilde sayfa altına boşluk bırak */}
      <div className="h-20 lg:hidden"/>

      <nav className="fixed bottom-0 left-0 right-0 z-[300] lg:hidden">
        {/* Blur arka plan */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-[rgba(196,169,107,.15)]"/>

        <div className="relative flex items-center justify-around px-2 py-2 safe-area-pb">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-col items-center gap-[3px] px-3 py-1 rounded-[12px] transition-all relative min-w-[56px]
                  ${active ? 'bg-[rgba(201,131,46,.1)]' : ''}`}>

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}

                <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium transition-colors leading-none
                  ${active ? 'text-[#C9832E]' : 'text-[#9A9188]'}`}>
                  {item.label}
                </span>

                {/* Aktif nokta */}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9832E]"/>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
