'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function PopupManager() {
  const [popup, setPopup] = useState<any|null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(
          collection(db,'popups'),
          where('active','==',true)
        ));
        if (!snap.empty) {
          const p = {id:snap.docs[0].id,...snap.docs[0].data()};
          // Session'da gösterildi mi?
          const shown = sessionStorage.getItem(`popup_${p.id}`);
          if (!shown) {
            setPopup(p);
            setTimeout(() => setVisible(true), 1500);
          }
        }
      } catch(e) { console.error(e); }
    }
    load();
  }, []);

  function close() {
    setVisible(false);
    if (popup) sessionStorage.setItem(`popup_${popup.id}`, '1');
    setTimeout(() => setPopup(null), 300);
  }

  if (!popup) return null;

  const TYPE_EMOJI: Record<string,string> = {
    announcement: '📣',
    campaign:     '🎉',
    warning:      '⚠️',
    info:         'ℹ️',
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={close}
        className={`fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[900] transition-opacity duration-300 ${visible?'opacity-100':'opacity-0 pointer-events-none'}`}/>

      {/* Popup */}
      <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[901] w-full max-w-[480px] px-4 transition-all duration-300 ${visible?'opacity-100 scale-100':'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 flex items-center gap-3" style={{background:popup.bgColor||'#C9832E'}}>
            <span className="text-2xl">{TYPE_EMOJI[popup.type]||'📣'}</span>
            <h2 className="font-serif text-xl font-semibold text-white flex-1">{popup.title}</h2>
            <button onClick={close} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/30 transition-colors flex-shrink-0">✕</button>
          </div>
          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-sm text-[#5C4A32] leading-[1.85]">{popup.message}</p>
          </div>
          {/* Footer */}
          <div className="px-6 pb-5 flex gap-3">
            {popup.buttonText && popup.buttonUrl ? (
              <>
                <Link href={popup.buttonUrl} onClick={close}
                  className="flex-1 py-3 rounded-full text-white text-sm font-semibold text-center transition-all hover:opacity-90"
                  style={{background:popup.bgColor||'#C9832E'}}>
                  {popup.buttonText}
                </Link>
                <button onClick={close} className="px-5 py-3 rounded-full border border-[#8B7355] text-[#5C4A32] text-sm hover:bg-[#F7F2EA]">
                  Kapat
                </button>
              </>
            ) : (
              <button onClick={close}
                className="w-full py-3 rounded-full text-white text-sm font-semibold"
                style={{background:popup.bgColor||'#C9832E'}}>
                Tamam, Anladım
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
