'use client';
import type { GlobalData, GlobalElection } from '../types';

interface ModalGlobalProps {
  show: boolean;
  onClose: () => void;
  globalData: GlobalData | null;
  expandedElection: number | null;
  setExpandedElection: (idx: number | null) => void;
}

export function ModalGlobal({ show, onClose, globalData, expandedElection, setExpandedElection }: ModalGlobalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Eleições globais" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full my-4 sm:my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-[#0F52BA] text-white p-4 sm:p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Global — Eleições pelo Mundo</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none" aria-label="Fechar">✕</button>
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
  );
}
