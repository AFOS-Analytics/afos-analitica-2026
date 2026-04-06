'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Card, HBar, Stars } from './components/ui';

// ─── Types ───────────────────────────────────────────────────────────
interface Market {
  question: string;
  outcomePrices: (number | string)[];
  outcomes: string[];
  volumeNum: number;
  active: boolean;
  closed: boolean;
}
interface PolyEvent {
  title: string;
  slug: string;
  markets: Market[];
}
interface PolyData {
  presidential: PolyEvent | null;
  secondPlace: PolyEvent | null;
  thirdPlace: PolyEvent | null;
  stf: PolyEvent | null;
  senate: PolyEvent | null;
  inflation: PolyEvent | null;
  fetchedAt: string;
}
interface PollResult { candidate: string; percent: number }
interface Scenario { name: string; results: PollResult[] }
interface SecondRound { matchup: string; candidate1: string; percent1: number; candidate2: string; percent2: number }
interface Poll {
  institute: string; date: string; sample: number; margin: number;
  register: string; reliability: number; method?: string;
  scenarios: Scenario[]; secondRound: SecondRound[];
}
interface Institute { name: string; reliability: number; type: string; note: string; }
interface PolyComparison { note: string; candidates: { name: string; pesquisaRange: string; polymarket: string; tendenciaPesquisa: string; tendenciaPolymarket: string; }[]; }
interface PollData { lastUpdate: string; polls: Poll[]; institutes?: Institute[]; polymarketComparison?: PolyComparison; }

interface NewsItem { title: string; source: string; url: string; time: string; category: string; summary?: string; }
interface NewsData { updatedAt: string; totalNews: number; grouped: Record<string, NewsItem[]>; firecrawlActive: boolean; all: NewsItem[]; }

interface AnalysisSection { text1?: string; text2?: string; text3?: string; text4?: string; direita?: string; esquerda?: string; terceiraVia?: string; polymarket?: string; impactoLula?: string; impactoGestao?: string; conclusao?: string; toffoli?: string; moraes?: string; gilmar?: string; dino?: string; nexo?: string; analise?: string; }
interface AnalysisData { updatedAt: string; cards: { sentimento?: AnalysisSection; inss?: AnalysisSection; bancoMaster?: AnalysisSection; stf?: AnalysisSection; }; }

interface GlobalElection { country: string; flag: string; date: string; type: string; lat: number; lng: number; polymarket?: { title: string; volume: number; markets: { question: string; yesPrice: number; volume: number; }[]; } | null; }
interface GlobalData { elections: GlobalElection[]; updatedAt: string; }

interface CritCandidate { rank: string; name: string; party: string; color: string; header: string; subtitle?: string; fortes: string[]; fracos: string[]; analise: string; caiado?: { label: string; fortes: string; fracos: string }; haddad?: { label: string; fortes: string; fracos: string }; }
interface QuadroRow { n: string; p: string; m: string; t: string; s: string; pc: string; mc: string; }
interface CritData { updatedAt: string; subtitle: string; candidates: CritCandidate[]; quadroComparativo: QuadroRow[]; cruzamento: string; }

// ─── Party Colors ────────────────────────────────────────────────────
const partyColor: Record<string, string> = {
  PT: '#DC2626', PL: '#0F52BA', PSD: '#6B7280', Novo: '#F59E0B',
  Missão: '#8B5CF6', Rep: '#059669', Republicanos: '#059669',
};

function getParty(candidate: string): string {
  const m = candidate.match(/\(([^)]+)\)/);
  return m ? m[1] : '';
}

function getColor(candidate: string): string {
  const p = getParty(candidate);
  return partyColor[p] || '#94A3B8';
}

// ─── Candidate Photos (local files in /public/fotos/) ────────────────
const PHOTOS: Record<string, string> = {
  'Flávio Bolsonaro': '/fotos/flavio.jpg',
  'Lula': '/fotos/lula.svg',
  'Luiz Inácio Lula da Silva': '/fotos/lula.svg',
  'Fernando Haddad': '/fotos/haddad.svg',
  'Tarcísio de Freitas': '/fotos/tarcisio.svg',
  'Tarcisio de Freitas': '/fotos/tarcisio.svg',
  'Ronaldo Caiado': '/fotos/caiado.jpg',
  'Romeu Zema': '/fotos/zema.svg',
  'Renan Santos': '/fotos/renan.svg',
  'Jair Bolsonaro': '/fotos/jair.svg',
  'Michelle Bolsonaro': '/fotos/michelle.svg',
  'Eduardo Bolsonaro': '/fotos/eduardo.jpg',
  'Ratinho Jr.': '/fotos/ratinho.svg',
  'Camilo Santana': '/fotos/camilo.svg',
};

function getPhoto(name: string): string | null {
  return PHOTOS[name] || null;
}

// ─── Candidates ──────────────────────────────────────────────────────
const candidates = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "41.5%", poll: "19-47.6%", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "Desaprovação 61% PoderData. Rejeição 56% Quaest. AtlasIntel 2T ATRÁS de Flávio (46.6% vs 47.6%). PF Lulinha R$300K/mês. Gap 3.35pp. BBC: contra-ataque bilionário + isenção IR." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.15%", poll: "30-56%", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "Atlas 2T à frente 1ª vez (47.6% vs 46.6%). PEC fim reeleição = aceno centrão (Folha). PL Senado 77.5%. Nordeste 'já não é garantido para Lula' (Gazeta)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "6.75%", poll: "1-4.4%", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "Subiu 0.55pp. AtlasIntel (02/Abr): 4.4%. Partido pequeno. Força real menor que digital." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Ministro da Fazenda", polymarket: "5.75%", poll: "21-38% (sem Lula)", position: "Centro-esquerda. Plano B do PT se Lula não concorrer. Gestor técnico.", risk: "RECUPEROU (+1.45pp). Mercado reavalia plano B. Candidacy rejection Lula 66% contamina alternativa PT." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Governador de Goiás", polymarket: "2.4%", poll: "3-5%", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "CAIU 0.6pp. Foca em SP, busca 'voto envergonhado' (JOTA). Quaest: Flávio lidera independentes 32% — 3ª via comprimida." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Governador de Minas Gerais", polymarket: "1.8%", poll: "3-6%", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "Partido sem estrutura nacional. Condiciona candidatos Senado a voto pró-impeachment STF." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.45%", poll: "33% (cenário solo)", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "Descartado pelo mercado. PEC Flávio sobre fim reeleição pode ser aceno (Folha)." },
];

// ─── UI Components imported from ./components/ui ────────────────────

// ─── Main Dashboard ──────────────────────────────────────────────────
export default function Dashboard() {
  const [poly, setPoly] = useState<PolyData | null>(null);
  const [polls, setPolls] = useState<PollData | null>(null);
  const [news, setNews] = useState<NewsData | null>(null);
  const [ac, setAc] = useState<AnalysisData | null>(null);
  const [crit, setCrit] = useState<CritData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMetas, setShowMetas] = useState(false);
  const [showSobre, setShowSobre] = useState(false);
  const [showGlobal, setShowGlobal] = useState(false);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [expandedElection, setExpandedElection] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/polymarket').then(r => r.json()).catch(() => null),
      fetch('/api/polls').then(r => r.json()).catch(() => null),
      fetch('/api/news').then(r => r.json()).catch(() => null),
      fetch('/api/analysis-cards').then(r => r.json()).catch(() => null),
      fetch('/api/analysis-criteriosa').then(r => r.json()).catch(() => null),
    ]).then(([p, pl, n, a, cr]) => {
      setPoly(p);
      setPolls(pl);
      setNews(n);
      setAc(a);
      setCrit(cr);
      setLoading(false);
    });
  }, []);

  function extractCandidateName(question: string): string {
    // "Will Flávio Bolsonaro win the 2026 Brazilian presidential election?" → "Flávio Bolsonaro"
    // "Will Renan Santos finish in second place..." → "Renan Santos"
    // "Any Brazil STF Justice removed by impeachment before 2027?" → "Impeachment STF"
    // "Will Brazil's Annual Inflation in 2026 be between 4.00% and 4.49%?" → "4.00% - 4.49%"
    // "Will Partido Social Democrático (PSD) win the most seats..." → "PSD"
    const q = question || '';
    
    // Inflation
    const inflMatch = q.match(/less than (\d+\.\d+%)/);
    if (inflMatch) return `< ${inflMatch[1]}`;
    const inflRange = q.match(/between (\d+\.\d+%) and (\d+\.\d+%)/);
    if (inflRange) return `${inflRange[1]} - ${inflRange[2]}`;
    const inflAbove = q.match(/at least (\d+\.\d+%)/);
    if (inflAbove) return `≥ ${inflAbove[1]}`;
    
    // Senate parties
    const partyMatch = q.match(/Will (.+?) \((\w+)\) win the most seats/);
    if (partyMatch) return partyMatch[2];
    
    // STF
    if (q.match(/STF|Justice.*removed.*impeachment/i)) return 'Impeachment de Ministro do STF';
    
    // Presidential / 1st round
    const candMatch = q.match(/Will (.+?) (?:win|finish)/);
    if (candMatch) {
      let name = candMatch[1];
      // Clean up "Carlos Roberto Massa Júnior" → "Ratinho Jr"
      if (name.includes('Carlos Roberto Massa')) return 'Ratinho Jr.';
      if (name.includes('Luiz Inácio Lula da Silva')) return 'Lula';
      return name;
    }
    
    return q.slice(0, 50);
  }

  function renderMarkets(event: PolyEvent | null | undefined, title: string, topN?: number) {
    if (!event || !event.markets?.length) return (
      <Card className="mb-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">Dados indisponíveis no momento.</p>
      </Card>
    );

    const items: { name: string; odds: number; vol: number }[] = [];
    event.markets.forEach(m => {
      if (m.closed) return;
      const yesPrice = Array.isArray(m.outcomePrices) ? Number(m.outcomePrices[0]) : 0;
      if (yesPrice > 0.005) {
        const name = extractCandidateName(m.question);
        items.push({ name, odds: yesPrice * 100, vol: m.volumeNum || 0 });
      }
    });
    items.sort((a, b) => b.odds - a.odds);
    const display = topN ? items.slice(0, topN) : items;
    const maxOdds = display.length > 0 ? Math.max(...display.map(d => d.odds)) : 100;
    const totalVol = event.markets.reduce((s, m) => s + (m.volumeNum || 0), 0);

    return (
      <Card className="mb-4">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-[#1a1a1a]">{title}</h3>
          {totalVol > 0 && <span className="text-xs text-gray-500">Volume: ${(totalVol / 1e6).toFixed(2)}M</span>}
        </div>
        {display.map((item, i) => (
          <HBar
            key={item.name + i}
            value={item.odds}
            max={maxOdds * 1.1}
            color={i < 2 ? '#0F52BA' : '#94A3B8'}
            label={item.name}
          />
        ))}
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F52BA] mx-auto mb-4" />
          <p className="text-[#0F52BA] font-semibold">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // polls now rendered in a loop — no single poll reference needed

  return (
    <div className="min-h-screen bg-white">
      {/* SKIP NAV */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[#0F52BA] focus:text-white focus:px-4 focus:py-2 focus:rounded">Pular para conteúdo principal</a>

      {/* HEADER */}
      <header className="bg-[#0F52BA] text-white py-6 px-4 md:px-8" role="banner">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">AFOS Analytics</h1>
              <p className="text-blue-200 mt-1 text-sm md:text-base">Plataforma Mundial de Inteligência em Cruzamentos de Risco Político Eleitoral</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button onClick={() => setShowSobre(true)} aria-label="Abrir informações sobre o AFOS Analytics" className="border border-white/30 hover:bg-white/10 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200">
                Sobre
              </button>
              <button onClick={() => setShowMetas(true)} aria-label="Abrir metas do AFOS Analytics" className="border border-white/30 hover:bg-white/10 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200">
                Metas
              </button>
              <button onClick={() => { setShowGlobal(true); if (!globalData) fetch('/api/global-elections').then(r=>r.json()).then(setGlobalData).catch(()=>{}); }} className="border border-white/30 hover:bg-white/10 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200">
                Global
              </button>
            </div>
          </div>
          <p className="text-blue-300 text-xs mt-2">
            Atualizado: {poly?.fetchedAt ? new Date(poly.fetchedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </header>

      {/* MODAL SOBRE */}
      {showSobre && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-label="Sobre o AFOS Analytics" onClick={() => setShowSobre(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#0F52BA] text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Sobre — AFOS Analytics</h2>
              <button onClick={() => setShowSobre(false)} className="text-white/70 hover:text-white text-2xl leading-none" aria-label="Fechar">✕</button>
            </div>
            <div className="p-6 sm:p-8 space-y-6 text-sm text-[#1a1a1a] leading-relaxed max-h-[75vh] overflow-y-auto">

              <div>
                <h3 className="font-bold text-lg text-[#0F52BA] mb-2">Quem Somos</h3>
                <p className="mb-2">O <strong>AFOS-Analytics</strong> é uma plataforma global de <strong>inteligência eleitoral em tempo real</strong>.</p>
                <p className="mb-2">Monitoramos eleições no mundo inteiro e transformamos dados complexos em informação clara, objetiva e acionável.</p>
                <p className="mb-2">Fazemos isso combinando, em um único ambiente:</p>
                <ul className="text-xs space-y-1.5 text-gray-700 ml-4">
                  <li>• mercados internacionais de previsão com dinheiro real (como Polymarket)</li>
                  <li>• pesquisas de opinião eleitoral tradicionais</li>
                  <li>• notícias da grande imprensa</li>
                  <li>• sinais e sentimento das redes sociais</li>
                  <li>• análises estratégicas geradas com inteligência artificial</li>
                </ul>
                <p className="mt-3 text-xs text-gray-600">Tudo integrado em um painel simples, acessível e atualizado continuamente — no celular ou no computador.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">Para que serve</h3>
                <p className="mb-3 text-xs italic text-gray-600">O AFOS-Analytics existe para responder uma pergunta simples:</p>
                <blockquote className="border-l-4 border-[#0F52BA] pl-4 mb-3 text-sm font-semibold text-[#0F52BA]">O que realmente está acontecendo na eleição?</blockquote>
                <p className="mb-2 text-xs text-gray-600">Com ele, você consegue:</p>
                <ul className="text-xs space-y-1.5 text-gray-700 ml-4">
                  <li>• acompanhar a corrida eleitoral em tempo real — quem lidera, quem cresce, quem perde força</li>
                  <li>• ver onde o dinheiro está posicionado — não apenas opinião, mas apostas reais</li>
                  <li>• comparar pesquisas vs mercado — o que as pessoas dizem vs o que o mundo aposta</li>
                  <li>• monitorar eventos e escândalos — e seu impacto direto na eleição</li>
                  <li>• entender o sentimento popular — nas redes e na mídia</li>
                  <li>• tomar decisões mais informadas, com base em dados</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-3">Como usar</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <h4 className="font-bold text-sm text-[#0F52BA] mb-2">Se você é ELEITOR</h4>
                    <ul className="text-xs space-y-1.5 text-gray-700">
                      <li>• veja todos os candidatos em um só lugar</li>
                      <li>• compare pesquisas tradicionais com mercados de previsão</li>
                      <li>• entenda forças, fraquezas e contexto de cada candidato</li>
                      <li>• acompanhe eventos relevantes e decida com mais clareza</li>
                    </ul>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <h4 className="font-bold text-sm text-[#0F52BA] mb-2">Se você é INVESTIDOR / EMPRESÁRIO</h4>
                    <ul className="text-xs space-y-1.5 text-gray-700">
                      <li>• antecipe cenários políticos que impactam o mercado</li>
                      <li>• use mercados de previsão como indicador antecipado</li>
                      <li>• entenda como crises e eventos influenciam resultados eleitorais</li>
                      <li>• acompanhe sinais econômicos precificados pelo mercado</li>
                    </ul>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <h4 className="font-bold text-sm text-[#0F52BA] mb-2">Se você é ANALISTA / JORNALISTA</h4>
                    <ul className="text-xs space-y-1.5 text-gray-700">
                      <li>• acesse dados consolidados de múltiplas fontes</li>
                      <li>• acompanhe notícias em tempo real</li>
                      <li>• utilize um cruzamento único: pesquisas × mercados × narrativa</li>
                      <li>• produza análises com mais profundidade e precisão</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">Atualizações em tempo real</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-xs">
                    <span className="font-bold text-[#0F52BA]">Mercados de previsão</span> — atualizados continuamente
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-xs">
                    <span className="font-bold text-[#0F52BA]">Notícias</span> — atualização constante de múltiplas fontes
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-xs">
                    <span className="font-bold text-[#0F52BA]">Análises</span> — recalculadas automaticamente com novos dados
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-xs">
                    <span className="font-bold text-[#0F52BA]">Pesquisas</span> — atualizadas sempre que novos dados são publicados
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">O que você encontra no dashboard</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                  <div className="bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]"><strong>Odds de mercados de previsão</strong> (dinheiro real)</div>
                  <div className="bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]"><strong>Pesquisas eleitorais</strong> de múltiplos institutos</div>
                  <div className="bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]"><strong>Análises estratégicas</strong> — forças e fraquezas dos candidatos</div>
                  <div className="bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]"><strong>Perfil dos candidatos</strong> — visão completa</div>
                  <div className="bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]"><strong>Notícias ao vivo</strong> — organizadas por relevância</div>
                  <div className="bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]"><strong>Sentimento popular</strong> — redes sociais e opinião pública</div>
                </div>
              </div>

              <div className="bg-[#0F52BA]/5 border border-[#0F52BA]/20 rounded-lg p-4">
                <h3 className="font-bold text-[#0F52BA] mb-2">Diferencial</h3>
                <p className="text-xs mb-2">O AFOS-Analytics é uma plataforma única que conecta, no mesmo lugar:</p>
                <ul className="text-xs space-y-1 text-gray-700 ml-4">
                  <li>• o que as pessoas dizem (pesquisas)</li>
                  <li>• o que o mercado acredita (apostas reais)</li>
                  <li>• o que está sendo narrado (mídia)</li>
                  <li>• o que está sendo sentido (redes sociais)</li>
                </ul>
                <p className="text-xs mt-3">Isso permite enxergar a eleição por múltiplas perspectivas — e não depender de uma única fonte.</p>
              </div>

              <div className="bg-gradient-to-br from-[#0F52BA]/10 to-[#0F52BA]/5 border border-[#0F52BA]/20 rounded-xl p-5">
                <h3 className="font-bold text-[#0F52BA] text-lg mb-2 text-center">GLOBAL POR DESIGN</h3>
                <p className="text-xs text-gray-600 mb-3 text-center">Começamos com validação prática, mas o objetivo é maior:</p>
                <blockquote className="border-l-4 border-[#0F52BA] pl-4 mb-4 text-xs font-semibold text-[#0F52BA]">Acompanhar eleições no mundo inteiro e criar uma nova forma de entender risco político em escala global</blockquote>
                <p className="text-xs text-gray-700 mb-2">Não é só uma eleição. É um sistema feito para:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-xs font-semibold text-[#1a1a1a]">Brasil</div>
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-xs font-semibold text-[#1a1a1a]">Estados Unidos</div>
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-xs font-semibold text-[#1a1a1a]">Europa</div>
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-xs font-semibold text-[#1a1a1a]">Qualquer país</div>
                </div>
                <p className="text-xs text-gray-600 text-center italic">Onde houver eleição, existe sinal. Onde existe sinal, o AFOS-Analytics lê.</p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="font-bold text-[#0F52BA] mb-2">Open Source</h3>
                <p className="text-xs mb-2">O AFOS-Analytics é um projeto de <strong>código aberto</strong>.</p>
                <p className="text-xs mb-2">Acreditamos que:</p>
                <ul className="text-xs space-y-1 text-gray-700 ml-4">
                  <li>• informação deve ser transparente</li>
                  <li>• dados devem ser verificáveis</li>
                  <li>• inteligência deve ser acessível</li>
                </ul>
                <p className="text-xs mt-2 text-gray-600">Qualquer pessoa pode estudar, auditar e contribuir.</p>
              </div>

              <div className="bg-gradient-to-br from-[#0F52BA]/10 to-[#0F52BA]/5 border border-[#0F52BA]/20 rounded-xl p-5 text-center">
                <h3 className="font-bold text-[#0F52BA] text-lg mb-3">O que significa AFOS</h3>
                <p className="text-xs text-gray-600 mb-4">AFOS é mais do que um nome — é o que guia tudo o que fazemos:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-[#0F52BA] text-lg">A</div>
                    <div className="text-xs text-gray-700 font-semibold">Astuteness</div>
                    <div className="text-[10px] text-gray-500 mt-1">Inteligência para cruzar dados e gerar clareza</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-[#0F52BA] text-lg">F</div>
                    <div className="text-xs text-gray-700 font-semibold">Faith</div>
                    <div className="text-[10px] text-gray-500 mt-1">Confiança em informações verdadeiras e imparciais</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-[#0F52BA] text-lg">O</div>
                    <div className="text-xs text-gray-700 font-semibold">Optimism</div>
                    <div className="text-[10px] text-gray-500 mt-1">Visão de futuro baseada em inovação e transparência</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-[#0F52BA] text-lg">S</div>
                    <div className="text-xs text-gray-700 font-semibold">Synthesis</div>
                    <div className="text-[10px] text-gray-500 mt-1">Transformar dados complexos em entendimento simples</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-[#0F52BA] mb-2">Essência</h3>
                <p className="text-xs text-gray-700">O AFOS-Analytics não é sobre opinião.</p>
                <p className="text-xs text-gray-700 font-semibold mt-1">É sobre entender a realidade com mais precisão.</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 font-semibold">
                <span>Gratuito</span>
                <span>•</span>
                <span>Sem login</span>
                <span>•</span>
                <span>Atualizado automaticamente</span>
                <span>•</span>
                <span>Mobile e desktop</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GLOBAL */}
      {showGlobal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" role="dialog" aria-label="Eleições globais" onClick={() => setShowGlobal(false)}>
          <div className="bg-white rounded-2xl max-w-5xl w-full my-4 sm:my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#0F52BA] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">Global — Eleições pelo Mundo</h2>
              <button onClick={() => setShowGlobal(false)} className="text-white/70 hover:text-white text-2xl leading-none" aria-label="Fechar">✕</button>
            </div>
            <div className="p-3 sm:p-6 max-h-[80vh] overflow-y-auto">

              {/* WORLD MAP */}
              <div className="bg-[#F0F4FF] rounded-xl p-3 sm:p-5 mb-5">
                <h3 className="text-sm font-bold text-[#0F52BA] mb-3">Mapa Global — Eleições Monitoradas</h3>
                <div className="relative w-full" style={{paddingBottom:'50%'}}>
                  <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full">
                    <rect width="1000" height="500" fill="#E8EDFB" rx="8"/>
                    <ellipse cx="250" cy="200" rx="120" ry="180" fill="#D4DDFB" opacity="0.5"/>
                    <ellipse cx="500" cy="220" rx="80" ry="200" fill="#D4DDFB" opacity="0.5"/>
                    <ellipse cx="720" cy="200" rx="150" ry="160" fill="#D4DDFB" opacity="0.5"/>
                    <ellipse cx="820" cy="370" rx="60" ry="40" fill="#D4DDFB" opacity="0.5"/>
                    {globalData?.elections?.map((e: GlobalElection, i: number) => {
                      const x = ((e.lng + 180) / 360) * 1000;
                      const y = ((90 - e.lat) / 180) * 500;
                      const hasData = e.polymarket && e.polymarket.markets?.length > 0;
                      return (
                        <g key={i} className="cursor-pointer" onClick={() => setExpandedElection(expandedElection === i ? null : i)}>
                          <circle cx={x} cy={y} r={hasData ? 8 : 5} fill={hasData ? '#0F52BA' : '#94A3B8'} stroke="white" strokeWidth="2"/>
                          {hasData && <circle cx={x} cy={y} r={14} fill="none" stroke="#0F52BA" strokeWidth="1" opacity="0.4">
                            <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
                          </circle>}
                          <foreignObject x={x - 12} y={y - 28} width="24" height="24">
                            <span style={{fontSize:'16px'}}>{e.flag}</span>
                          </foreignObject>
                          <text x={x} y={y - 14} textAnchor="middle" fill="#0F52BA" fontSize="7" fontWeight="700">{e.country.slice(0,3).toUpperCase()}</text>
                        </g>
                      );
                    })}
                    {!globalData && <text x="500" y="250" textAnchor="middle" fill="#94A3B8" fontSize="14">Carregando...</text>}
                  </svg>
                </div>
              </div>

              {/* CALENDAR */}
              <div className="mb-5">
                <h3 className="text-sm font-bold text-[#0F52BA] mb-3">Calendário Eleitoral Global</h3>
                <div className="flex flex-wrap gap-2">
                  {globalData?.elections?.map((e: GlobalElection, i: number) => (
                    <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-[#0F52BA] hover:bg-blue-50 transition-all"
                      onClick={() => setExpandedElection(expandedElection === i ? null : i)}>
                      <span className="mr-1">{e.flag}</span>
                      <span className="font-semibold">{e.country}</span>
                      <span className="text-gray-400 ml-1">— {e.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ELECTION CARDS — clicáveis */}
              <h3 className="text-sm font-bold text-[#0F52BA] mb-3">Eleições com Dados Polymarket</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                {globalData?.elections?.filter((e: GlobalElection) => e.polymarket && e.polymarket.markets?.length > 0)
                  .sort((a: GlobalElection, b: GlobalElection) => (b.polymarket?.volume || 0) - (a.polymarket?.volume || 0))
                  .map((e: GlobalElection, i: number) => {
                  const idx = globalData.elections.indexOf(e);
                  const isExpanded = expandedElection === idx;
                  const vol = e.polymarket?.volume || 0;
                  const volStr = vol > 1e6 ? '$'+(vol/1e6).toFixed(1)+'M' : '$'+(vol/1e3).toFixed(0)+'K';
                  const colors = ['#0F52BA','#1a6dd4','#3b82f6','#60a5fa','#93c5fd'];
                  return (
                    <div key={i}
                      className={`bg-[#F8FAFC] border rounded-xl p-4 cursor-pointer transition-all duration-300 ${isExpanded ? 'border-[#0F52BA] shadow-lg' : 'border-[#E2E8F0] hover:border-[#0F52BA] hover:shadow-md'}`}
                      onClick={() => setExpandedElection(isExpanded ? null : idx)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{e.flag}</span>
                          <div>
                            <div className="font-bold text-[#1a1a1a] text-sm">{e.country}</div>
                            <div className="text-[10px] text-gray-500">{e.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] bg-[#0F52BA] text-white px-2 py-0.5 rounded-full">{e.date}</div>
                          <div className="text-[9px] text-gray-400 mt-1">{volStr}</div>
                        </div>
                      </div>

                      {/* Top 3 ou todos (expandido) */}
                      <div className="space-y-1.5">
                        {e.polymarket!.markets.slice(0, isExpanded ? undefined : 3).map((m: { question: string; yesPrice: number; volume: number }, j: number) => {
                          const nm = (m.question||'').replace(/^Will\s+/i,'').replace(/\s+(win|finish|be).*/i,'').trim();
                          const pct = (m.yesPrice * 100).toFixed(1);
                          return (
                            <div key={j}>
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-[#1a1a1a] font-medium truncate mr-2">{nm}</span>
                                <span className="font-bold flex-shrink-0" style={{color: colors[Math.min(j,4)]}}>{pct}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.min(parseFloat(pct),100)}%`, backgroundColor: colors[Math.min(j,4)]}}/>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {!isExpanded && e.polymarket!.markets.length > 3 && (
                        <div className="text-[10px] text-[#0F52BA] text-center mt-2 font-medium">Clique para ver {e.polymarket!.markets.length} candidatos ▼</div>
                      )}
                      {isExpanded && (
                        <div className="text-[10px] text-gray-400 text-center mt-2">Vol. total: {volStr} | {e.polymarket!.markets.length} candidatos ▲</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Elections without data */}
              {(globalData?.elections?.filter((e: GlobalElection) => !e.polymarket || !e.polymarket.markets?.length)?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-400 mb-2">Próximas Eleições — Aguardando Dados</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {globalData?.elections?.filter((e: GlobalElection) => !e.polymarket || !e.polymarket.markets?.length).map((e: GlobalElection, i: number) => (
                      <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-center">
                        <div className="text-lg">{e.flag}</div>
                        <div className="font-semibold text-[#1a1a1a]">{e.country}</div>
                        <div className="text-gray-400">{e.date} | {e.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-gray-400 text-center">Dados: Polymarket | Atualizado a cada 2h</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL METAS */}
      {showMetas && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-label="Metas do AFOS Analytics" onClick={() => setShowMetas(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#0F52BA] text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Metas — AFOS Analytics</h2>
              <button onClick={() => setShowMetas(false)} className="text-white/70 hover:text-white text-2xl leading-none" aria-label="Fechar">✕</button>
            </div>
            <div className="p-6 sm:p-8 space-y-6 text-sm text-[#1a1a1a] leading-relaxed max-h-[75vh] overflow-y-auto">

              <div>
                <h3 className="font-bold text-lg text-[#0F52BA] mb-2">🇧🇷 Contribuição para o Crescimento e Desenvolvimento do Brasil</h3>
                <p className="font-semibold mb-2">A TESE CENTRAL:</p>
                <p>O Brasil perde bilhões de reais por ano em decisões políticas e econômicas baseadas em informação fragmentada, enviesada ou manipulada. Quando o eleitor vota sem informação, quando o empresário não antecipa cenários, quando o investidor foge do país por incerteza — todos perdem. O AFOS Analytics — <strong className="text-[#0F52BA]">projeto único e inédito em uma eleição no mundo</strong> — ataca esse problema na raiz: transformar informação política em inteligência acionável para toda a sociedade.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">📈 Impacto no Crescimento Econômico</h3>
                <p className="mb-2"><strong>Previsibilidade gera investimento.</strong> O Brasil é a 9ª economia do mundo mas recebe investimento estrangeiro desproporcional ao seu tamanho — em parte porque investidores internacionais não conseguem precificar risco político brasileiro. AFOS Analytics, ao cruzar Polymarket (mercado de apostas reais internacional de eventos futuros) com pesquisas de opinião eleitoral tradicional, cria um termômetro de risco político em tempo real.</p>
                <p><strong>Empresários tomam melhores decisões.</strong> Uma empresa que sabe com 7 meses de antecedência a tendência eleitoral pode planejar: expandir ou contrair? Contratar ou segurar? Investir em qual estado? Eleição no Brasil muda câmbio em 15%, juros em 3pp e bolsa em 20% — quem antecipa, prospera. Quem é pego de surpresa, quebra. Isso protege empregos.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">🗳️ Impacto no Desenvolvimento Social</h3>
                <p className="mb-2"><strong>Qualidade democrática.</strong> O Brasil tem 150 milhões de eleitores. A maioria decide voto nas últimas semanas, baseado em propaganda de TV, WhatsApp ou redes sociais. Quando um cidadão de qualquer renda ou escolaridade pode abrir o celular e ver dados cruzados de 17 institutos + mercado internacional de apostas reais + análise de escândalos em um único painel gratuito e em português, o nível do debate político sobe. Voto informado gera representantes melhores. Representantes melhores geram políticas melhores. Políticas melhores geram desenvolvimento.</p>
                <p className="mb-2"><strong>Accountability do poder.</strong> O card do STF com odds de impeachment de 17.5% + nexo Banco Master é algo que nenhum veículo brasileiro publica dessa forma. Quando o cidadão vê que o mercado internacional precifica quase 1 em 5 chances de um ministro do STF ser impeachmado, isso cria pressão real por transparência.</p>
                <p><strong>Educação cívica e financeira.</strong> O AFOS Analytics introduz conceitos que a maioria dos brasileiros nunca viu: mercados de previsão, odds com dinheiro real, cruzamento de fontes, análise de credibilidade de institutos. Isso é alfabetização política e financeira simultânea.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">🌎 Impacto na Imagem Internacional do Brasil</h3>
                <p className="mb-2"><strong>Soft power tecnológico.</strong> O AFOS Analytics é um <strong className="text-[#0F52BA]">projeto único e inédito em uma eleição no mundo</strong> — o primeiro dashboard que cruza Polymarket com pesquisas eleitorais nacionais de um país emergente, em tempo real, com análise de escândalos e sentimento popular. Nenhuma democracia no planeta possui ferramenta equivalente. Isso posiciona o Brasil na vanguarda da democracia digital.</p>
                <p><strong>Integração com mercados globais.</strong> O fato de usar Polymarket (plataforma global) como espelho das expectativas internacionais sobre o Brasil cria uma ponte entre o eleitor brasileiro e o investidor global. Ambos olham para o mesmo dashboard. Isso reduz assimetria de informação, que é um dos maiores destruidores de valor em economias emergentes.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">🔗 Efeito Cascata no Desenvolvimento</h3>
                <div className="bg-[#F8FAFC] rounded-lg p-4 text-xs space-y-2">
                  <p>Informação transparente → Voto mais consciente → Representantes mais competentes → Políticas públicas melhores → Crescimento econômico sustentável → Desenvolvimento social</p>
                  <p>Previsibilidade política → Investimento estrangeiro → Geração de empregos → Renda e consumo → Arrecadação → Serviços públicos melhores</p>
                  <p>Accountability dos poderosos → Redução da corrupção → Recursos bem aplicados → Saúde, educação, infraestrutura → Qualidade de vida → Brasil mais forte</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">💡 Impacto Potencial</h3>
                <ul className="space-y-1 text-xs">
                  <li>📱 <strong>150 milhões de eleitores</strong> com acesso a inteligência eleitoral profissional</li>
                  <li>🗳️ <strong>Voto mais consciente</strong> baseado em dados cruzados, não em bolhas de WhatsApp</li>
                  <li>💰 <strong>Investidores e empresários</strong> antecipando cenários políticos</li>
                  <li>⚖️ <strong>Pressão por accountability</strong> sobre poder público (STF, governo, Congresso)</li>
                  <li>📰 <strong>Jornalistas</strong> com painel consolidado para reportagens mais profundas</li>
                  <li>🎓 <strong>Professores</strong> usando como ferramenta de educação cívica em sala de aula</li>
                </ul>
              </div>

              <div className="bg-[#0F52BA]/5 border border-[#0F52BA]/20 rounded-lg p-4">
                <h3 className="font-bold text-[#0F52BA] mb-2">🎯 Síntese</h3>
                <p className="text-xs">O AFOS Analytics — <strong className="text-[#0F52BA]">projeto único e inédito em uma eleição no mundo</strong> — não é apenas um dashboard eleitoral. É uma peça de <strong>infraestrutura democrática</strong> que ataca três problemas estruturais do Brasil simultaneamente: <strong>assimetria de informação</strong> (nivela acesso entre elite e cidadão comum), <strong>incerteza política</strong> (reduz risco percebido por investidores) e <strong>déficit de accountability</strong> (expõe escândalos com dados, não com opinião).</p>
                <p className="text-xs mt-2">Um país onde o cidadão vota melhor, o empresário planeja melhor e o investidor confia mais — é um país que <strong>cresce mais rápido, distribui melhor e se desenvolve de forma sustentável</strong>.</p>
                <p className="text-xs mt-3 italic text-[#0F52BA]">&quot;A democracia não funciona sem informação. A informação não funciona sem transparência. O AFOS Analytics é transparência automatizada.&quot;</p>
              </div>

              <p className="text-[10px] text-gray-400 text-center">Gratuito. Sem login. Atualizado automaticamente. Mobile e desktop. ⚡</p>
            </div>
          </div>
        </div>
      )}

      <main id="main-content" className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12" role="main">

        {/* SECTION 1: POLYMARKET */}
        <section>
          <h2 className="font-bold text-[#1a1a1a] mb-4 flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
            <span className="flex-shrink-0">📊</span>
            <span className="hidden sm:inline">Mercados de previsão x institutos de pesquisas – Análises: mídias + redes sociais</span>
            <span className="sm:hidden leading-snug">Mercados de previsão x institutos de pesquisas<br/>Análises: mídias + redes sociais</span>
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 mx-0">
            <div className="mb-2">
              <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="text-[#0F52BA] font-bold underline hover:text-[#0a3d8f] text-sm sm:text-base">polymarket.com</a>
            </div>
            <p className="text-xs sm:text-sm text-[#1a1a1a] leading-relaxed">
              Polymarket é a maior plataforma de mercados de previsão do mundo. Diferente de pesquisas de opinião, permite apostas reais em eventos futuros e reflete onde as pessoas colocam seu dinheiro — historicamente mais preciso. As odds abaixo mostram a probabilidade do mercado.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {renderMarkets(poly?.presidential, '🏆 Quem vence a Presidência?', 10)}
            {renderMarkets(poly?.secondPlace, '🥈 2º lugar no 1º turno', 8)}
            {renderMarkets(poly?.thirdPlace, '🥉 3º lugar no 1º turno', 8)}
            {renderMarkets(poly?.stf, '⚖️ STF: Impeachment de ministro até 2027?')}
            {renderMarkets(poly?.senate, '🏛️ Senado: Qual partido elege mais?', 8)}
            {renderMarkets(poly?.inflation, '📈 Inflação 2026')}
          </div>
        </section>

        {/* SECTION 2: PESQUISAS ELEITORAIS */}
        {polls && (
          <section>
            <SectionTitle icon="📋">Pesquisas Eleitorais</SectionTitle>

            {/* TABELA COMPARATIVA PESQUISAS VS POLYMARKET */}
            {polls?.polymarketComparison && (
              <Card className="mb-6 border-l-4 border-l-[#0F52BA]">
                <h3 className="font-bold text-sm text-[#0F52BA] mb-3">📊 Pesquisas vs Polymarket — Comparação dos Candidatos</h3>
                {/* Desktop: tabela grid */}
                <div className="hidden sm:block overflow-x-auto">
                  <div className="grid grid-cols-5 gap-1 text-xs">
                    <div className="font-bold text-gray-500 py-2">Candidato</div>
                    <div className="font-bold text-gray-500 py-2 text-center">Pesquisas</div>
                    <div className="font-bold text-gray-500 py-2 text-center">Polymarket</div>
                    <div className="font-bold text-gray-500 py-2 text-center">Tend. Pesquisa</div>
                    <div className="font-bold text-gray-500 py-2 text-center">Tend. Poly</div>
                    {polls?.polymarketComparison?.candidates.map((c, i) => (
                      <div key={i} className="contents">
                        <div className="font-semibold py-1 border-t border-gray-100">{c.name}</div>
                        <div className="text-center py-1 border-t border-gray-100">{c.pesquisaRange}</div>
                        <div className="text-center py-1 border-t border-gray-100 font-bold text-[#0F52BA]">{c.polymarket}</div>
                        <div className="text-center py-1 border-t border-gray-100">{c.tendenciaPesquisa}</div>
                        <div className="text-center py-1 border-t border-gray-100">{c.tendenciaPolymarket}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Mobile: cards empilhados */}
                <div className="sm:hidden space-y-2">
                  {polls?.polymarketComparison?.candidates.map((c, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                      <div className="font-semibold text-sm text-[#1a1a1a] mb-1">{c.name}</div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <span className="text-gray-500">Pesquisas:</span><span className="font-medium">{c.pesquisaRange}</span>
                        <span className="text-gray-500">Polymarket:</span><span className="font-bold text-[#0F52BA]">{c.polymarket}</span>
                        <span className="text-gray-500">Tend. Pesq:</span><span>{c.tendenciaPesquisa}</span>
                        <span className="text-gray-500">Tend. Poly:</span><span>{c.tendenciaPolymarket}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Fontes: Datafolha (07/Mar), Quaest (11/Mar), AtlasIntel (25/Mar), Polymarket (ao vivo)</p>
              </Card>
            )}

            {/* LISTA DE INSTITUTOS */}
            {polls?.institutes && (
              <Card className="mb-6">
                <h3 className="font-bold text-sm text-[#1a1a1a] mb-3">🏛️ 17 Institutos Monitorados — Confiabilidade</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {polls?.institutes.map((inst: Institute) => (
                    <div key={inst.name} className="flex items-center gap-2 text-xs py-1 border-b border-gray-50">
                      <Stars count={inst.reliability} />
                      <span className="font-semibold text-[#1a1a1a]">{inst.name}</span>
                      <span className="text-gray-400 text-[10px]">({inst.type})</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-gray-400 mt-3 space-y-1">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span><span className="text-[#0F52BA]">★★★★★</span> Referência nacional</span>
                    <span><span className="text-[#0F52BA]">★★★★</span><span className="text-gray-300">★</span> Alta confiabilidade</span>
                    <span><span className="text-[#0F52BA]">★★★</span><span className="text-gray-300">★★</span> Confiável</span>
                    <span><span className="text-[#0F52BA]">★★</span><span className="text-gray-300">★★★</span> Usar com cautela</span>
                    <span><span className="text-[#0F52BA]">★</span><span className="text-gray-300">★★★★</span> Baixa confiabilidade</span>
                  </div>
                  <div>Atualizado: {polls.lastUpdate}</div>
                </div>
              </Card>
            )}

            {/* PESQUISAS POR INSTITUTO */}
            {polls?.polls?.map((poll: Poll, pi: number) => (
            <div key={pi} className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600 bg-[#F8FAFC] rounded-lg p-3">
              <span className="font-bold text-[#0F52BA] text-base">{poll.institute}</span>
              <span>📅 {poll.date}</span>
              <span>👥 {poll.sample?.toLocaleString('pt-BR')} entrevistados</span>
              <span>± {poll.margin}pp</span>
              <span><Stars count={poll.reliability} /></span>
              <span className="text-xs text-gray-400">{poll.method}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {poll.scenarios.map((scenario: Scenario) => {
                const maxP = Math.max(...scenario.results.map(r => r.percent));
                return (
                  <Card key={scenario.name}>
                    <h4 className="font-bold text-[#1a1a1a] mb-3">{scenario.name}</h4>
                    {scenario.results.map(r => (
                      <HBar
                        key={r.candidate}
                        value={r.percent}
                        max={maxP * 1.15}
                        color={getColor(r.candidate)}
                        label={r.candidate}
                      />
                    ))}
                  </Card>
                );
              })}
            </div>

            {/* Second Round */}
            <h3 className="font-bold text-lg text-[#1a1a1a] mb-3">🔄 Simulações de 2º Turno</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {poll.secondRound.map((sr: SecondRound) => (
                <Card key={sr.matchup}>
                  <h4 className="font-semibold text-sm text-center mb-3 text-gray-600">{sr.matchup}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-right text-sm font-bold" style={{ color: sr.percent1 > sr.percent2 ? '#0F52BA' : '#6B7280' }}>
                        {sr.candidate1} — {sr.percent1}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mt-1 overflow-hidden flex justify-end">
                        <div className="h-full rounded-full" style={{ width: `${sr.percent1}%`, backgroundColor: sr.percent1 > sr.percent2 ? '#0F52BA' : '#94A3B8' }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-400">vs</span>
                    <div className="flex-1">
                      <div className="text-left text-sm font-bold" style={{ color: sr.percent2 > sr.percent1 ? '#DC2626' : '#6B7280' }}>
                        {sr.candidate2} — {sr.percent2}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${sr.percent2}%`, backgroundColor: sr.percent2 > sr.percent1 ? '#DC2626' : '#94A3B8' }} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            </div>
            ))}

          {/* ANÁLISE CRITERIOSA — dados via JSON externo */}
          {crit && crit.candidates?.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-[#0F52BA]/20">
          <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2"><span>🔬</span> Análise Criteriosa — Os 4 Primeiros Colocados</h3>
          <p className="text-xs text-gray-500 mb-4">{crit.subtitle}</p>

          {/* CANDIDATOS 1-3 (dinâmico via JSON) */}
          {crit.candidates.filter(c => !c.caiado).map(c => (
            <Card key={c.rank} className="mb-4 border-l-4" style={{ borderLeftColor: c.color }}>
              <h3 className="font-bold text-lg text-[#1a1a1a] mb-1">{['1️⃣','2️⃣','3️⃣','4️⃣'][Number(c.rank)-1]} {c.header}</h3>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-700 text-sm mb-2">✅ PONTOS FORTES</h4>
                  <ul className="text-xs text-gray-700 space-y-1.5">
                    {c.fortes.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-700 text-sm mb-2">❌ PONTOS FRACOS</h4>
                  <ul className="text-xs text-gray-700 space-y-1.5">
                    {c.fracos.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                <p className="text-xs text-gray-700"><strong>🎯 Análise AFOS ({crit.updatedAt?.slice(0,10)}):</strong> {c.analise}</p>
              </div>
            </Card>
          ))}

          {/* CANDIDATO 4 — CAIADO/HADDAD (formato especial) */}
          {crit.candidates.filter(c => c.caiado).map(c => (
            <Card key={c.rank} className="mb-4 border-l-4" style={{ borderLeftColor: c.color }}>
              <h3 className="font-bold text-lg text-[#1a1a1a] mb-1">4️⃣ {c.header}</h3>
              {c.subtitle && <p className="text-xs text-gray-500 mb-3">{c.subtitle}</p>}
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h4 className="font-bold text-sm text-[#6B7280] mb-2">🔵 {c.caiado!.label}</h4>
                  <div className="bg-green-50 rounded-lg p-3 mb-2">
                    <p className="text-xs text-gray-700"><strong>Fortes:</strong> {c.caiado!.fortes}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700"><strong>Fracos:</strong> {c.caiado!.fracos}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#DC2626] mb-2">🔴 {c.haddad!.label}</h4>
                  <div className="bg-green-50 rounded-lg p-3 mb-2">
                    <p className="text-xs text-gray-700"><strong>Fortes:</strong> {c.haddad!.fortes}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700"><strong>Fracos:</strong> {c.haddad!.fracos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                <p className="text-xs text-gray-700"><strong>🎯 Análise AFOS ({crit.updatedAt?.slice(0,10)}):</strong> {c.analise}</p>
              </div>
            </Card>
          ))}

          {/* QUADRO COMPARATIVO (dinâmico via JSON) */}
          <Card className="border-l-4 border-l-[#0F52BA]">
            <h3 className="font-bold text-sm text-[#0F52BA] mb-3">📊 QUADRO COMPARATIVO — Pesquisa vs Polymarket vs Realidade</h3>
            <div className="hidden sm:block overflow-x-auto">
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="font-bold text-gray-500 py-2">Candidato</div>
                <div className="font-bold text-gray-500 py-2 text-center">Pesquisa</div>
                <div className="font-bold text-gray-500 py-2 text-center">Polymarket</div>
                <div className="font-bold text-gray-500 py-2 text-center">Tendência</div>
                <div className="font-bold text-gray-500 py-2 text-center">2º Turno vs Lula</div>
                {crit.quadroComparativo.map((r, i) => (
                  <div key={i} className="contents">
                    <div className="font-semibold py-1 border-t border-gray-100">{r.n}</div>
                    <div className="text-center py-1 border-t border-gray-100" style={{color: r.pc || undefined, fontWeight: r.pc ? 700 : undefined}}>{r.p}</div>
                    <div className="text-center py-1 border-t border-gray-100" style={{color: r.mc || undefined, fontWeight: r.mc ? 700 : undefined}}>{r.m}</div>
                    <div className="text-center py-1 border-t border-gray-100">{r.t}</div>
                    <div className="text-center py-1 border-t border-gray-100" style={{color: r.mc || undefined, fontWeight: r.mc ? 700 : undefined}}>{r.s}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:hidden space-y-2">
              {crit.quadroComparativo.map((r, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="font-semibold text-sm mb-1">{r.n}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span className="text-gray-500">Pesquisa:</span><span className="font-medium">{r.p}</span>
                    <span className="text-gray-500">Polymarket:</span><span className="font-bold text-[#0F52BA]">{r.m}</span>
                    <span className="text-gray-500">Tendência:</span><span>{r.t}</span>
                    <span className="text-gray-500">2º Turno:</span><span>{r.s}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <p className="text-xs text-[#0F52BA] font-semibold">📌 {crit.cruzamento}</p>
            </div>
          </Card>
          </div>
          )}
          </section>
        )}

        {/* SECTION 3: PERFIL DOS PRÉ-CANDIDATOS */}
        <section>
          <SectionTitle icon="👤">Perfil dos Pré-Candidatos</SectionTitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map(c => (
              <Card key={c.name} className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <h4 className="font-bold text-[#1a1a1a]">{c.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: partyColor[c.party] || '#94A3B8' }}>{c.party}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">{c.role} · {c.age} anos</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Polymarket</div>
                    <div className="font-bold text-[#0F52BA]">{c.polymarket}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Pesquisa</div>
                    <div className="font-bold text-[#1a1a1a]">{c.poll}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2"><strong>Posição:</strong> {c.position}</p>
                <p className="text-xs text-red-600"><strong>⚠️ Risco:</strong> {c.risk}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION: LIVE ELEIÇÕES NEWS 120' */}
        {news && news.totalNews > 0 && (
        <section>
          <SectionTitle icon="📰">Live Eleições News 120&apos;</SectionTitle>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 mb-4">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <p className="text-xs text-gray-500">🔄 Atualizado a cada 30 minutos | Última: <span className="font-semibold text-[#0F52BA]">{news.updatedAt} BRT</span></p>
              <span className="text-xs text-gray-400">{news.totalNews} notícias coletadas</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Fontes: Google News RSS + Firecrawl AI | CNN Brasil, TV Globo, Folha de S.Paulo, Estadão, Metrópoles, Poder360, Valor Econômico, Gazeta do Povo, Jovem Pan, Correio Braziliense, Band, Record, SBT, Veja, IstoÉ, Época, X/Twitter e outros</p>

            <div className="space-y-4">
              {Object.entries(news.grouped || {}).map(([cat, items]) => {
                const newsItems = items as NewsItem[];
                return (
                newsItems && newsItems.length > 0 ? (
                  <div key={cat}>
                    <h4 className="font-bold text-sm text-[#0F52BA] mb-2 border-b border-[#E2E8F0] pb-1">{cat}</h4>
                    <div className="space-y-2">
                      {newsItems.map((n: NewsItem, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs border-b border-gray-100 pb-2">
                          <span className="text-gray-400 flex-shrink-0 mt-0.5 min-w-[70px]">{n.time || '—'}</span>
                          <div className="flex-1">
                            <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a] hover:text-[#0F52BA] hover:underline leading-snug font-medium">
                              {n.title}
                            </a>
                            <span className="text-gray-400 ml-1">— {n.source}</span>
                            {n.summary && <p className="text-gray-500 mt-1 leading-relaxed">{n.summary}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null);
              })}
            </div>
          </div>
        </section>
        )}

        {/* DYNAMIC ANALYSIS CARDS — updated every 2h via cron */}
        {(() => {
          const s = ac?.cards?.sentimento;
          const inss = ac?.cards?.inss;
          const bm = ac?.cards?.bancoMaster;
          const stf = ac?.cards?.stf;
          return (<>
        {/* SENTIMENTO POPULAR */}
        <section>
          <SectionTitle icon="📡">Sentimento Popular — Redes Sociais e Internet</SectionTitle>
          {ac?.updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {ac.updatedAt} BRT</p>}
          <Card className="bg-gradient-to-br from-[#F8FAFC] to-blue-50 border-l-4 border-l-[#0F52BA]">
            <div className="space-y-4 text-sm text-[#1a1a1a] leading-relaxed">
              <p>{s?.text1 || ''}</p>
              <p>{s?.text2 || ''}</p>
              <p>{s?.text3 || ''}</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                  <div className="font-bold text-[#0F52BA] mb-1">Direita</div>
                  <p className="text-xs text-gray-600">{s?.direita || ''}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                  <div className="font-bold text-[#DC2626] mb-1">Esquerda</div>
                  <p className="text-xs text-gray-600">{s?.esquerda || ''}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                  <div className="font-bold text-[#6B7280] mb-1">Terceira Via</div>
                  <p className="text-xs text-gray-600">{s?.terceiraVia || ''}</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-[#0F52BA] font-semibold">📌 {s?.polymarket || ''}</p>
              </div>
            </div>
          </Card>
        </section>

        {/* INSS */}
        <section>
          <SectionTitle icon="🔴">Escândalo INSS e o Caso Lulinha</SectionTitle>
          {ac?.updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {ac.updatedAt} BRT</p>}
          <Card className="border-l-4 border-l-[#DC2626]">
            <div className="space-y-3 text-sm text-[#1a1a1a] leading-relaxed">
              <p>{inss?.text1 || ''}</p>
              <p>{inss?.text2 || ''}</p>
              <p>{inss?.text3 || ''}</p>
              <p>{inss?.text4 || ''}</p>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="font-bold text-[#DC2626] text-xs mb-1">⚡ IMPACTO NA IMAGEM DE LULA</div>
                  <p className="text-xs text-gray-700">{inss?.impactoLula || ''}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="font-bold text-[#DC2626] text-xs mb-1">⚡ IMPACTO NA GESTÃO FEDERAL</div>
                  <p className="text-xs text-gray-700">{inss?.impactoGestao || ''}</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-[#DC2626] font-semibold">📌 {inss?.conclusao || ''}</p>
              </div>
            </div>
          </Card>
        </section>

        {/* BANCO MASTER */}
        <section>
          <SectionTitle icon="🏦">Impacto do Escândalo Banco Master</SectionTitle>
          {ac?.updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {ac.updatedAt} BRT</p>}
          <Card className="border-l-4 border-l-[#0F52BA]">
            <p className="text-sm text-[#1a1a1a] leading-relaxed mb-3">{bm?.text1 || ''}</p>
            <p className="text-sm text-[#1a1a1a] leading-relaxed mb-3">{bm?.text2 || ''}</p>
            <p className="text-sm text-[#1a1a1a] leading-relaxed mb-3">{bm?.text3 || ''}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <p className="text-xs text-[#0F52BA] font-semibold">📌 {bm?.conclusao || ''}</p>
            </div>
          </Card>
        </section>

        {/* STF */}
        <section>
          <SectionTitle icon="⚖️">Credibilidade do STF — Impacto Eleitoral</SectionTitle>
          {ac?.updatedAt && <p className="text-[10px] text-gray-400 -mt-3 mb-3">🔄 Análise atualizada: {ac.updatedAt} BRT</p>}
          <Card className="border-l-4 border-l-[#DC2626]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 text-red-700 font-bold text-xl px-4 py-2 rounded-lg">13.5%</div>
              <p className="text-sm text-gray-600">Probabilidade de impeachment de ministro do STF até 2027 (Polymarket, 06/Abr)</p>
            </div>
            <h4 className="font-bold text-sm text-[#1a1a1a] mb-2">Ministros sob pressão:</h4>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              {[
                { name: 'Dias Toffoli', desc: stf?.toffoli || '' },
                { name: 'Alexandre de Moraes', desc: stf?.moraes || '' },
                { name: 'Gilmar Mendes', desc: stf?.gilmar || '' },
                { name: 'Flávio Dino', desc: stf?.dino || '' },
              ].map(m => (
                <div key={m.name} className="bg-red-50 rounded-lg p-3">
                  <div className="font-semibold text-sm text-[#1a1a1a]">{m.name}</div>
                  <p className="text-xs text-gray-600 mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <h4 className="font-bold text-xs text-[#DC2626] mb-2">🏦 NEXO STF × BANCO MASTER</h4>
              <p className="text-xs text-gray-700 leading-relaxed">{stf?.nexo || ''}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-[#1a1a1a] leading-relaxed">{stf?.analise || ''}</p>
            </div>
          </Card>
        </section>
          </>);
        })()}

        
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0F52BA] text-white py-4 px-4 text-center text-xs" role="contentinfo">
        <p>AFOS Analytics — Dashboard de Inteligência Eleitoral | Dados: Polymarket, +17 Institutos de Pesquisa, Google News, Firecrawl AI | Atualizado a cada 2h | Este conteúdo não constitui orientação política</p>
        <p className="mt-1 text-blue-200/50">Dados e probabilidades obtidos da <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Polymarket (polymarket.com)</a> — Este site não é afiliado à Polymarket. Os dados são atualizados automaticamente via API pública.</p>
      </footer>
    </div>
  );
}
