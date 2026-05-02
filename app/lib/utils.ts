import type { PolyEvent, Market } from '../types';

export const partyColor: Record<string, string> = {
  PT: '#DC2626', PL: '#0F52BA', PSD: '#6B7280', Novo: '#F59E0B',
  Missão: '#8B5CF6', Rep: '#059669', Republicanos: '#059669',
};

export function getParty(candidate: string): string {
  const m = candidate.match(/\(([^)]+)\)/);
  return m ? m[1] : '';
}

export function getColor(candidate: string): string {
  const p = getParty(candidate);
  return partyColor[p] || '#94A3B8';
}

export function extractCandidateName(question: string): string {
  const q = question || '';
  const inflMatch = q.match(/less than (\d+\.\d+%)/);
  if (inflMatch) return `< ${inflMatch[1]}`;
  const inflRange = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/);
  if (inflRange) return `${inflRange[1]} - ${inflRange[2]}`;
  const inflAbove = q.match(/at least (\d+\.\d+%)/);
  if (inflAbove) return `≥ ${inflAbove[1]}`;
  const partyMatch = q.match(/Will (.+?) \((\w+)\) win the most seats/);
  if (partyMatch) return partyMatch[2];
  if (q.match(/STF|Justice.*removed.*impeachment/i)) return 'Impeachment de Ministro do STF';
  const candMatch = q.match(/Will (.+?) (?:win|finish)/);
  if (candMatch) {
    const name = candMatch[1];
    if (name.includes('Carlos Roberto Massa')) return 'Ratinho Jr.';
    if (name.includes('Luiz Inácio Lula da Silva')) return 'Lula';
    return name;
  }
  return q.slice(0, 50);
}
