'use client';

import Link from 'next/link';
import type { PollData, CritData, Poll, Scenario, SecondRound, Institute } from '../types';
import { SectionTitle, Card, HBar, Stars } from './ui';
import { LogicLink } from './LogicLink';
import { GlossaryText } from './GlossaryText';
import { getColor } from '../lib/utils';
import { useTranslation, useLocale } from '../i18n/context';
import { fmtDecimal, fmtMilhar } from '../../lib/i18n/numero'

interface PollsSectionProps {
  polls: PollData | null;
  crit: CritData | null;
}

// Guard de render (camada 1 da defesa do dashboard): retorna [] quando o valor não é array,
// evitando o crash `.map is not a function` se um JSON do /atualizar vier com shape divergente
// (objeto-onde-se-espera-array, incidentes 19-21/Mai). O validator (camada 2) pega na origem.
const asArray = (x: unknown): any[] => (Array.isArray(x) ? x : []);

// Numeração dos cards de candidato, derivada do `rank` do JSON.
//
// 🔴 POR QUE É UMA CONSTANTE SÓ (03/Set/2026): a lista de emojis vivia inline no
// bloco dos candidatos individuais e ia só até 4️⃣, enquanto o card do pelotão de
// trás trazia "4️⃣" escrito à mão. Ao entrar um quinto card, o inline devolvia
// `undefined` e o cabeçalho perdia o número SEM QUEBRAR NADA, e o card do pelotão
// passaria a repetir o 4️⃣ de outro candidato. Dois defeitos de etiqueta que
// nenhum portão de valor pega, porque o número não é dado, é rótulo.
// Sobra folga proposital: preencher até 8 não custa nada e evita a próxima
// edição do componente quando o painel ganhar mais um nome.
const RANK_EMOJI = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];

// Sub-blocos do card do pelotão de trás, um por nome.
//
// 🔴 POR QUE VIROU LISTA (03/Set/2026): o card se chama "Caiado / Haddad / Zema"
// e o JSX só montava DOIS deles, escritos à mão. O bloco `zema` existia no JSON,
// era reescrito pela rodada todo dia, era traduzido para os três idiomas e
// NUNCA aparecia na tela. Nenhum portão pega isso: o valor estava certo, o
// schema estava certo, e o defeito era de RENDER. Com a lista, acrescentar um
// nome é acrescentar uma linha aqui, e esquecer de montar deixa de ser possível.
//
// O `filter` existe para o caso inverso: sub-bloco ausente no JSON não vira
// coluna vazia, e a grade se ajusta sozinha.
const SUB_PELOTAO: Array<{ chave: 'caiado' | 'haddad' | 'zema'; emoji: string; cor: string }> = [
  { chave: 'caiado', emoji: '🔵', cor: '#6B7280' },
  { chave: 'haddad', emoji: '🔴', cor: '#DC2626' },
  { chave: 'zema', emoji: '🟠', cor: '#F59E0B' },
];

const PL_L: Record<string, { polls: string; survey: string; trend: string; secondRound: string; sources: string; respondents: string; defaultSources: string; rel: [string, string, string, string, string]; natIntro: string; natState: string; natHist: string; natHistApi: string }> = {
  'pt-BR': { polls: 'Pesquisas', survey: 'Pesquisa', trend: 'Tendência', secondRound: '2º Turno', sources: 'Fontes', respondents: 'entrevistados', defaultSources: 'Polymarket (ao vivo) + pesquisas Abr-Mai/2026', rel: ['Referência nacional', 'Alta confiabilidade', 'Confiável', 'Usar com cautela', 'Baixa confiabilidade'], natIntro: 'Mostramos pesquisas nacionais (1º e 2º turnos) mais recentes. Estaduais e análise integrada no', natState: 'AFOS Daily', natHist: '. Histórico completo via', natHistApi: 'API' },
  en: { polls: 'Polls', survey: 'Poll', trend: 'Trend', secondRound: 'Runoff', sources: 'Sources', respondents: 'respondents', defaultSources: 'Polymarket (live) + polls Apr-May/2026', rel: ['National reference', 'High reliability', 'Reliable', 'Use with caution', 'Low reliability'], natIntro: 'We show the most recent national polls (1st and 2nd round). State-level polls and integrated analysis in the', natState: 'AFOS Daily', natHist: '. Full history via', natHistApi: 'API' },
  es: { polls: 'Encuestas', survey: 'Encuesta', trend: 'Tendencia', secondRound: 'Balotaje', sources: 'Fuentes', respondents: 'encuestados', defaultSources: 'Polymarket (en vivo) + encuestas Abr-May/2026', rel: ['Referencia nacional', 'Alta fiabilidad', 'Fiable', 'Usar con cautela', 'Baja fiabilidad'], natIntro: 'Mostramos las encuestas nacionales (1ª y 2ª vuelta) más recientes. Estaduales y análisis integrado en el', natState: 'AFOS Daily', natHist: '. Historial completo vía', natHistApi: 'API' },
}

export function PollsSection({ polls, crit }: PollsSectionProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const pl = PL_L[locale] || PL_L['en'];
  if (!polls) return null;

  return (
    <section>
      <SectionTitle icon="📋" rightSlot={<LogicLink anchor="pesquisas" />}>{t('sections.polls')}</SectionTitle>

      {/* TABELA COMPARATIVA PESQUISAS VS POLYMARKET */}
      {polls?.polymarketComparison && (
        <Card className="mb-6 border-l-4 border-l-primary">
          <h3 className="font-bold text-sm text-primary mb-3">📊 {t('sections.pollsVsPolymarket')}</h3>
          {/* Desktop: tabela grid */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="grid grid-cols-5 gap-1 text-xs">
              <div className="font-bold text-gray-500 py-2">{t('sections.candidate')}</div>
              <div className="font-bold text-gray-500 py-2 text-center">{pl.polls}</div>
              <div className="font-bold text-gray-500 py-2 text-center">Polymarket</div>
              <div className="font-bold text-gray-500 py-2 text-center">{t('sections.tendPoll')}</div>
              <div className="font-bold text-gray-500 py-2 text-center">{t('sections.tendPoly')}</div>
              {asArray(polls.polymarketComparison.candidates).map((c, i) => (
                <div key={i} className="contents">
                  <div className="font-semibold py-1 border-t border-gray-100">{c.name}</div>
                  <div className="text-center py-1 border-t border-gray-100">{c.pesquisaRange}</div>
                  <div className="text-center py-1 border-t border-gray-100 font-bold text-primary">{c.polymarket}</div>
                  <div className="text-center py-1 border-t border-gray-100"><GlossaryText>{c.tendenciaPesquisa}</GlossaryText></div>
                  <div className="text-center py-1 border-t border-gray-100"><GlossaryText>{c.tendenciaPolymarket}</GlossaryText></div>
                </div>
              ))}
            </div>
          </div>
          {/* Mobile: cards empilhados */}
          <div className="sm:hidden space-y-2">
            {asArray(polls.polymarketComparison.candidates).map((c, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="font-semibold text-sm text-dark mb-1">{c.name}</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-gray-500">{t('sections.pollsLabel')}</span><span className="font-medium">{c.pesquisaRange}</span>
                  <span className="text-gray-500">Polymarket:</span><span className="font-bold text-primary">{c.polymarket}</span>
                  <span className="text-gray-500">{t('sections.tendPoll')}:</span><span><GlossaryText>{c.tendenciaPesquisa}</GlossaryText></span>
                  <span className="text-gray-500">{t('sections.tendPoly')}:</span><span><GlossaryText>{c.tendenciaPolymarket}</GlossaryText></span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2">{polls?.polymarketComparison?.sources ? `${pl.sources}: ${polls.polymarketComparison.sources}` : `${pl.sources}: ${pl.defaultSources}`}</p>
        </Card>
      )}

      {/* LISTA DE INSTITUTOS */}
      {polls?.institutes && polls.institutes.length > 0 && (
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
              <span><span className="text-primary">★★★★★</span> {pl.rel[0]}</span>
              <span><span className="text-primary">★★★★</span><span className="text-gray-300">★</span> {pl.rel[1]}</span>
              <span><span className="text-primary">★★★</span><span className="text-gray-300">★★</span> {pl.rel[2]}</span>
              <span><span className="text-primary">★★</span><span className="text-gray-300">★★★</span> {pl.rel[3]}</span>
              <span><span className="text-primary">★</span><span className="text-gray-300">★★★★</span> {pl.rel[4]}</span>
            </div>
            <div>{t('sections.updated')} {polls.lastUpdate}</div>
            <Link
              href={`/${locale}/how-it-works#criterios-institutos`}
              className="inline-flex items-center gap-1 text-gray-400 hover:text-primary hover:underline transition-colors"
              aria-label={`${t('sections.criteriaLink')}, ${t('sections.institutes')}`}
            >
              ⓘ {t('sections.criteriaLink')} →
            </Link>
          </div>
        </Card>
      )}

      {/* PESQUISAS POR INSTITUTO */}
      {/* Guardrail: filtra polls estaduais/regionais do dashboard. Memory: estaduais
          devem aparecer apenas no AFOS Daily. Detecta via 'note' contendo "estadual",
          "Cenário <UF>", ou nome de scenario com sufixo de UF. Polls sem note ou
          com escopo nacional explícito passam. */}
      {(() => {
        const isStatePoll = (p: Poll): boolean => {
          // O escopo e DADO, nao prosa. `scope` esta gravado na entrada, esta em
          // FORA_DE_TRADUCAO (scripts/build-locale-json.ts) e por isso vale igual
          // nos tres idiomas. Instalado 19/Ago/2026, depois que a heuristica abaixo
          // renderizou 18 pesquisas no pt-BR, 15 no EN e 19 no ES: ela le o `note`,
          // que chega TRADUZIDO, e cada idioma perdia entradas diferentes.
          if (p.scope) return p.scope === 'state'
          // Piso para entrada sem `scope`. A heuristica de texto fica so como rede.
          const noteRaw = p.note || ''
          const note = noteRaw.toLowerCase()
          // O `note` chega TRADUZIDO quando o locale é en/es (readLocalized em
          // lib/dashboard/static-data.ts), então procurar só "estadual" deixaria
          // a rede furada fora do pt-BR: uma estadual que o painel português
          // barra passaria no inglês. Instalado 25/Jul.
          //
          // ⚠️ `state` no SINGULAR, de propósito. O plural "states" aparece em
          // pesquisa NACIONAL ("across 27 states", 3 das 14 entradas de hoje),
          // e casá-lo sumiria com pesquisa nacional do painel, que é um erro
          // pior do que o buraco que a regra fecha. `estatal` sem \b no fim
          // cobre "estatales".
          if (/estadual|estatal|statewide|\bstate\b/.test(note)) return true
          // UF explícita em CAIXA ALTA (ex.: "Cenário SP"); testar no texto original evita
          // colisão com stopwords minúsculas do português (se/to/pa/ma/al) que abreviam UFs.
          // Fronteira UNICODE, nao \b: \b e ASCII, entao \bPR\b casava dentro de
          // "PROPRIO" (o O acentuado nao e word char) e \bTO\b casava a preposicao
          // inglesa "TO" escrita em caixa alta na enfase editorial.
          if (/(?<![\p{L}\p{N}])(MT|SP|RJ|MG|RS|PR|SC|BA|CE|PE|GO|AM|PA|MA|PI|AL|SE|RN|PB|TO|RO|RR|AP|AC|MS|ES|DF)(?![\p{L}\p{N}])/u.test(noteRaw)) {
            // O escape tem de cobrir os TRES idiomas: "nacional" nao existe em ingles
            // e o plural "nacionais" nao casa com includes('nacional').
            if (!/nacional|nacionais|national/.test(note)) return true
          }
          if (p.scenarios?.some((s: { name?: string }) => /\(.*[A-Z]{2}.*\)/.test(s.name || ''))) return true
          return false
        }
        const nationalPolls = (polls?.polls || []).filter(p => !isStatePoll(p))
        return nationalPolls.length > 0 && (
          <>
            <p className="text-xs text-gray-500 italic mb-3 px-1">
              📍 {pl.natIntro} <a href={`/${locale}/daily`} className="text-primary hover:underline">{pl.natState}</a>{pl.natHist} <a href="/api/polls/tse?days=30" className="text-primary hover:underline">{pl.natHistApi}</a>.
            </p>
            {nationalPolls.map((poll: Poll, pi: number) => (
      <div key={pi} className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600 bg-light-bg rounded-lg p-3">
        <span className="font-bold text-primary text-base">{poll.institute}</span>
        <span>📅 {poll.date}</span>
        <span>👥 {fmtMilhar(poll.sample, locale)} {pl.respondents}</span>
        <span>± {fmtDecimal(poll.margin, locale, 2).replace(/[.,]00$/, '')}pp</span>
        <span><Stars count={poll.reliability} /></span>
        <span className="text-xs text-gray-400">{poll.method}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {(Array.isArray(poll.scenarios) ? poll.scenarios : []).map((scenario: Scenario) => {
          const results = Array.isArray(scenario?.results) ? scenario.results : [];
          if (results.length === 0) return null;
          const maxP = Math.max(...results.map(r => r.percent ?? 0), 1);
          return (
            <Card key={scenario.name}>
              <h4 className="font-bold text-dark mb-3">{scenario.name}</h4>
              {results.map(r => (
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
        {(Array.isArray(poll.secondRound) ? poll.secondRound : []).map((sr: SecondRound) => (
          <Card key={sr.matchup}>
            <h4 className="font-semibold text-sm text-center mb-3 text-gray-600">{sr.matchup}</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-right text-sm font-bold" style={{ color: sr.percent1 > sr.percent2 ? '#0F52BA' : '#6B7280' }}>
                  {sr.candidate1}, {fmtDecimal(sr.percent1, locale, 1)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-1 overflow-hidden flex justify-end">
                  <div className="h-full rounded-full" style={{ width: `${sr.percent1}%`, backgroundColor: sr.percent1 > sr.percent2 ? '#0F52BA' : '#94A3B8' }} />
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">vs</span>
              <div className="flex-1">
                <div className="text-left text-sm font-bold" style={{ color: sr.percent2 > sr.percent1 ? '#DC2626' : '#6B7280' }}>
                  {sr.candidate2}, {fmtDecimal(sr.percent2, locale, 1)}%
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
          </>
        )
      })()}

      {/* ANÁLISE CRITERIOSA, dados via JSON externo */}
      {/* Gate exige Array.isArray (EVAL 06/Jun): `candidates?.length > 0` passava se candidates
          fosse um objeto/string com .length, e os `crit.candidates.filter(...)` abaixo quebravam. */}
      {crit && Array.isArray(crit.candidates) && crit.candidates.length > 0 && (
      <div className="mt-6 pt-6 border-t-2 border-primary/20">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <h3 className="text-xl font-bold text-dark flex items-center gap-2"><span>🔬</span> {t('sections.critAnalysis')}</h3>
        <LogicLink anchor="analise-criteriosa" />
      </div>
      <p className="text-xs text-gray-500 mb-4"><GlossaryText>{crit.subtitle}</GlossaryText></p>

      {/* CANDIDATOS INDIVIDUAIS (dinâmico via JSON) */}
      {crit.candidates.filter(c => !c.caiado).map(c => (
        <Card key={c.rank} className="mb-4 border-l-4" style={{ borderLeftColor: c.color }}>
          <h3 className="font-bold text-lg text-dark mb-1">{RANK_EMOJI[Number(c.rank) - 1]} <GlossaryText>{c.header}</GlossaryText></h3>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-700 text-sm mb-2">✅ {t('sections.strengths')}</h4>
              <ul className="text-xs text-gray-700 space-y-1.5">
                {asArray(c.fortes).map((f, i) => <li key={i}>• <GlossaryText>{f}</GlossaryText></li>)}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-700 text-sm mb-2">❌ {t('sections.weaknesses')}</h4>
              <ul className="text-xs text-gray-700 space-y-1.5">
                {asArray(c.fracos).map((f, i) => <li key={i}>• <GlossaryText>{f}</GlossaryText></li>)}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <p className="text-xs text-gray-700"><strong>🎯 {t('sections.analysisLabel')} ({crit.updatedAt?.slice(0,10)}):</strong> <GlossaryText>{c.analise}</GlossaryText></p>
          </div>
        </Card>
      ))}

      {/* PELOTÃO DE TRÁS (formato especial: um sub-bloco por nome) */}
      {crit.candidates.filter(c => c.caiado).map(c => (
        <Card key={c.rank} className="mb-4 border-l-4" style={{ borderLeftColor: c.color }}>
          <h3 className="font-bold text-lg text-dark mb-1">{RANK_EMOJI[Number(c.rank) - 1]} <GlossaryText>{c.header}</GlossaryText></h3>
          {c.subtitle && <p className="text-xs text-gray-500 mb-3"><GlossaryText>{c.subtitle}</GlossaryText></p>}
          <div className="grid gap-4 mt-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUB_PELOTAO.filter(s => c[s.chave]).map(s => (
              <div key={s.chave}>
                <h4 className="font-bold text-sm mb-2" style={{ color: s.cor }}>{s.emoji} <GlossaryText>{c[s.chave]?.label}</GlossaryText></h4>
                <div className="bg-green-50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-gray-700"><strong className="text-green-700">{t('sections.strengths')}:</strong> <GlossaryText>{c[s.chave]?.fortes}</GlossaryText></p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-700"><strong className="text-red-700">{t('sections.weaknesses')}:</strong> <GlossaryText>{c[s.chave]?.fracos}</GlossaryText></p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <p className="text-xs text-gray-700"><strong>🎯 {t('sections.analysisLabel')} ({crit.updatedAt?.slice(0,10)}):</strong> <GlossaryText>{c.analise}</GlossaryText></p>
          </div>
        </Card>
      ))}

      {/* QUADRO COMPARATIVO (dinâmico via JSON) */}
      <Card className="border-l-4 border-l-primary">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <h3 className="font-bold text-sm text-primary">📊 {t('sections.comparativeTable')}</h3>
          <LogicLink anchor="quadro-comparativo" />
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <div className="grid grid-cols-5 gap-2 text-xs">
            <div className="font-bold text-gray-500 py-2">{t('sections.candidate')}</div>
            <div className="font-bold text-gray-500 py-2 text-center">{pl.survey}</div>
            <div className="font-bold text-gray-500 py-2 text-center">Polymarket</div>
            <div className="font-bold text-gray-500 py-2 text-center">{pl.trend}</div>
            <div className="font-bold text-gray-500 py-2 text-center">{t('sections.secondRoundVsLula')}</div>
            {asArray(crit.quadroComparativo).map((r, i) => (
              <div key={i} className="contents">
                <div className="font-semibold py-1 border-t border-gray-100">{r.n}</div>
                <div className="text-center py-1 border-t border-gray-100" style={{color: r.pc || undefined, fontWeight: r.pc ? 700 : undefined}}><GlossaryText>{r.p}</GlossaryText></div>
                <div className="text-center py-1 border-t border-gray-100" style={{color: r.mc || undefined, fontWeight: r.mc ? 700 : undefined}}>{r.m}</div>
                <div className="text-center py-1 border-t border-gray-100"><GlossaryText>{r.t}</GlossaryText></div>
                <div className="text-center py-1 border-t border-gray-100" style={{color: r.mc || undefined, fontWeight: r.mc ? 700 : undefined}}><GlossaryText>{r.s}</GlossaryText></div>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:hidden space-y-2">
          {asArray(crit.quadroComparativo).map((r, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="font-semibold text-sm mb-1">{r.n}</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span className="text-gray-500">{pl.survey}:</span><span className="font-medium"><GlossaryText>{r.p}</GlossaryText></span>
                <span className="text-gray-500">Polymarket:</span><span className="font-bold text-primary">{r.m}</span>
                <span className="text-gray-500">{pl.trend}:</span><span><GlossaryText>{r.t}</GlossaryText></span>
                <span className="text-gray-500">{pl.secondRound}:</span><span><GlossaryText>{r.s}</GlossaryText></span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <p className="text-xs text-primary font-semibold">📌 <GlossaryText>{crit.cruzamento}</GlossaryText></p>
        </div>
      </Card>
      </div>
      )}
    </section>
  );
}
