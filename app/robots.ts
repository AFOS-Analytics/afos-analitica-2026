import type { MetadataRoute } from 'next';

// /api/ + HTMLs internos de preview/brand soltos em public/ (thin, órfãos, não indexáveis).
const DISALLOW = ['/api/', '/social-preview.html', '/preview-daily-viz.html', '/brand/logo-icon.html', '/brand/logo-horizontal.html'];
// `/api/og` é a ÚNICA rota de /api/ que precisa ser buscável: é o cartão social
// por eleição de /[idioma]/election/[slug], que varia por bandeira e título e por
// isso não pode virar PNG estático. Regra mais longa vence a mais curta, então
// este Allow bate o Disallow:/api/ em Google e Bing. Daily, Tradeoff e Weekly
// não dependem dele: usam PNG estático em /brand/.
const ALLOW = ['/', '/api/og'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ALLOW, disallow: DISALLOW },
      // OpenAI ecosystem
      { userAgent: 'GPTBot',             allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'OAI-SearchBot',      allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'ChatGPT-User',       allow: ALLOW, disallow: DISALLOW },
      // Anthropic ecosystem
      { userAgent: 'anthropic-ai',       allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'ClaudeBot',          allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'Claude-Web',         allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'Claude-SearchBot',   allow: ALLOW, disallow: DISALLOW },
      // Perplexity
      { userAgent: 'PerplexityBot',      allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'Perplexity-User',    allow: ALLOW, disallow: DISALLOW },
      // Google ecosystem (Bard/Gemini)
      { userAgent: 'Google-Extended',    allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'GoogleOther',        allow: ALLOW, disallow: DISALLOW },
      // Apple Intelligence
      { userAgent: 'Applebot-Extended',  allow: ALLOW, disallow: DISALLOW },
      // Common Crawl (base de muitos LLMs)
      { userAgent: 'CCBot',              allow: ALLOW, disallow: DISALLOW },
      // Meta AI
      { userAgent: 'Meta-ExternalAgent', allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'Meta-ExternalFetcher', allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'FacebookBot',        allow: ALLOW, disallow: DISALLOW },
      // Cohere
      { userAgent: 'cohere-ai',          allow: ALLOW, disallow: DISALLOW },
      { userAgent: 'cohere-training-data-crawler', allow: ALLOW, disallow: DISALLOW },
      // ByteDance/TikTok (Doubao LLM)
      { userAgent: 'Bytespider',         allow: ALLOW, disallow: DISALLOW },
      // Mistral
      { userAgent: 'MistralAI-User',     allow: ALLOW, disallow: DISALLOW },
      // You.com
      { userAgent: 'YouBot',             allow: ALLOW, disallow: DISALLOW },
      // DuckDuckGo (alimenta DuckAssist)
      { userAgent: 'DuckAssistBot',      allow: ALLOW, disallow: DISALLOW },
      // Brave Search (alimenta Brave Leo)
      { userAgent: 'Brave-Search',       allow: ALLOW, disallow: DISALLOW },
    ],
    sitemap: 'https://www.afos-analytics.com/sitemap.xml',
  };
}
