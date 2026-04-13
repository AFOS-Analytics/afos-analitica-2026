import type { CountryMarketSummary } from '../types/global-map';

/**
 * Mock elections — usado SOMENTE como fallback visual quando /api/global-map falha.
 * Dados NÃO representam odds reais. São placeholder para manter o mapa visualmente útil.
 * Quando a API retorna dados reais, eles SUBSTITUEM o mock para aquele país.
 */
export const MOCK_ELECTIONS: CountryMarketSummary[] = [
  {
    iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷',
    probability: 40, volumeUsd: 5_200_000, status: 'live',
    electionDate: '2026-10-04', electionType: 'Presidential',
    leadCandidate: 'Loading...',
    candidates: [],
  },
  {
    iso3: 'USA', countryName: 'United States', flag: '🇺🇸',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2028-11-03', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'COL', countryName: 'Colombia', flag: '🇨🇴',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-06-21', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'RUS', countryName: 'Russia', flag: '🇷🇺',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-09-20', electionType: 'Parliamentary',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'HUN', countryName: 'Hungary', flag: '🇭🇺',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-04-01', electionType: 'Prime Minister',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'FRA', countryName: 'France', flag: '🇫🇷',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2027-04-10', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'GBR', countryName: 'United Kingdom', flag: '🇬🇧',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2029-01-01', electionType: 'General Election',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'AUS', countryName: 'Australia', flag: '🇦🇺',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-05-09', electionType: 'By-Election',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'CHL', countryName: 'Chile', flag: '🇨🇱',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2025-11-16', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
];
