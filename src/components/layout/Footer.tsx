'use client';
import Link from 'next/link';
import Logo from './Logo';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();

  const socials = [
    { key:'instagram', icon:'📷', label:'Instagram', url:`https://instagram.com/${settings.instagram?.replace('@','')}` },
    { key:'twitter',   icon:'🐦', label:'Twitter',   url:`https://twitter.com/${settings.twitter?.replace('@','')}` },
    { key:'facebook',  icon:'👤', label:'Facebook',  url:settings.facebook },
    { key:'youtube',   icon:'▶️', label:'YouTube',   url:settings.youtube  },
    { key:'tiktok',    icon:'🎵', label:'TikTok',    url:`https://tiktok.com/@${settings.tiktok?.replace('@','')}` },
  ].filter(s => settings[s.key]);

  return (
    <footer className="bg-[#2F2622] text-white/70">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Marka */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4"><Logo dark={true} dark height={36}/></div>
            <p className="text-sm leading-relaxed text-white/50 mb-4">{settings.slogan}</p>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="text-sm text-[#E8B86D] hover:text-white transition-colors block mb-1">
                ✉️ {settings.email}
              </a>
            )}
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="text-sm text-white/50 hover:text-white transition-colors block mb-1">
                📞 {settings.phone}
              </a>
            )}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors block">
                💬 WhatsApp
              </a>
            )}
            {socials.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socials.map(s => (
                  <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-base hover:bg-[#C9832E] transition-all"
                    title={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Platform */}
          <div>
            <div className="text-[11px] font-semibold tracking-[.2em] uppercase text-white/30 mb-4">Platform</div>
            <div className="flex flex-col gap-2 text-sm">
              {[['İlanlar','/ilanlar'],['Veterinerler','/veterinerler'],['Hizmetler','/hizmetler'],['Topluluk','/topluluk'],['Blog','/blog'],['Mağaza','/magaza']].map(([l,h])=>(
                <Link key={l} href={h} className="text-white/50 hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Hesap */}
          <div>
            <div className="text-[11px] font-semibold tracking-[.2em] uppercase text-white/30 mb-4">Hesap</div>
            <div className="flex flex-col gap-2 text-sm">
              {[['Kayıt Ol','/kayit'],['Giriş Yap','/giris'],['Dashboard','/panel'],['Pet Pasaport','/panel/petlerim'],['Premium','/panel/premium'],['Veteriner Başvuru','/veterinerler/basvur']].map(([l,h])=>(
                <Link key={l} href={h} className="text-white/50 hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Yasal */}
          <div>
            <div className="text-[11px] font-semibold tracking-[.2em] uppercase text-white/30 mb-4">Yasal</div>
            <div className="flex flex-col gap-2 text-sm">
              {[['KVKK','/kvkk'],['Gizlilik','/gizlilik'],['Kullanım Koşulları','/kullanim'],['SSS','/sss'],['Destek','/destek']].map(([l,h])=>(
                <Link key={l} href={h} className="text-white/50 hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">{settings.footerText || '© 2025 Patıpetra. Tüm hakları saklıdır.'}</p>
          <p className="text-xs text-white/20">Türkiye'nin Pet Yaşam Platformu 🐾</p>
        </div>
      </div>
    </footer>
  );
}
