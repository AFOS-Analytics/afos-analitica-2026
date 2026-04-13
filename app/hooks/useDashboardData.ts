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
      return fetch(url, { signal: controller.signal })
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
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [mapCountries, setMapCountries] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGlobal = () => {
    if (mapCountries) return;
    setLoading(true);

    // Fonte única: /api/global-map (14 países, cron 60s, Redis KV)
    fetch('/api/global-map')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.c) setMapCountries(data.c);
      })
      .catch(err => console.error('[Global] Fetch error:', err))
      .finally(() => setLoading(false));
  };

  return { globalData, mapCountries, loading, fetchGlobal };
}
