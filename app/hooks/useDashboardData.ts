'use client';

import { useEffect, useState } from 'react';
import type { PolyData, PollData, NewsData, AnalysisData, CritData } from '../types';

interface InitialStatic {
  initialPolls: PollData | null;
  initialAc: AnalysisData | null;
  initialCrit: CritData | null;
}

interface DashboardData {
  poly: PolyData | null;
  polls: PollData | null;
  news: NewsData | null;
  ac: AnalysisData | null;
  crit: CritData | null;
  polyLoading: boolean;
  newsLoading: boolean;
  error: string | null;
}

/**
 * Dados estáticos (pesquisas + cards) vêm prontos do SERVIDOR (props iniciais,
 * lidos via lib/dashboard/static-data) → renderizam no 1º paint. Só polymarket
 * (odds ao vivo) e news (Google News/Firecrawl, pesado) são buscados no client.
 * `loading` reflete só esses dois — não bloqueia mais a página inteira.
 */
export function useDashboardData({ initialPolls, initialAc, initialCrit }: InitialStatic): DashboardData {
  const [poly, setPoly] = useState<PolyData | null>(null);
  const [news, setNews] = useState<NewsData | null>(null);
  // Loadings independentes: poly (~2s) e news (~20s, Firecrawl) resolvem em
  // tempos bem diferentes, então cada seção mostra/oculta seu skeleton sozinha.
  const [polyLoading, setPolyLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithTimeout = (url: string, ms: number = 15000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ms);
      // Sem `cache: 'no-store'` desde o congelamento: os dois caminhos abaixo são
      // arquivos fixos em public/, que nunca mudam, então o cache do navegador e
      // da borda pode servi-los. O no-store era de quando o dado era ao vivo.
      return fetch(url, { signal: controller.signal })
        .then(r => { clearTimeout(timer); return r.ok ? r.json() : null; })
        .catch(() => { clearTimeout(timer); return null; });
    };

    // 🧊 Painel do Brasil CONGELADO em 02/Nov/2026 (cobertura encerrada em 01/Nov):
    // em vez de odds e notícias ao vivo, servem dois arquivos fixos. O preço é a
    // leitura única de 02/Nov (fetchedAt dentro do arquivo); as notícias são as da
    // noite da apuração, montadas por scripts/build-brz-noticias-congeladas.mjs.
    fetchWithTimeout('/brz-congelado/polymarket-2026-11-02.json')
      .then(p => setPoly(p))
      .catch(() => setError('Erro ao carregar dados'))
      .finally(() => setPolyLoading(false));
    fetchWithTimeout('/brz-congelado/noticias-2026-10-25.json')
      .then(n => setNews(n))
      .finally(() => setNewsLoading(false));
  }, []);

  return { poly, polls: initialPolls, news, ac: initialAc, crit: initialCrit, polyLoading, newsLoading, error };
}
