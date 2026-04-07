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
    const fetchData = async () => {
      try {
        const [p, pl, n, a, cr] = await Promise.all([
          fetch('/api/polymarket').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/polls').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/news').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/analysis-cards').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/analysis-criteriosa').then(r => r.ok ? r.json() : null).catch(() => null),
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
  const [loading, setLoading] = useState(false);

  const fetchGlobal = () => {
    if (globalData) return;
    setLoading(true);
    fetch('/api/global-elections')
      .then(r => r.ok ? r.json() : null)
      .then(data => setGlobalData(data))
      .catch(err => console.error('[Global] Fetch error:', err))
      .finally(() => setLoading(false));
  };

  return { globalData, loading, fetchGlobal };
}
