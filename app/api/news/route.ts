import { NextResponse } from 'next/server';

export const revalidate = 1800; // 30 minutos — notícias mais frescas

interface NewsItem {
  title: string;
  source: string;
  url: string;
  time: string;
  category: string;
  summary?: string;
}

const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY || '';

// Firecrawl scrape for richer content
async function firecrawlScrape(url: string): Promise<string> {
  if (!FIRECRAWL_KEY) return '';
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${FIRECRAWL_KEY}` },
      body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
    });
    if (!res.ok) return '';
    const data = await res.json();
    return (data?.data?.markdown || '').slice(0, 500);
  } catch { return ''; }
}

// Google News RSS — free, no key
async function fetchGoogleNews(query: string, category: string): Promise<NewsItem[]> {
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://news.google.com/rss/search?q=${encoded}&hl=pt-BR&gl=BR&ceid=BR:pt-419`,
      { next: { revalidate: 7200 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const items: NewsItem[] = [];
    const parts = xml.split('<item>');
    for (let i = 1; i < parts.length && items.length < 5; i++) {
      const block = parts[i];
      const titleMatch = block.match(/<title>([^<]+)<\/title>/);
      const linkMatch = block.match(/<link>([^<]+)<\/link>/);
      const pubMatch = block.match(/<pubDate>([^<]+)<\/pubDate>/);
      const sourceMatch = block.match(/<source[^>]*>([^<]+)<\/source>/);

      const title = titleMatch?.[1]?.trim() || '';
      const link = linkMatch?.[1]?.trim() || '';
      const pubDate = pubMatch?.[1]?.trim() || '';
      const source = sourceMatch?.[1]?.trim() || '';

      if (title && title !== 'Google Notícias') {
        let timeStr = '';
        if (pubDate) {
          try {
            const date = new Date(pubDate);
            timeStr = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
          } catch { timeStr = ''; }
        }

        let finalSource = source;
        if (!finalSource) {
          const dashIdx = title.lastIndexOf(' - ');
          if (dashIdx > 0) finalSource = title.slice(dashIdx + 3).trim();
        }

        items.push({
          title: title.replace(/ - [^-]+$/, '').trim(),
          source: finalSource || 'Google News',
          url: link,
          time: timeStr,
          category,
        });
      }
    }
    return items;
  } catch { return []; }
}

// Firecrawl-powered deep scrape of key portals
async function fetchPortalHeadlines(): Promise<NewsItem[]> {
  if (!FIRECRAWL_KEY) return [];

  const portals = [
    { url: 'https://www.poder360.com.br/tag/eleicoes-2026/', source: 'Poder360', cat: '🗳️ Presidência' },
    { url: 'https://www.metropoles.com/brasil/politica-brasil', source: 'Metrópoles', cat: '🗳️ Presidência' },
    { url: 'https://www.cnnbrasil.com.br/politica/', source: 'CNN Brasil', cat: '🏛️ Congresso' },
    { url: 'https://www.gazetadopovo.com.br/eleicoes/2026/', source: 'Gazeta do Povo', cat: '🗳️ Presidência' },
    { url: 'https://noticias.uol.com.br/politica/', source: 'UOL', cat: '🗳️ Presidência' },
  ];

  const results: NewsItem[] = [];

  for (const portal of portals) {
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${FIRECRAWL_KEY}` },
        body: JSON.stringify({
          url: portal.url,
          formats: ['links'],
          onlyMainContent: true,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const links = data?.data?.links || [];

      // Extract article links with titles
      for (const link of links.slice(0, 8)) {
        if (link && typeof link === 'object' && link.text && link.href) {
          const text = (link.text as string).trim();
          if (text.length > 30 && text.length < 200 && !text.includes('Assine') && !text.includes('Login')) {
            results.push({
              title: text,
              source: portal.source,
              url: link.href as string,
              time: '',
              category: portal.cat,
            });
          }
        }
      }
    } catch { continue; }
  }

  return results;
}

export async function GET() {
  try {
    // "when:1d" = últimas 24h no Google News
    const queries = [
      { q: 'eleições 2026 presidente when:1d', cat: '🗳️ Presidência' },
      { q: 'Flávio Bolsonaro Lula 2026 when:1d', cat: '🗳️ Presidência' },
      { q: 'Caiado Tarcísio Zema Renan Santos 2026 when:1d', cat: '🗳️ Presidência' },
      { q: 'governador eleição 2026 when:1d', cat: '🏛️ Governadores' },
      { q: 'senado eleição 2026 when:1d', cat: '🏛️ Senado' },
      { q: 'Banco Master BRB when:1d', cat: '🏦 Banco Master' },
      { q: 'INSS Lulinha CPI when:1d', cat: '🔴 INSS' },
      { q: 'STF Moraes Toffoli Gilmar Dino when:1d', cat: '⚖️ STF' },
      { q: 'Alcolumbre Senado Hugo Motta Câmara when:1d', cat: '🏛️ Congresso' },
      { q: 'eleições 2026 pesquisa when:1d', cat: '🗳️ Presidência' },
      // Fallback sem filtro de tempo (caso 24h retorne pouco)
      { q: 'eleições 2026 presidente candidato', cat: '🗳️ Presidência' },
      { q: 'Banco Master escândalo BRB rombo', cat: '🏦 Banco Master' },
      { q: 'STF impeachment ministros 2026', cat: '⚖️ STF' },
    ];

    // Fetch Google News RSS (free) + Firecrawl portals (API key)
    const [googleResults, portalResults] = await Promise.all([
      Promise.all(queries.map(({ q, cat }) => fetchGoogleNews(q, cat))),
      fetchPortalHeadlines(),
    ]);

    const allNews = [...googleResults.flat(), ...portalResults];

    // Deduplicate
    const seen = new Set<string>();
    const unique = allNews.filter(n => {
      const key = n.title.toLowerCase().slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Enrich top 5 headlines with Firecrawl summaries (if key available)
    if (FIRECRAWL_KEY) {
      const toEnrich = unique.filter(n => n.url && !n.url.includes('news.google.com')).slice(0, 3);
      await Promise.all(
        toEnrich.map(async (n) => {
          const summary = await firecrawlScrape(n.url);
          if (summary) n.summary = summary.slice(0, 200) + '...';
        })
      );
    }

    // Group by category
    const categories = ['🗳️ Presidência', '🏛️ Governadores', '🏛️ Senado', '🏦 Banco Master', '🔴 INSS', '⚖️ STF', '🏛️ Congresso'];
    const grouped: Record<string, NewsItem[]> = {};
    for (const cat of categories) {
      grouped[cat] = unique.filter(n => n.category === cat).slice(0, 5);
    }

    const now = new Date();
    const brTime = now.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return NextResponse.json({
      updatedAt: brTime,
      totalNews: unique.length,
      grouped,
      firecrawlActive: !!FIRECRAWL_KEY,
      all: unique.slice(0, 35),
    });
  } catch {
    return NextResponse.json({ updatedAt: '', totalNews: 0, grouped: {}, firecrawlActive: false, all: [] }, { status: 500 });
  }
}
