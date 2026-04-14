import type { CountryMarketSummary } from '../types/global-map';

/**
 * Mock elections — usado SOMENTE como fallback visual quando /api/global-map falha.
 * Dados NÃO representam odds reais. São placeholder para manter o mapa visualmente útil.
 * Quando a API retorna dados reais, eles SUBSTITUEM o mock para aquele país.
 */
export const MOCK_ELECTIONS: CountryMarketSummary[] = [
  {
    iso3: 'BRA', countryName: 'Brazil', flag: 'br',
    probability: 40, volumeUsd: 5_200_000, status: 'live',
    electionDate: '2026-10-04', electionType: 'Presidential',
    leadCandidate: 'Loading...',
    candidates: [],
  },
  {
    iso3: 'USA', countryName: 'United States', flag: 'us',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2028-11-03', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'COL', countryName: 'Colombia', flag: 'co',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-06-21', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'RUS', countryName: 'Russia', flag: 'ru',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-09-20', electionType: 'Parliamentary',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'HUN', countryName: 'Hungary', flag: 'hu',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-04-01', electionType: 'Prime Minister',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'FRA', countryName: 'France', flag: 'fr',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2027-04-10', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'GBR', countryName: 'United Kingdom', flag: 'gb',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2029-01-01', electionType: 'General Election',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'AUS', countryName: 'Australia', flag: 'au',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-05-09', electionType: 'By-Election',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'CHL', countryName: 'Chile', flag: 'cl',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2025-11-16', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
];
