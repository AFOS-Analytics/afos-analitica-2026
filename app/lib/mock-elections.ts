import type { CountryMarketSummary } from '../types/global-map';

export const MOCK_ELECTIONS: CountryMarketSummary[] = [
  {
    iso3: 'BRA', countryName: 'Brazil', flag: '🇧🇷',
    probability: 42, volumeUsd: 5_200_000, status: 'live',
    electionDate: '2026-10-04', electionType: 'Presidential',
    leadCandidate: 'Lula',
    candidates: [
      { name: 'Lula', probability: 42, volumeUsd: 2_100_000 },
      { name: 'Flávio Bolsonaro', probability: 37, volumeUsd: 1_800_000 },
      { name: 'Renan Santos', probability: 6.75, volumeUsd: 400_000 },
      { name: 'Fernando Haddad', probability: 6, volumeUsd: 350_000 },
      { name: 'Ronaldo Caiado', probability: 2, volumeUsd: 150_000 },
    ],
  },
  {
    iso3: 'USA', countryName: 'United States', flag: '🇺🇸',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2026-11-03', electionType: 'Midterm Elections',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'FRA', countryName: 'France', flag: '🇫🇷',
    probability: 38, volumeUsd: 1_800_000, status: 'live',
    electionDate: '2027-04-10', electionType: 'Presidential',
    leadCandidate: 'Jordan Bardella',
    candidates: [
      { name: 'Jordan Bardella', probability: 38, volumeUsd: 700_000 },
      { name: 'Emmanuel Macron', probability: 0, volumeUsd: 50_000 },
      { name: 'Édouard Philippe', probability: 22, volumeUsd: 400_000 },
      { name: 'Marine Le Pen', probability: 15, volumeUsd: 300_000 },
    ],
  },
  {
    iso3: 'DEU', countryName: 'Germany', flag: '🇩🇪',
    probability: 52, volumeUsd: 900_000, status: 'live',
    electionDate: '2025-02-23', electionType: 'Federal Election',
    leadCandidate: 'Friedrich Merz',
    candidates: [
      { name: 'Friedrich Merz', probability: 52, volumeUsd: 450_000 },
      { name: 'Alice Weidel', probability: 25, volumeUsd: 250_000 },
      { name: 'Olaf Scholz', probability: 8, volumeUsd: 100_000 },
    ],
  },
  {
    iso3: 'GBR', countryName: 'United Kingdom', flag: '🇬🇧',
    probability: 65, volumeUsd: 2_100_000, status: 'live',
    electionDate: '2029-01-01', electionType: 'General Election',
    leadCandidate: 'Reform UK',
    candidates: [
      { name: 'Reform UK', probability: 65, volumeUsd: 1_200_000 },
      { name: 'Conservative', probability: 18, volumeUsd: 500_000 },
      { name: 'Labour', probability: 12, volumeUsd: 300_000 },
    ],
  },
  {
    iso3: 'KOR', countryName: 'South Korea', flag: '🇰🇷',
    probability: 45, volumeUsd: 600_000, status: 'live',
    electionDate: '2027-03-09', electionType: 'Presidential',
    leadCandidate: 'Lee Jae-myung',
    candidates: [
      { name: 'Lee Jae-myung', probability: 45, volumeUsd: 300_000 },
      { name: 'Han Dong-hoon', probability: 30, volumeUsd: 200_000 },
    ],
  },
  {
    iso3: 'CAN', countryName: 'Canada', flag: '🇨🇦',
    probability: 58, volumeUsd: 1_500_000, status: 'live',
    electionDate: '2025-04-28', electionType: 'Federal Election',
    leadCandidate: 'Mark Carney',
    candidates: [
      { name: 'Mark Carney', probability: 58, volumeUsd: 800_000 },
      { name: 'Pierre Poilievre', probability: 38, volumeUsd: 600_000 },
    ],
  },
  {
    iso3: 'AUS', countryName: 'Australia', flag: '🇦🇺',
    probability: 72, volumeUsd: 800_000, status: 'live',
    electionDate: '2025-05-03', electionType: 'Federal Election',
    leadCandidate: 'Anthony Albanese',
    candidates: [
      { name: 'Anthony Albanese', probability: 72, volumeUsd: 500_000 },
      { name: 'Peter Dutton', probability: 25, volumeUsd: 250_000 },
    ],
  },
  {
    iso3: 'COL', countryName: 'Colombia', flag: '🇨🇴',
    probability: 35, volumeUsd: 300_000, status: 'live',
    electionDate: '2026-05-31', electionType: 'Presidential',
    leadCandidate: 'Sergio Fajardo',
    candidates: [
      { name: 'Sergio Fajardo', probability: 35, volumeUsd: 120_000 },
      { name: 'María Fernanda Cabal', probability: 28, volumeUsd: 100_000 },
    ],
  },
  {
    iso3: 'CHL', countryName: 'Chile', flag: '🇨🇱',
    probability: 41, volumeUsd: 250_000, status: 'live',
    electionDate: '2025-11-16', electionType: 'Presidential',
    leadCandidate: 'Evelyn Matthei',
    candidates: [
      { name: 'Evelyn Matthei', probability: 41, volumeUsd: 100_000 },
      { name: 'Michelle Bachelet', probability: 30, volumeUsd: 80_000 },
    ],
  },
  {
    iso3: 'IND', countryName: 'India', flag: '🇮🇳',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2029-04-01', electionType: 'General Election',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'MEX', countryName: 'Mexico', flag: '🇲🇽',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2030-06-01', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'NGA', countryName: 'Nigeria', flag: '🇳🇬',
    probability: 0, volumeUsd: 0, status: 'upcoming',
    electionDate: '2027-02-25', electionType: 'Presidential',
    leadCandidate: '—',
    candidates: [],
  },
  {
    iso3: 'PHL', countryName: 'Philippines', flag: '🇵🇭',
    probability: 33, volumeUsd: 400_000, status: 'live',
    electionDate: '2025-05-12', electionType: 'Midterm Elections',
    leadCandidate: 'Sara Duterte',
    candidates: [
      { name: 'Sara Duterte', probability: 33, volumeUsd: 150_000 },
      { name: 'Imee Marcos', probability: 25, volumeUsd: 100_000 },
    ],
  },
];
