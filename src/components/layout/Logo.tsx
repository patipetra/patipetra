'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LogoProps {
  dark?: boolean;
  height?: number;
  linkTo?: string;
  className?: string;
  sizeKey?: 'navbarHeight'|'footerHeight'|'panelHeight'|'authHeight'|'authMobileHeight';
}

const LOGO_DARK_BG  = 'https://i.ibb.co/TQ1xbSS/Gemini-Generated-Image-snxibzsnxibzsnxi.png';
const LOGO_LIGHT_BG = 'https://i.ibb.co/n88QsRz0/patipetra-logo.png';

// Firestore'dan logo ayarlarını bir kez çek, önbelleğe al
let cachedSettings: any = null;
let cacheTime = 0;

async function getLogoSettings() {
  if (cachedSettings && Date.now() - cacheTime < 60000) return cachedSettings;
  try {
    const snap = await getDoc(doc(db,'siteSettings','logos'));
    if (snap.exists()) {
      cachedSettings = snap.data();
      cacheTime = Date.now();
      return cachedSettings;
    }
  } catch(e) {}
  return null;
}

export default function Logo({
  dark = false,
  height = 48,
  linkTo = '/',
  className = '',
  sizeKey,
}: LogoProps) {
  const [logoUrl,    setLogoUrl]    = useState(dark ? LOGO_DARK_BG : LOGO_LIGHT_BG);
  const [logoHeight, setLogoHeight] = useState(height);

  useEffect(() => {
    getLogoSettings().then(s => {
      if (!s) return;
      if (s.darkLogo  && dark)  setLogoUrl(s.darkLogo);
      if (s.lightLogo && !dark) setLogoUrl(s.lightLogo);
      if (sizeKey && s[sizeKey]) setLogoHeight(s[sizeKey]);
    });
  }, [dark, sizeKey]);

  const img = (
    <Image
      src={logoUrl}
      alt="Patıpetra"
      width={300}
      height={logoHeight}
      style={{
        height: logoHeight,
        width: 'auto',
        maxWidth: logoHeight * 6,
        objectFit: 'contain',
        display: 'block',
      }}
      priority
      unoptimized
    />
  );

  if (!linkTo) return <span className={className}>{img}</span>;
  return (
    <Link href={linkTo} className={`flex items-center flex-shrink-0 ${className}`}>
      {img}
    </Link>
  );
}
