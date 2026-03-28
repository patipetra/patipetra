import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ilanlar',
          '/ilanlar/',
          '/veterinerler',
          '/veterinerler/',
          '/hizmetler',
          '/hizmetler/',
          '/blog',
          '/blog/',
          '/topluluk',
          '/topluluk/',
          '/magaza',
          '/ara',
        ],
        disallow: [
          '/panel/',
          '/admin/',
          '/vet-panel/',
          '/api/',
          '/_next/',
          '/giris',
          '/kayit',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/panel/', '/admin/', '/vet-panel/', '/api/'],
      },
    ],
    sitemap: 'https://patipetra.com/sitemap.xml',
    host: 'https://patipetra.com',
  };
}
