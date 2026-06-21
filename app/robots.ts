import type { MetadataRoute } from 'next';

// /api/ + HTMLs internos de preview/brand soltos em public/ (thin, órfãos, não indexáveis).
const DISALLOW = ['/api/', '/social-preview.html', '/preview-daily-viz.html', '/brand/logo-icon.html', '/brand/logo-horizontal.html'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // OpenAI ecosystem
      { userAgent: 'GPTBot',             allow: '/', disallow: DISALLOW },
      { userAgent: 'OAI-SearchBot',      allow: '/', disallow: DISALLOW },
      { userAgent: 'ChatGPT-User',       allow: '/', disallow: DISALLOW },
      // Anthropic ecosystem
      { userAgent: 'anthropic-ai',       allow: '/', disallow: DISALLOW },
      { userAgent: 'ClaudeBot',          allow: '/', disallow: DISALLOW },
      { userAgent: 'Claude-Web',         allow: '/', disallow: DISALLOW },
      { userAgent: 'Claude-SearchBot',   allow: '/', disallow: DISALLOW },
      // Perplexity
      { userAgent: 'PerplexityBot',      allow: '/', disallow: DISALLOW },
      { userAgent: 'Perplexity-User',    allow: '/', disallow: DISALLOW },
      // Google ecosystem (Bard/Gemini)
      { userAgent: 'Google-Extended',    allow: '/', disallow: DISALLOW },
      { userAgent: 'GoogleOther',        allow: '/', disallow: DISALLOW },
      // Apple Intelligence
      { userAgent: 'Applebot-Extended',  allow: '/', disallow: DISALLOW },
      // Common Crawl (base de muitos LLMs)
      { userAgent: 'CCBot',              allow: '/', disallow: DISALLOW },
      // Meta AI
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: DISALLOW },
      { userAgent: 'Meta-ExternalFetcher', allow: '/', disallow: DISALLOW },
      { userAgent: 'FacebookBot',        allow: '/', disallow: DISALLOW },
      // Cohere
      { userAgent: 'cohere-ai',          allow: '/', disallow: DISALLOW },
      { userAgent: 'cohere-training-data-crawler', allow: '/', disallow: DISALLOW },
      // ByteDance/TikTok (Doubao LLM)
      { userAgent: 'Bytespider',         allow: '/', disallow: DISALLOW },
      // Mistral
      { userAgent: 'MistralAI-User',     allow: '/', disallow: DISALLOW },
      // You.com
      { userAgent: 'YouBot',             allow: '/', disallow: DISALLOW },
      // DuckDuckGo (alimenta DuckAssist)
      { userAgent: 'DuckAssistBot',      allow: '/', disallow: DISALLOW },
      // Brave Search (alimenta Brave Leo)
      { userAgent: 'Brave-Search',       allow: '/', disallow: DISALLOW },
    ],
    sitemap: 'https://www.afos-analytics.com/sitemap.xml',
  };
}
