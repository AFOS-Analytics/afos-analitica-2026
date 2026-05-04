'use client';

import { useEffect, useState } from 'react';
import type { PolyData, PollData, NewsData, AnalysisData, CritData, GlobalData } from '../types';

interface DashboardData {
  poly: PolyData | null;
  polls: PollData | null;
  news: NewsData | null;
  ac: AnalysisData | null;
  crit: CritData | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const [poly, setPoly] = useState<PolyData | null>(null);
  const [polls, setPolls] = useState<PollData | null>(null);
  const [news, setNews] = useState<NewsData | null>(null);
  const [ac, setAc] = useState<AnalysisData | null>(null);
  const [crit, setCrit] = useState<CritData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithTimeout = (url: string, ms: number = 15000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ms);
      // cache: 'no-store' bypassa Vercel edge cache + browser cache; cada
      // load do dashboard busca dados frescos. APIs já têm Cache-Control
      // no-store no header, mas alguns POPs Vercel ignoram — esse flag força.
      return fetch(url, { signal: controller.signal, cache: 'no-store' })
        .then(r => { clearTimeout(timer); return r.ok ? r.json() : null; })
        .catch(() => { clearTimeout(timer); return null; });
    };

    const fetchData = async () => {
      try {
        const [p, pl, n, a, cr] = await Promise.all([
          fetchWithTimeout('/api/polymarket'),
          fetchWithTimeout('/api/polls'),
          fetchWithTimeout('/api/news'),
          fetchWithTimeout('/api/analysis-cards'),
          fetchWithTimeout('/api/analysis-criteriosa'),
        ]);
        setPoly(p);
        setPolls(pl);
        setNews(n);
        setAc(a);
        setCrit(cr);
      } catch (err) {
        console.error('[Dashboard] Data fetch error:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { poly, polls, news, ac, crit, loading, error };
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

  return { globalData: null as GlobalData | null, mapCountries, loading, fetchGlobal };
}
