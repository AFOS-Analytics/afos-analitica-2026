import type { PollData, CritData, Poll, Scenario, SecondRound, Institute } from '../types';
import { SectionTitle, Card, HBar, Stars } from './ui';
import { getColor } from '../lib/utils';
import { useTranslation, useLocale } from '../i18n/context';

interface PollsSectionProps {
  polls: PollData | null;
  crit: CritData | null;
}

export function PollsSection({ polls, crit }: PollsSectionProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  if (!polls) return null;

  return (
    <section>
      <SectionTitle icon="📋">{t('sections.polls')}</SectionTitle>

      {/* TABELA COMPARATIVA PESQUISAS VS POLYMARKET */}
      {polls?.polymarketComparison && (
        <Card className="mb-6 border-l-4 border-l-primary">
          <h3 className="font-bold text-sm text-primary mb-3">📊 {t('sections.pollsVsPolymarket')}</h3>
          {/* Desktop: tabela grid */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="grid grid-cols-5 gap-1 text-xs">
              <div className="font-bold text-gray-500 py-2">{t('sections.candidate')}</div>
              <div className="font-bold text-gray-500 py-2 text-center">Pesquisas</div>
              <div className="font-bold text-gray-500 py-2 text-center">Polymarket</div>
              <div className="font-bold text-gray-500 py-2 text-center">{t('sections.tendPoll')}</div>
              <div className="font-bold text-gray-500 py-2 text-center">{t('sections.tendPoly')}</div>
              {polls?.polymarketComparison?.candidates.map((c, i) => (
                <div key={i} className="contents">
                  <div className="font-semibold py-1 border-t border-gray-100">{c.name}</div>
                  <div className="text-center py-1 border-t border-gray-100">{c.pesquisaRange}</div>
                  <div className="text-center py-1 border-t border-gray-100 font-bold text-primary">{c.polymarket}</div>
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
                <div className="font-semibold text-sm text-dark mb-1">{c.name}</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-gray-500">{t('sections.pollsLabel')}</span><span className="font-medium">{c.pesquisaRange}</span>
                  <span className="text-gray-500">Polymarket:</span><span className="font-bold text-primary">{c.polymarket}</span>
                  <span className="text-gray-500">{t('sections.tendPoll')}:</span><span>{c.tendenciaPesquisa}</span>
                  <span className="text-gray-500">{t('sections.tendPoly')}:</span><span>{c.tendenciaPolymarket}</span>
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
          <h3 className="font-bold text-sm text-dark mb-3">🏛️ {t('sections.institutes')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {polls?.institutes.map((inst: Institute) => (
              <div key={inst.name} className="flex items-center gap-2 text-xs py-1 border-b border-gray-50">
                <Stars count={inst.reliability} />
                <span className="font-semibold text-dark">{inst.name}</span>
                <span className="text-gray-400 text-[10px]">({inst.type})</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-gray-400 mt-3 space-y-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span><span className="text-primary">★★★★★</span> Referência nacional</span>
              <span><span className="text-primary">★★★★</span><span className="text-gray-300">★</span> Alta confiabilidade</span>
              <span><span className="text-primary">★★★</span><span className="text-gray-300">★★</span> Confiável</span>
              <span><span className="text-primary">★★</span><span className="text-gray-300">★★★</span> Usar com cautela</span>
              <span><span className="text-primary">★</span><span className="text-gray-300">★★★★</span> Baixa confiabilidade</span>
            </div>
            <div>{t('sections.updated')} {polls.lastUpdate}</div>
            <a href={`/${locale}/how-it-works#criterios-institutos`} className="inline-flex items-center gap-1 text-gray-400 hover:text-primary hover:underline transition-colors">
              ⓘ {t('sections.criteriaLink')} →
            </a>
          </div>
        </Card>
      )}

      {/* PESQUISAS POR INSTITUTO */}
      {polls?.polls?.map((poll: Poll, pi: number) => (
      <div key={pi} className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600 bg-light-bg rounded-lg p-3">
        <span className="font-bold text-primary text-base">{poll.institute}</span>
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
              <h4 className="font-bold text-dark mb-3">{scenario.name}</h4>
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
      <h3 className="font-bold text-lg text-dark mb-3">🔄 {t('sections.secondRound')}</h3>
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
      <div className="mt-6 pt-6 border-t-2 border-primary/20">
      <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2"><span>🔬</span> {t('sections.critAnalysis')}</h3>
      <p className="text-xs text-gray-500 mb-4">{crit.subtitle}</p>

      {/* CANDIDATOS 1-3 (dinâmico via JSON) */}
      {crit.candidates.filter(c => !c.caiado).map(c => (
        <Card key={c.rank} className="mb-4 border-l-4" style={{ borderLeftColor: c.color }}>
          <h3 className="font-bold text-lg text-dark mb-1">{['1️⃣','2️⃣','3️⃣','4️⃣'][Number(c.rank)-1]} {c.header}</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-700 text-sm mb-2">✅ {t('sections.strengths')}</h4>
              <ul className="text-xs text-gray-700 space-y-1.5">
                {c.fortes.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-700 text-sm mb-2">❌ {t('sections.weaknesses')}</h4>
              <ul className="text-xs text-gray-700 space-y-1.5">
                {c.fracos.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <p className="text-xs text-gray-700"><strong>🎯 {t('sections.analysisLabel')} ({crit.updatedAt?.slice(0,10)}):</strong> {c.analise}</p>
          </div>
        </Card>
      ))}

      {/* CANDIDATO 4 — CAIADO/HADDAD (formato especial) */}
      {crit.candidates.filter(c => c.caiado).map(c => (
        <Card key={c.rank} className="mb-4 border-l-4" style={{ borderLeftColor: c.color }}>
          <h3 className="font-bold text-lg text-dark mb-1">4️⃣ {c.header}</h3>
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
              <h4 className="font-bold text-sm text-danger mb-2">🔴 {c.haddad!.label}</h4>
              <div className="bg-green-50 rounded-lg p-3 mb-2">
                <p className="text-xs text-gray-700"><strong>Fortes:</strong> {c.haddad!.fortes}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-gray-700"><strong>Fracos:</strong> {c.haddad!.fracos}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <p className="text-xs text-gray-700"><strong>🎯 {t('sections.analysisLabel')} ({crit.updatedAt?.slice(0,10)}):</strong> {c.analise}</p>
          </div>
        </Card>
      ))}

      {/* QUADRO COMPARATIVO (dinâmico via JSON) */}
      <Card className="border-l-4 border-l-primary">
        <h3 className="font-bold text-sm text-primary mb-3">📊 {t('sections.comparativeTable')}</h3>
        <div className="hidden sm:block overflow-x-auto">
          <div className="grid grid-cols-5 gap-2 text-xs">
            <div className="font-bold text-gray-500 py-2">{t('sections.candidate')}</div>
            <div className="font-bold text-gray-500 py-2 text-center">Pesquisa</div>
            <div className="font-bold text-gray-500 py-2 text-center">Polymarket</div>
            <div className="font-bold text-gray-500 py-2 text-center">Tendência</div>
            <div className="font-bold text-gray-500 py-2 text-center">{t('sections.secondRoundVsLula')}</div>
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
                <span className="text-gray-500">Polymarket:</span><span className="font-bold text-primary">{r.m}</span>
                <span className="text-gray-500">Tendência:</span><span>{r.t}</span>
                <span className="text-gray-500">2º Turno:</span><span>{r.s}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <p className="text-xs text-primary font-semibold">📌 {crit.cruzamento}</p>
        </div>
      </Card>
      </div>
      )}
    </section>
  );
}
