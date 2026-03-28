import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://patipetra.com';
  const now = new Date();

  // Statik sayfalar
  const staticPages = [
    { url: baseUrl,                         priority: 1.0,  changeFrequency: 'daily'   as const },
    { url: `${baseUrl}/ilanlar`,            priority: 0.9,  changeFrequency: 'hourly'  as const },
    { url: `${baseUrl}/veterinerler`,       priority: 0.9,  changeFrequency: 'daily'   as const },
    { url: `${baseUrl}/hizmetler`,          priority: 0.8,  changeFrequency: 'daily'   as const },
    { url: `${baseUrl}/topluluk`,           priority: 0.7,  changeFrequency: 'hourly'  as const },
    { url: `${baseUrl}/blog`,               priority: 0.8,  changeFrequency: 'daily'   as const },
    { url: `${baseUrl}/magaza`,             priority: 0.7,  changeFrequency: 'daily'   as const },
    { url: `${baseUrl}/ara`,                priority: 0.6,  changeFrequency: 'weekly'  as const },
    { url: `${baseUrl}/kayit`,              priority: 0.8,  changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/giris`,              priority: 0.5,  changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/veterinerler/basvur`,priority: 0.7,  changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/hizmetler/basvur`,   priority: 0.7,  changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/kvkk`,               priority: 0.3,  changeFrequency: 'yearly'  as const },
    { url: `${baseUrl}/gizlilik`,           priority: 0.3,  changeFrequency: 'yearly'  as const },
    { url: `${baseUrl}/kullanim`,           priority: 0.3,  changeFrequency: 'yearly'  as const },
    { url: `${baseUrl}/sss`,               priority: 0.5,  changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/destek`,             priority: 0.5,  changeFrequency: 'monthly' as const },
  ];

  return staticPages.map(page => ({
    ...page,
    lastModified: now,
  }));
}
