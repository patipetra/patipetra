'use client';
import { useState, useEffect } from 'react';

export default function LangSwitcher() {
  const [lang, setLang] = useState<'tr'|'en'>('tr');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'tr'|'en';
    if (saved) setLang(saved);
  }, []);

  function toggle() {
    const next = lang === 'tr' ? 'en' : 'tr';
    setLang(next);
    localStorage.setItem('lang', next);
    // Sayfayı yenile (basit çözüm)
    window.location.reload();
  }

  return (
    <button onClick={toggle}
      className="flex items-center gap-1 text-[12px] font-semibold text-[#7A7368] hover:text-[#2F2622] transition-colors border border-[rgba(196,169,107,.3)] rounded-full px-3 py-1 hover:border-[#8B7355]">
      <span>{lang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
      <span>{lang === 'tr' ? 'TR' : 'EN'}</span>
    </button>
  );
}
