import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://afos-analitica-2026.vercel.app';
  const locales = ['pt-BR', 'en', 'es'];
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Dashboard: /pt-BR, /en, /es
  for (const loc of locales) {
    const languages: Record<string, string> = {};
    for (const alt of locales) {
      languages[alt] = `${baseUrl}/${alt}`;
    }
    languages['x-default'] = `${baseUrl}/pt-BR`;

    entries.push({
      url: `${baseUrl}/${loc}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
      alternates: { languages },
    });
  }

  // Global map: /pt-BR/global, /en/global, /es/global
  for (const loc of locales) {
    const languages: Record<string, string> = {};
    for (const alt of locales) {
      languages[alt] = `${baseUrl}/${alt}/global`;
    }
    languages['x-default'] = `${baseUrl}/pt-BR/global`;

    entries.push({
      url: `${baseUrl}/${loc}/global`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: { languages },
    });
  }

  return entries;
}
