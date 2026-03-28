import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  dark?: boolean;
  height?: number;
  linkTo?: string;
  className?: string;
}

// Koyu arka plan için (footer, dark panel sidebar, giris/kayit sol panel)
const LOGO_DARK_BG = 'https://i.ibb.co/TQ1xbSS/Gemini-Generated-Image-snxibzsnxibzsnxi.png';

// Açık arka plan için (navbar, beyaz alanlar)
const LOGO_LIGHT_BG = 'https://i.ibb.co/n88QsRz0/patipetra-logo.png';

export default function Logo({ dark = false, height = 48, linkTo = '/', className = '' }: LogoProps) {
  const src = dark ? LOGO_DARK_BG : LOGO_LIGHT_BG;

  const img = (
    <Image
      src={src}
      alt="Patıpetra"
      width={240}
      height={height}
      style={{
        height: height,
        width: 'auto',
        maxWidth: height * 5,
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
