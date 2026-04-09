import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://afos-analitica-2026.vercel.app';
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/global`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  ];
}
