import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: 'GPTBot',          allow: '/', disallow: '/api/' },
      { userAgent: 'anthropic-ai',    allow: '/', disallow: '/api/' },
      { userAgent: 'ClaudeBot',       allow: '/', disallow: '/api/' },
      { userAgent: 'Claude-Web',      allow: '/', disallow: '/api/' },
      { userAgent: 'PerplexityBot',   allow: '/', disallow: '/api/' },
      { userAgent: 'Perplexity-User', allow: '/', disallow: '/api/' },
      { userAgent: 'Google-Extended', allow: '/', disallow: '/api/' },
      { userAgent: 'CCBot',           allow: '/', disallow: '/api/' },
      { userAgent: 'Bytespider',      allow: '/', disallow: '/api/' },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: '/api/' },
      { userAgent: 'cohere-ai',       allow: '/', disallow: '/api/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: '/api/' },
      { userAgent: 'FacebookBot',     allow: '/', disallow: '/api/' },
    ],
    sitemap: 'https://afos-analytics.com/sitemap.xml',
  };
}
