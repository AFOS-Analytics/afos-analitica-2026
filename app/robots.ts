import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      // OpenAI ecosystem
      { userAgent: 'GPTBot',             allow: '/', disallow: '/api/' },
      { userAgent: 'OAI-SearchBot',      allow: '/', disallow: '/api/' },
      { userAgent: 'ChatGPT-User',       allow: '/', disallow: '/api/' },
      // Anthropic ecosystem
      { userAgent: 'anthropic-ai',       allow: '/', disallow: '/api/' },
      { userAgent: 'ClaudeBot',          allow: '/', disallow: '/api/' },
      { userAgent: 'Claude-Web',         allow: '/', disallow: '/api/' },
      { userAgent: 'Claude-SearchBot',   allow: '/', disallow: '/api/' },
      // Perplexity
      { userAgent: 'PerplexityBot',      allow: '/', disallow: '/api/' },
      { userAgent: 'Perplexity-User',    allow: '/', disallow: '/api/' },
      // Google ecosystem (Bard/Gemini)
      { userAgent: 'Google-Extended',    allow: '/', disallow: '/api/' },
      { userAgent: 'GoogleOther',        allow: '/', disallow: '/api/' },
      // Apple Intelligence
      { userAgent: 'Applebot-Extended',  allow: '/', disallow: '/api/' },
      // Common Crawl (base de muitos LLMs)
      { userAgent: 'CCBot',              allow: '/', disallow: '/api/' },
      // Meta AI
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: '/api/' },
      { userAgent: 'Meta-ExternalFetcher', allow: '/', disallow: '/api/' },
      { userAgent: 'FacebookBot',        allow: '/', disallow: '/api/' },
      // Cohere
      { userAgent: 'cohere-ai',          allow: '/', disallow: '/api/' },
      { userAgent: 'cohere-training-data-crawler', allow: '/', disallow: '/api/' },
      // ByteDance/TikTok (Doubao LLM)
      { userAgent: 'Bytespider',         allow: '/', disallow: '/api/' },
      // Mistral
      { userAgent: 'MistralAI-User',     allow: '/', disallow: '/api/' },
      // You.com
      { userAgent: 'YouBot',             allow: '/', disallow: '/api/' },
      // DuckDuckGo (alimenta DuckAssist)
      { userAgent: 'DuckAssistBot',      allow: '/', disallow: '/api/' },
      // Brave Search (alimenta Brave Leo)
      { userAgent: 'Brave-Search',       allow: '/', disallow: '/api/' },
    ],
    sitemap: 'https://afos-analytics.com/sitemap.xml',
  };
}
