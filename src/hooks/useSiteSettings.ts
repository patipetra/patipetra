import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useSiteSettings() {
  const [settings, setSettings] = useState<any>({
    siteName:   'Patıpetra',
    slogan:     'Türkiye\'nin Pet Yaşam Platformu',
    email:      'info@patipetra.com',
    phone:      '',
    whatsapp:   '',
    instagram:  '',
    twitter:    '',
    facebook:   '',
    youtube:    '',
    tiktok:     '',
    footerText: '© 2025 Patıpetra. Tüm hakları saklıdır.',
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getDoc(doc(db,'siteSettings','main'))
      .then(snap => {
        if (snap.exists()) setSettings((p: any) => ({...p,...snap.data()}));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return { settings, loaded };
}
