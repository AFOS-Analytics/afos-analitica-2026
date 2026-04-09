import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://afos-analitica-2026.vercel.app';
  const locales = ['pt-BR', 'en', 'es'];
  const now = new Date();

  function withAlternates(path: string) {
    const url = path ? `${baseUrl}/${path}` : baseUrl;
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      languages[loc] = url;
    }
    languages['x-default'] = url;
    return languages;
  }

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1,
      alternates: { languages: withAlternates('') },
    },
    {
      url: `${baseUrl}/global`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: { languages: withAlternates('global') },
    },
  ];
}
