// Design tokens for the global map (dark financial theme)
export const MAP_TOKENS = {
  bg: '#07111f',
  card: '#0b1728',
  border: 'rgba(148,163,184,0.16)',
  primary: '#2563eb',
  primarySoft: '#60a5fa',
  text: '#e5eefc',
  textMuted: '#8fa7c4',
  glow: '0 0 24px rgba(37,99,235,0.22)',
  countryDefault: '#0f1d32',
  countryHover: '#1a2d4a',
  countryStroke: 'rgba(148,163,184,0.12)',
  ocean: '#07111f',
} as const;

/**
 * Returns a fill color for a country based on its leading candidate's probability.
 * Higher probability = stronger blue glow.
 * No data = dark default.
 */
export function getCountryColor(probability: number, status: string): string {
  if (status === 'upcoming' || !probability || Number.isNaN(probability)) return '#121f36';
  if (probability < 25) return '#132044';
  if (probability < 40) return '#1a2f5c';
  if (probability < 55) return '#1e3a7a';
  if (probability < 70) return '#2150a8';
  if (probability < 85) return '#2563eb';
  return '#3b82f6';
}

/**
 * Returns opacity for country fill based on volume.
 * Higher volume = higher confidence = more opaque.
 */
export function getCountryOpacity(volumeUsd: number): number {
  if (!volumeUsd || Number.isNaN(volumeUsd)) return 0.4;
  if (volumeUsd < 100_000) return 0.6;
  if (volumeUsd < 500_000) return 0.75;
  if (volumeUsd < 1_000_000) return 0.85;
  return 1;
}

/**
 * Format volume for display: $1.2M, $500K, etc.
 */
export function formatVolume(usd: number, locale?: string): string {
  if (!usd || Number.isNaN(usd) || usd <= 0) return '—';
  // Separador decimal por idioma. Sem o parametro, a funcao devolvia `$1.2M`
  // nos tres idiomas, contra a regua que pede virgula em pt-BR e es. O `locale`
  // e opcional para nao quebrar chamador antigo, e a ausencia dele cai em pt-BR.
  const dec = (n: number, casas: number) => {
    const s = n.toFixed(casas);
    return locale === 'en' ? s : s.replace('.', ',');
  };
  if (usd >= 1_000_000_000) return `$${dec(usd / 1_000_000_000, 2)}B`;
  if (usd >= 1_000_000) return `$${dec(usd / 1_000_000, 1)}M`;
  if (usd >= 1_000) return `$${dec(usd / 1_000, 0)}K`;
  return `$${Math.round(usd)}`;
}
