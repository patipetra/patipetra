import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://patipetra.com';
  const now  = new Date();

  const staticPages = [
    { url: base,                    priority: 1.0,  changeFrequency: 'daily'   as const },
    { url: `${base}/ilanlar`,       priority: 0.9,  changeFrequency: 'hourly'  as const },
    { url: `${base}/veterinerler`,  priority: 0.8,  changeFrequency: 'daily'   as const },
    { url: `${base}/hizmetler`,     priority: 0.8,  changeFrequency: 'daily'   as const },
    { url: `${base}/topluluk`,      priority: 0.8,  changeFrequency: 'hourly'  as const },
    { url: `${base}/magaza`,        priority: 0.7,  changeFrequency: 'weekly'  as const },
    { url: `${base}/blog`,          priority: 0.7,  changeFrequency: 'daily'   as const },
    { url: `${base}/giris`,         priority: 0.5,  changeFrequency: 'monthly' as const },
    { url: `${base}/kayit`,         priority: 0.5,  changeFrequency: 'monthly' as const },
    { url: `${base}/kvkk`,          priority: 0.3,  changeFrequency: 'monthly' as const },
    { url: `${base}/gizlilik`,      priority: 0.3,  changeFrequency: 'monthly' as const },
    { url: `${base}/kullanim`,      priority: 0.3,  changeFrequency: 'monthly' as const },
    { url: `${base}/sss`,           priority: 0.4,  changeFrequency: 'monthly' as const },
  ];

  const communities = [
    'golden-retriever','labrador','husky','alman-kurdu',
    'british-shorthair','scottish-fold','van-kedisi','tekir',
    'muhabbet-kusu','papagan','tavsan','genel-sohbet',
  ].map(slug => ({
    url:             `${base}/topluluk/${slug}`,
    priority:        0.7,
    changeFrequency: 'hourly' as const,
  }));

  return [...staticPages, ...communities].map(p => ({
    ...p,
    lastModified: now,
  }));
}
