'use client';
import { useEffect, useState } from 'react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner,     setShowBanner]     = useState(false);

  useEffect(() => {
    // Service Worker kaydet
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Install prompt yakala
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // 3 saniye sonra banner göster
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-[80px] left-4 right-4 lg:left-auto lg:right-6 lg:w-[340px] bg-[#2F2622] rounded-[20px] p-4 shadow-2xl z-[500] border border-white/10 flex items-center gap-4">
      <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-2xl flex-shrink-0">
        🐾
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-sm">Ana Ekrana Ekle</div>
        <div className="text-white/50 text-xs mt-[2px]">Patıpetra'yı uygulama gibi kullan</div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={handleInstall}
          className="bg-[#C9832E] text-white text-xs font-semibold px-3 py-[6px] rounded-full hover:bg-[#b87523] transition-colors whitespace-nowrap">
          Ekle
        </button>
        <button onClick={()=>setShowBanner(false)}
          className="text-white/40 text-xs hover:text-white/70 text-center">
          Kapat
        </button>
      </div>
    </div>
  );
}
