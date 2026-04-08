'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { GlobalData, GlobalElection } from '../types';
import type { CountryMarketSummary } from '../types/global-map';

// D3 map carregado dinamicamente (nunca no server bundle)
const GlobalElectionMap = dynamic(
  () => import('./global-map/GlobalElectionMap').then(mod => mod.GlobalElectionMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center py-20 bg-[#07111f] rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
);

interface ModalGlobalProps {
  show: boolean;
  onClose: () => void;
  globalData: GlobalData | null;
  expandedElection: number | null;
  setExpandedElection: (idx: number | null) => void;
}

/**
 * Converte os dados do /api/global-elections (formato antigo)
 * para CountryMarketSummary[] (formato do mapa D3).
 */
function convertToMapData(elections: GlobalElection[]): CountryMarketSummary[] {
  return elections.map(e => {
    const hasData = e.polymarket && e.polymarket.markets?.length > 0;
    const markets = e.polymarket?.markets || [];
    const topMarket = markets.length > 0 ? markets[0] : null;

    return {
      iso3: e.country.slice(0, 3).toUpperCase(), // Fallback — será sobrescrito se possível
      countryName: e.country,
      flag: e.flag,
      probability: topMarket ? Math.round(topMarket.yesPrice * 1000) / 10 : 0,
      volumeUsd: e.polymarket?.volume || 0,
      status: hasData ? 'live' as const : 'upcoming' as const,
      electionDate: e.date,
      electionType: e.type,
      leadCandidate: topMarket
        ? (topMarket.question || '').replace(/^Will\s+/i, '').replace(/\s+(win|finish|be).*/i, '').trim()
        : '—',
      candidates: markets.slice(0, 5).map(m => ({
        name: (m.question || '').replace(/^Will\s+/i, '').replace(/\s+(win|finish|be).*/i, '').trim(),
        probability: Math.round(m.yesPrice * 1000) / 10,
        volumeUsd: m.volume || 0,
      })),
    };
  });
}

// Mapeamento nome do país → ISO3 para o mapa D3
const COUNTRY_TO_ISO3: Record<string, string> = {
  'Brasil': 'BRA', 'Brazil': 'BRA',
  'EUA': 'USA', 'Estados Unidos': 'USA', 'United States': 'USA',
  'França': 'FRA', 'France': 'FRA',
  'Alemanha': 'DEU', 'Germany': 'DEU',
  'Reino Unido': 'GBR', 'United Kingdom': 'GBR',
  'Canadá': 'CAN', 'Canada': 'CAN',
  'Austrália': 'AUS', 'Australia': 'AUS',
  'Coreia do Sul': 'KOR', 'South Korea': 'KOR',
  'Filipinas': 'PHL', 'Philippines': 'PHL',
  'Chile': 'CHL',
  'Colômbia': 'COL', 'Colombia': 'COL',
  'Índia': 'IND', 'India': 'IND',
  'México': 'MEX', 'Mexico': 'MEX',
  'Nigéria': 'NGA', 'Nigeria': 'NGA',
  'Argentina': 'ARG',
  'Itália': 'ITA', 'Italy': 'ITA',
  'Japão': 'JPN', 'Japan': 'JPN',
};

export function ModalGlobal({ show, onClose, globalData, expandedElection, setExpandedElection }: ModalGlobalProps) {
  const [mapData, setMapData] = useState<CountryMarketSummary[]>([]);

  useEffect(() => {
    if (globalData?.elections) {
      const converted = convertToMapData(globalData.elections);
      // Resolver ISO3 pelo nome do país
      const resolved = converted.map(c => ({
        ...c,
        iso3: COUNTRY_TO_ISO3[c.countryName] || c.iso3,
      }));
      setMapData(resolved);
    }
  }, [globalData]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Eleições globais" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full my-4 sm:my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Global — Eleições pelo Mundo</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none" aria-label="Fechar">✕</button>
        </div>
        <div className="p-3 sm:p-6 max-h-[80vh] overflow-y-auto">

          {/* MAPA D3 */}
          <div className="rounded-xl overflow-hidden mb-5" style={{ height: '400px', background: '#07111f' }}>
            {mapData.length > 0 ? (
              <GlobalElectionMap countries={mapData} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">Carregando dados do mapa...</p>
              </div>
            )}
          </div>

          {/* CALENDÁRIO COM BANDEIRAS */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-primary mb-3">Calendário Eleitoral Global</h3>
            <div className="flex flex-wrap gap-2">
              {globalData?.elections?.map((e: GlobalElection, i: number) => (
                <div key={i} className="bg-light-bg border border-light-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-primary hover:bg-blue-50 transition-all flex items-center gap-1.5"
                  onClick={() => setExpandedElection(expandedElection === i ? null : i)}>
                  <span className="text-base">{e.flag}</span>
                  <span className="font-semibold">{e.country}</span>
                  <span className="text-gray-400">— {e.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ELECTION CARDS COM DADOS POLYMARKET */}
          <h3 className="text-sm font-bold text-primary mb-3">Eleições com Dados Polymarket</h3>
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
                  className={`bg-light-bg border rounded-xl p-4 cursor-pointer transition-all duration-300 ${isExpanded ? 'border-primary shadow-lg' : 'border-light-border hover:border-primary hover:shadow-md'}`}
                  onClick={() => setExpandedElection(isExpanded ? null : idx)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{e.flag}</span>
                      <div>
                        <div className="font-bold text-dark text-sm">{e.country}</div>
                        <div className="text-[10px] text-gray-500">{e.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">{e.date}</div>
                      <div className="text-[9px] text-gray-400 mt-1">{volStr}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {e.polymarket!.markets.slice(0, isExpanded ? undefined : 3).map((m: { question: string; yesPrice: number; volume: number }, j: number) => {
                      const nm = (m.question||'').replace(/^Will\s+/i,'').replace(/\s+(win|finish|be).*/i,'').trim();
                      const pct = (m.yesPrice * 100).toFixed(1);
                      return (
                        <div key={j}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-dark font-medium truncate mr-2">{nm}</span>
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
                    <div className="text-[10px] text-primary text-center mt-2 font-medium">Clique para ver {e.polymarket!.markets.length} candidatos ▼</div>
                  )}
                  {isExpanded && (
                    <div className="text-[10px] text-gray-400 text-center mt-2">Vol. total: {volStr} | {e.polymarket!.markets.length} candidatos ▲</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ELEIÇÕES SEM DADOS */}
          {(globalData?.elections?.filter((e: GlobalElection) => !e.polymarket || !e.polymarket.markets?.length)?.length ?? 0) > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-400 mb-2">Próximas Eleições — Aguardando Dados</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {globalData?.elections?.filter((e: GlobalElection) => !e.polymarket || !e.polymarket.markets?.length).map((e: GlobalElection, i: number) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-center">
                    <div className="text-lg">{e.flag}</div>
                    <div className="font-semibold text-dark">{e.country}</div>
                    <div className="text-gray-400">{e.date} | {e.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-400 text-center mb-6">Dados: Polymarket | Volumes e odds ao vivo</p>

          {/* TEXTO EXPLICATIVO */}
          <div className="space-y-5 text-sm text-dark leading-relaxed border-t border-light-border pt-6">

            <div>
              <p className="mb-3">O modulo <strong className="text-primary">Global</strong> do AFOS Analytics transforma o calendario mundial de eleicoes em <strong>inteligencia acionavel em tempo real</strong>.</p>
              <p className="mb-3">O mapa interativo permite visualizar, pais por pais, onde estao ocorrendo eleicoes, quais estao proximas e quais ja foram resolvidas — criando um <strong>termometro global de risco politico e oportunidade economica</strong>.</p>
              <p>Ao interagir com o mapa, voce acessa dados consolidados que combinam:</p>
              <ul className="mt-2 space-y-1 text-gray-600 ml-4">
                <li>• mercados preditivos (como Polymarket)</li>
                <li>• calendario eleitoral oficial</li>
                <li>• leitura de tendencias politicas</li>
              </ul>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">Como funciona</h4>
              <p className="mb-3">Cada pais no mapa representa um evento eleitoral ativo ou futuro.</p>
              <p className="mb-2">As cores indicam o nivel de definicao ou incerteza politica:</p>
              <ul className="space-y-1 text-gray-600 ml-4 mb-3">
                <li>• tons mais claros → maior previsibilidade</li>
                <li>• tons mais escuros → maior incerteza / disputa</li>
              </ul>
              <p className="mb-2">Ao clicar em um pais, voce acessa:</p>
              <ul className="space-y-1 text-gray-600 ml-4">
                <li>• probabilidade de resultado</li>
                <li>• volume de interesse do mercado</li>
                <li>• eleicoes relacionadas</li>
              </ul>
              <p className="mt-3">Isso transforma o mapa em um <strong>painel global de decisao</strong>, nao apenas visualizacao.</p>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">Calendario global de eleicoes</h4>
              <p className="mb-3">O sistema acompanha eleicoes ao longo de todo o ano, todos os anos, distribuidas globalmente.</p>
              <p>Ao longo de um unico ano, dezenas de paises realizam eleicoes nacionais — criando um fluxo continuo de impacto economico e geopolitico global.</p>
            </div>

            <div className="border-t border-light-border pt-5">
              <h4 className="font-bold text-primary mb-3">Finalidade estrategica</h4>
              <p className="mb-3">O Global nao e apenas um mapa — e uma <strong>infraestrutura de leitura do mundo</strong>.</p>
              <p className="mb-2">Ele permite:</p>
              <ul className="space-y-1 text-gray-600 ml-4">
                <li>• antecipar movimentos de mercado</li>
                <li>• identificar riscos politicos por regiao</li>
                <li>• acompanhar ciclos eleitorais globais em tempo real</li>
                <li>• tomar decisoes com base em dados, nao narrativa</li>
              </ul>
            </div>

            <div className="border-t border-light-border pt-5">
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
                <h4 className="font-bold text-primary mb-2">Traducao direta (nivel executivo)</h4>
                <p className="text-gray-600 mb-1">Politica gera volatilidade.</p>
                <p className="text-gray-600 mb-3">Volatilidade gera oportunidade.</p>
                <p>O <strong className="text-primary">Global</strong> transforma isso em uma interface simples, visual e acionavel.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
