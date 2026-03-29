import type { Metadata, Viewport } from 'next';
import PWAInstaller from '@/components/PWAInstaller';
import ToastProvider from '@/components/Toast';
import PopupManager from '@/components/PopupManager';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2F2622',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://patipetra.com'),

  title: {
    default: "Patıpetra — Türkiye'nin Pet Yaşam Platformu",
    template: '%s | Patıpetra',
  },

  description: "Türkiye'nin en kapsamlı pet platformu. Kedi köpek kuş sahiplendirme ilanları, onaylı veterinerler, pet pasaport, AI sağlık asistanı ve topluluk — 81 ilde.",

  keywords: [
    'evcil hayvan sahiplendirme', 'kedi sahiplendirme', 'köpek sahiplendirme',
    'veteriner', 'online veteriner', 'pet pasaport', 'hayvan ilanları',
    'patipetra', 'pet platform türkiye', 'evcil hayvan ilanları',
    'kedi ilanları', 'köpek ilanları', 'kuş sahiplendirme',
    'pet sağlık takibi', 'aşı takibi', 'pet otel', 'pet kuaför',
    'hayvan barınağı', 'sahiplendirme ilanı', 'kayıp hayvan',
  ],

  authors: [{ name: 'Patıpetra', url: 'https://patipetra.com' }],
  creator: 'Patıpetra',
  publisher: 'Patıpetra',

  alternates: {
    canonical: 'https://patipetra.com',
    languages: { 'tr-TR': 'https://patipetra.com' },
  },

  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://patipetra.com',
    siteName: 'Patıpetra',
    title: "Patıpetra — Türkiye'nin Pet Yaşam Platformu",
    description: "Sahiplendirme ilanları, onaylı veterinerler, pet pasaport ve topluluk. Türkiye'nin en büyük pet platformu.",
    images: [{
      url: 'https://patipetra.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: "Patıpetra — Türkiye'nin Pet Yaşam Platformu",
      type: 'image/jpeg',
    }],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@patipetra',
    creator: '@patipetra',
    title: "Patıpetra — Türkiye'nin Pet Yaşam Platformu",
    description: "Sahiplendirme, veteriner, pet pasaport — tek platformda.",
    images: ['https://patipetra.com/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },

  manifest: '/manifest.json',

  verification: {
    google: ['f2a5ed7f62c61b90', 'sTdvpo17XqE5F2bFfQo4gtzdZl7P3qx-kDPSjOiw9iQ'],
  },

  category: 'pets',
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://patipetra.com/#website',
      url: 'https://patipetra.com',
      name: 'Patıpetra',
      description: "Türkiye'nin pet yaşam platformu",
      inLanguage: 'tr-TR',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://patipetra.com/ara?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://patipetra.com/#organization',
      name: 'Patıpetra',
      url: 'https://patipetra.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://i.ibb.co/n88QsRz0/patipetra-logo.png',
        width: 300,
        height: 80,
      },
      sameAs: [
        'https://instagram.com/patipetra',
        'https://twitter.com/patipetra',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@patipetra.com',
        contactType: 'customer support',
        availableLanguage: 'Turkish',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://patipetra.com/#webpage',
      url: 'https://patipetra.com',
      name: "Patıpetra — Türkiye'nin Pet Yaşam Platformu",
      isPartOf: { '@id': 'https://patipetra.com/#website' },
      about: { '@id': 'https://patipetra.com/#organization' },
      inLanguage: 'tr-TR',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr">
      <head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com"/>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com"/>

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Cormorant+Garamond:ital,wght@1,600&family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* Apple meta */}
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="Patıpetra"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>

        {/* Geo */}
        <meta name="geo.region" content="TR"/>
        <meta name="geo.country" content="TR"/>
        <meta name="language" content="Turkish"/>
        <meta httpEquiv="content-language" content="tr"/>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LR385VKY10"/>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LR385VKY10', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}}/>
      </head>
      <body>
        <ToastProvider>
        {children}
        <PWAInstaller/>
        </ToastProvider>
        <PopupManager/>
      </body>
    </html>
  );
}
