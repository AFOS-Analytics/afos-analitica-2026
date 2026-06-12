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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithTimeout = (url: string, ms: number = 15000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ms);
      // cache: 'no-store' bypassa Vercel edge cache + browser cache; cada
      // load busca odds/notícias frescas. (Estáticos já vêm do SSR.)
      return fetch(url, { signal: controller.signal, cache: 'no-store' })
        .then(r => { clearTimeout(timer); return r.ok ? r.json() : null; })
        .catch(() => { clearTimeout(timer); return null; });
    };

    const fetchData = async () => {
      try {
        const [p, n] = await Promise.all([
          fetchWithTimeout('/api/polymarket'),
          fetchWithTimeout('/api/news'),
        ]);
        setPoly(p);
        setNews(n);
      } catch (err) {
        console.error('[Dashboard] Data fetch error:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { poly, polls: initialPolls, news, ac: initialAc, crit: initialCrit, loading, error };
}

export function useGlobalElections() {
  const [mapCountries, setMapCountries] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(false);

  const doFetch = () => {
    if (loading) return;
    setLoading(true);
    fetch('/api/global-map')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.c) setMapCountries(data.c);
      })
      .catch(err => console.error('[Global] Fetch error:', err))
      .finally(() => setLoading(false));
  };

  // Eager fetch no mount
  useEffect(() => { doFetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // fetchGlobal: retry se dados não chegaram
  const fetchGlobal = () => {
    if (!mapCountries) doFetch();
  };

  return { mapCountries, loading, fetchGlobal };
}
