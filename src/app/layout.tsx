import type { Metadata, Viewport } from 'next';
import PWAInstaller from '@/components/PWAInstaller';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
  themeColor: '#2F2622',
};

export const metadata: Metadata = {
  title: { default:"Patıpetra — Türkiye'nin Pet Yaşam Platformu", template:'%s | Patıpetra' },
  description:"Pet profili, sahiplendirme ilanları, veteriner iletişimi, pet pasaport ve mağaza — tek platformda. Türkiye genelinde 81 ilde güvenli pet sahiplendirme.",
  keywords:['evcil hayvan','pet sahiplendirme','kedi sahiplendirme','köpek sahiplendirme','veteriner','pet pasaport','patipetra'],
  authors:[{name:'Patıpetra',url:'https://patipetra.com'}],
  metadataBase: new URL('https://patipetra.com'),
  alternates: { canonical:'https://patipetra.com' },
  openGraph: {
    type:'website', locale:'tr_TR', url:'https://patipetra.com', siteName:'Patıpetra',
    title:"Patıpetra — Türkiye'nin Pet Yaşam Platformu",
    description:"Pet profili, sahiplendirme, veteriner ve mağaza — tek platformda.",
    images:[{url:'/og-image.jpg',width:1200,height:630,alt:'Patıpetra'}],
  },
  twitter:{card:'summary_large_image',title:"Patıpetra",description:"Pet platformu",images:['/og-image.jpg']},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1}},
  icons:{
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Cormorant+Garamond:ital,wght@1,600&family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context':'https://schema.org','@type':'WebSite',
          name:'Patıpetra', url:'https://patipetra.com',
          description:"Türkiye'nin pet yaşam platformu",
          potentialAction:{'@type':'SearchAction',target:'https://patipetra.com/ilanlar?q={search_term_string}','query-input':'required name=search_term_string'},
        })}} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LR385VKY10"></script>
      <script dangerouslySetInnerHTML={{__html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-LR385VKY10');
      `}}/>
    </head>
      <body>{children}<PWAInstaller/>
      </body>
    </html>
  );
}
