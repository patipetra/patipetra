import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  dark?: boolean;   // dark=true → koyu arka plan logosu (footer, dark hero)
  height?: number;
  linkTo?: string;
}

// Koyu arka plan (footer, dark hero, dark navbar) → altın renkli pati logolu
const LOGO_DARK_BG = 'https://i.ibb.co/TQ1xbSS/Gemini-Generated-Image-snxibzsnxibzsnxi.png';

// Açık arka plan (beyaz, krem) → koyu renkli standart logo
const LOGO_LIGHT_BG = 'https://i.ibb.co/n88QsRz0/patipetra-logo.png';

export default function Logo({ dark = false, height = 40, linkTo = '/' }: LogoProps) {
  const src = dark ? LOGO_DARK_BG : LOGO_LIGHT_BG;
  const width = height * 4; // logolar genellikle yatay, geniş

  const img = (
    <Image
      src={src}
      alt="Patıpetra"
      width={width}
      height={height}
      style={{ height, width: 'auto', objectFit: 'contain' }}
      priority
      unoptimized
    />
  );

  if (!linkTo) return img;

  return (
    <Link href={linkTo} className="flex items-center flex-shrink-0">
      {img}
    </Link>
  );
}
