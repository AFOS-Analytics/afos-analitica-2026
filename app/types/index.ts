export interface Market {
  question: string;
  outcomePrices: (number | string)[];
  outcomes: string[];
  volumeNum: number;
  active: boolean;
  closed: boolean;
}

export interface PolyEvent {
  title: string;
  slug: string;
  markets: Market[];
}

export interface PolyData {
  presidential: PolyEvent | null;
  secondPlace: PolyEvent | null;
  thirdPlace: PolyEvent | null;
  stf: PolyEvent | null;
  senate: PolyEvent | null;
  inflation: PolyEvent | null;
  fetchedAt: string;
}

export interface PollResult { candidate: string; percent: number }
export interface Scenario { name: string; results: PollResult[] }
export interface SecondRound { matchup: string; candidate1: string; percent1: number; candidate2: string; percent2: number }

export interface Poll {
  institute: string; date: string; sample: number | null; margin: number | null;
  register: string | null; reliability: number; method?: string;
  scenarios: Scenario[]; secondRound: SecondRound[];
  fieldDates?: string; note?: string;
}

export interface Institute { name: string; reliability: number; type: string; note: string; }

export interface PolyComparison {
  note: string;
  sources?: string;
  candidates: { name: string; pesquisaRange: string; polymarket: string; tendenciaPesquisa: string; tendenciaPolymarket: string; }[];
}

export interface PollData { lastUpdate: string; polls: Poll[]; institutes?: Institute[]; polymarketComparison?: PolyComparison; }

export interface NewsItem { title: string; source: string; url: string; time: string; category: string; summary?: string; }
export interface NewsData { updatedAt: string; totalNews: number; grouped: Record<string, NewsItem[]>; firecrawlActive: boolean; all: NewsItem[]; }

export interface AnalysisSection {
  text1?: string; text2?: string; text3?: string; text4?: string;
  direita?: string; esquerda?: string; terceiraVia?: string; polymarket?: string;
  impactoLula?: string; impactoGestao?: string; conclusao?: string;
  toffoli?: string; moraes?: string; gilmar?: string; dino?: string; nexo?: string; analise?: string;
}

export interface AnalysisData {
  updatedAt: string;
  cards: { sentimento?: AnalysisSection; inss?: AnalysisSection; bancoMaster?: AnalysisSection; stf?: AnalysisSection; };
}

export interface GlobalElection {
  country: string; flag: string; date: string; type: string; lat: number; lng: number;
  polymarket?: { title: string; volume: number; markets: { question: string; yesPrice: number; volume: number; }[]; } | null;
}

export interface GlobalData { elections: GlobalElection[]; updatedAt: string; }

export interface CritCandidate {
  rank: string; name: string; party: string; color: string; header: string; subtitle?: string;
  fortes: string[]; fracos: string[]; analise: string;
  caiado?: { label: string; fortes: string; fracos: string };
  haddad?: { label: string; fortes: string; fracos: string };
}

export interface QuadroRow { n: string; p: string; m: string; t: string; s: string; pc: string; mc: string; }

export interface CritData { updatedAt: string; subtitle: string; candidates: CritCandidate[]; quadroComparativo: QuadroRow[]; cruzamento: string; }

// Candidate profile for the candidates grid
export interface CandidateProfile {
  name: string;
  party: string;
  age: number;
  role: string;
  polymarket: string;
  poll: string;
  position: string;
  risk: string;
}
