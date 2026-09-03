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
  /** Escopo da pesquisa. Campo de DADO, nunca vai à tela e nunca se traduz. */
  scope?: 'national' | 'state';
}

export interface Institute { name: string; reliability: number; type: string; note: string; }

export interface PolyComparison {
  note: string;
  sources?: string;
  candidates: { name: string; pesquisaRange: string; polymarket: string; tendenciaPesquisa: string; tendenciaPolymarket: string; }[];
}

export interface PollData { lastUpdate: string; polls: Poll[]; institutes?: Institute[]; polymarketComparison?: PolyComparison; }

export interface NewsItem { title: string; source: string; url: string; time: string; /** Instante ISO 8601 do item. O painel formata no idioma dele; `time` e legado ja formatado em pt-BR. */ timeIso?: string; category: string; summary?: string; }
export interface NewsData { updatedAt: string; totalNews: number; grouped: Record<string, NewsItem[]>; firecrawlActive: boolean; all: NewsItem[]; }

export interface AnalysisSection {
  text1?: string; text2?: string; text3?: string; text4?: string;
  direita?: string; esquerda?: string; terceiraVia?: string; polymarket?: string;
  impactoLula?: string; impactoGestao?: string; conclusao?: string;
  toffoli?: string; moraes?: string; gilmar?: string; dino?: string; mendonca?: string; nexo?: string; analise?: string;
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

/**
 * Sub-bloco do card do pelotão de trás: um nome, com rótulo e um parágrafo de
 * cada lado. Diferente de `CritCandidate.fortes`/`.fracos`, que são arrays.
 */
export interface CritSubBloco { label: string; fortes: string; fracos: string }

export interface CritCandidate {
  rank: string; name: string; party: string; color: string; header: string; subtitle?: string;
  fortes: string[]; fracos: string[]; analise: string;
  // 🔴 `zema` faltava aqui até 03/Set/2026, e essa ausência era a RAIZ do defeito:
  // sem a chave no tipo, `c.zema` no JSX é erro de compilação, então o componente
  // montava só os dois declarados. O bloco existia no JSON, era reescrito pela
  // rodada todo dia e traduzido para os três idiomas, e nunca chegava à tela.
  // O card se chama "Caiado / Haddad / Zema": quem entra no nome entra no tipo.
  caiado?: CritSubBloco;
  haddad?: CritSubBloco;
  zema?: CritSubBloco;
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
