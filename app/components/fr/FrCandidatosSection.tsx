'use client'

import { useTranslation } from '../../i18n/context'
import { SectionTitle, Card } from '../ui'
import { fmtDecimal } from '../../../lib/i18n/numero'
import { fatosMedidos, selecionarAnalise, selecionarPerfis, type EstatCandidato, type Fato, type Medidas } from '../../../lib/fr/candidatos'

/**
 * Candidatos do painel da FRANÇA: PERFIL (8), ANÁLISE CRITERIOSA (4 primeiros de
 * cada lado da medição) e CLIMA POLÍTICO por bloco. Criado 08/Nov/2026.
 *
 * Regras de quem entra e de cada fato em `lib/fr/candidatos.ts`. Texto
 * editorial (cargo, candidatura, leituras, clima) vem de
 * `public/fr/candidatos.{locale}.json`, escrito e traduzido pelo /atualizar-fra.
 * Os números vêm da medição da hora: nada de número digitado em JSON.
 *
 * ⛔ Bloco político = grade OFICIAL do Ministério do Interior francês, aplicada
 * ao partido. O AFOS não classifica candidato.
 */

export interface FrPerfil {
  partido: string
  nuance: string | null
  bloco: string | null
  nuanceInferida: boolean
  nascimento: string
  cargo: string
  candidatura: string
  fontes: { rotulo: string; url: string }[]
}

export interface FrCandidatos {
  updatedAt: string
  grade: { nota: string; fontes: { rotulo: string; url: string }[]; notaInferida: string }
  blocos: Record<string, string>
  perfis: Record<string, FrPerfil>
  leituras: Record<string, string>
  clima: Record<string, string>
}

const T = {
  'pt-BR': {
    perfil: 'Perfil dos candidatos',
    perfilNota: 'Os 8 nomes com mais de 5 pontos no mercado de vitória ou na média das pesquisas, pelo maior dos dois.',
    anos: (n: number) => `${n} anos`,
    vencer: 'Vencer (Polymarket)',
    kalshi: 'Vencer (Kalshi)',
    media: (l: number) => `Média nas pesquisas (${l} listas)`,
    semPesquisa: 'não testado nas pesquisas',
    cedula: 'Estar na cédula (Polymarket)',
    candidatura: 'Candidatura:',
    fontes: 'Fontes:',
    analise: 'Análise criteriosa, os primeiros colocados',
    analiseNota: 'Entra quem está entre os 4 primeiros em qualquer um dos dois lados da medição: média das pesquisas ou contrato "vai ao 2º turno". Os fatos são contagens desta rodada (listas e duelos dos últimos 45 dias; a média do perfil usa 30), com a mesma régua para todos, sobre a pergunta da eleição em dois turnos: chegar ao 2º turno.',
    soPesquisa: 'entra pelas pesquisas, não pelo mercado',
    soMercado: 'entra pelo mercado, não pelas pesquisas',
    aFavor: 'A favor, na medição',
    contra: 'Contra, na medição',
    nada: 'nenhum fato medido nesta régua',
    clima: 'Clima político, por bloco',
    climaNota: 'Os candidatos agrupados pelo bloco que a grade oficial atribui ao partido de cada um.',
    semBloco: 'Sem bloco na grade',
    leitura: 'Leitura AFOS:',
  },
  en: {
    perfil: 'Candidate profiles',
    perfilNota: 'The 8 names above 5 points in the win market or in the poll average, by the higher of the two.',
    anos: (n: number) => `age ${n}`,
    vencer: 'Win (Polymarket)',
    kalshi: 'Win (Kalshi)',
    media: (l: number) => `Poll average (${l} lists)`,
    semPesquisa: 'not tested in polls',
    cedula: 'On the ballot (Polymarket)',
    candidatura: 'Candidacy:',
    fontes: 'Sources:',
    analise: 'In-depth analysis, the front-runners',
    analiseNota: 'Included: anyone in the top 4 on either side of the measurement, the poll average or the "advances to the runoff" contract. The facts are counts from this reading (lists and matchups of the past 45 days; the profile average uses 30), with the same yardstick for everyone, on the question a two-round election asks: reaching the runoff.',
    soPesquisa: 'included by the polls, not the market',
    soMercado: 'included by the market, not the polls',
    aFavor: 'For, in the measurement',
    contra: 'Against, in the measurement',
    nada: 'no measured fact on this yardstick',
    clima: 'Political climate, by bloc',
    climaNota: 'Candidates grouped by the bloc the official grid assigns to each one’s party.',
    semBloco: 'No bloc in the grid',
    leitura: 'AFOS reading:',
  },
  es: {
    perfil: 'Perfil de los candidatos',
    perfilNota: 'Los 8 nombres con más de 5 puntos en el mercado de victoria o en el promedio de encuestas, por el mayor de los dos.',
    anos: (n: number) => `${n} años`,
    vencer: 'Ganar (Polymarket)',
    kalshi: 'Ganar (Kalshi)',
    media: (l: number) => `Promedio en encuestas (${l} listas)`,
    semPesquisa: 'no medido en encuestas',
    cedula: 'Estar en la papeleta (Polymarket)',
    candidatura: 'Candidatura:',
    fontes: 'Fuentes:',
    analise: 'Análisis detallado, los primeros lugares',
    analiseNota: 'Entra quien está entre los 4 primeros en cualquiera de los dos lados de la medición: promedio de encuestas o contrato "pasa a la 2ª vuelta". Los hechos son conteos de esta lectura (listas y duelos de los últimos 45 días; el promedio del perfil usa 30), con la misma vara para todos, sobre la pregunta de una elección a dos vueltas: llegar a la 2ª vuelta.',
    soPesquisa: 'entra por las encuestas, no por el mercado',
    soMercado: 'entra por el mercado, no por las encuestas',
    aFavor: 'A favor, en la medición',
    contra: 'En contra, en la medición',
    nada: 'ningún hecho medido con esta vara',
    clima: 'Clima político, por bloque',
    climaNota: 'Los candidatos agrupados por el bloque que la grilla oficial asigna al partido de cada uno.',
    semBloco: 'Sin bloque en la grilla',
    leitura: 'Lectura AFOS:',
  },
}

type K = keyof typeof T

/** O texto de cada fato medido, nos 3 idiomas. Mesma régua para todos. */
function textoFato(f: Fato, k: K, loc: string): string {
  const d = (v: number) => fmtDecimal(v, loc, 2)
  const P = { 'pt-BR': 'º', en: '', es: 'º' }[k]
  const ord = (n: number) => (k === 'en' ? `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}` : `${n}${P}`)
  switch (f.tipo) {
    case 'primeiro': return { 'pt-BR': `1º em ${f.x} de ${f.y} listas de 1º turno`, en: `1st in ${f.x} of ${f.y} first-round lists`, es: `1º en ${f.x} de ${f.y} listas de 1ª vuelta` }[k]
    case 'top2': return { 'pt-BR': `Entre os 2 primeiros em ${f.x} de ${f.y} listas`, en: `In the top 2 in ${f.x} of ${f.y} lists`, es: `Entre los 2 primeros en ${f.x} de ${f.y} listas` }[k]
    case 'foraTop2': return { 'pt-BR': `Fora dos 2 primeiros em ${f.x} de ${f.y} listas`, en: `Outside the top 2 in ${f.x} of ${f.y} lists`, es: `Fuera de los 2 primeros en ${f.x} de ${f.y} listas` }[k]
    case 'duelosVence': return { 'pt-BR': `À frente em ${f.x} de ${f.y} duelos de 2º turno testados`, en: `Ahead in ${f.x} of ${f.y} runoff matchups tested`, es: `Adelante en ${f.x} de ${f.y} duelos de 2ª vuelta probados` }[k]
    case 'duelosPerde': return { 'pt-BR': `Atrás em ${f.x} de ${f.y} duelos de 2º turno testados`, en: `Behind in ${f.x} of ${f.y} runoff matchups tested`, es: `Atrás en ${f.x} de ${f.y} duelos de 2ª vuelta probados` }[k]
    case 'semDuelo': return { 'pt-BR': 'Nenhum duelo de 2º turno testado com o nome', en: 'No runoff matchup tested with this name', es: 'Ningún duelo de 2ª vuelta probado con el nombre' }[k]
    case 'segundoTurnoAlto': return { 'pt-BR': `Mercado paga ${d(f.v)} para ir ao 2º turno`, en: `Market pays ${d(f.v)} on reaching the runoff`, es: `El mercado paga ${d(f.v)} por pasar a la 2ª vuelta` }[k]
    case 'segundoTurnoBaixo': return { 'pt-BR': `Mercado paga ${d(f.v)} para ir ao 2º turno`, en: `Market pays ${d(f.v)} on reaching the runoff`, es: `El mercado paga ${d(f.v)} por pasar a la 2ª vuelta` }[k]
    case 'cedula': return { 'pt-BR': `Mercado paga ${d(f.v)} para estar na cédula`, en: `Market pays ${d(f.v)} on being on the ballot`, es: `El mercado paga ${d(f.v)} por estar en la papeleta` }[k]
    case 'posMedia': return { 'pt-BR': `${ord(f.pos)} na média das pesquisas`, en: `${ord(f.pos)} in the poll average`, es: `${ord(f.pos)} en el promedio de encuestas` }[k]
    case 'posVencer': return { 'pt-BR': `${ord(f.pos)} no mercado de vitória`, en: `${ord(f.pos)} in the win market`, es: `${ord(f.pos)} en el mercado de victoria` }[k]
  }
}

function idade(nasc: string, agora: Date): number {
  const [a, m, d] = nasc.split('-').map(Number)
  let i = agora.getUTCFullYear() - a
  if (agora.getUTCMonth() + 1 < m || (agora.getUTCMonth() + 1 === m && agora.getUTCDate() < d)) i--
  return i
}

function Numero({ rotulo, valor, loc }: { rotulo: string; valor: number | undefined; loc: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 text-center">
      <div className="text-[11px] text-gray-500">{rotulo}</div>
      <div className="text-lg font-bold tabular-nums text-primary">{valor !== undefined ? fmtDecimal(valor, loc, 2) : '–'}</div>
    </div>
  )
}

export function FrCandidatosSection({
  dados, medidas, estat, kalshi, agora,
}: {
  dados: FrCandidatos | null
  medidas: ReadonlyMap<string, Medidas>
  estat: readonly EstatCandidato[]
  /** preço da Kalshi por nome, SÓ quando a prontidão está pronta */
  kalshi: ReadonlyMap<string, number> | null
  agora: Date
}) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as K
  const t = T[k]
  if (!dados || medidas.size === 0) return null

  const perfis = selecionarPerfis(medidas).filter((n) => dados.perfis[n])
  const analise = selecionarAnalise(medidas)

  // Clima: os candidatos do perfil e da análise, por bloco da grade oficial.
  const doClima = [...new Set([...perfis, ...analise.nomes])].filter((n) => dados.perfis[n])
  const ordemBlocos = ['EXG', 'GAU', 'DIV', 'CENT', 'DTE', 'EXD']
  const porBloco = new Map<string, string[]>()
  for (const n of doClima) {
    const b = dados.perfis[n].bloco ?? 'SEM'
    porBloco.set(b, [...(porBloco.get(b) ?? []), n])
  }

  return (
    <>
      <section id="sec-candidatos" className="scroll-mt-20">
        <SectionTitle>{t.perfil}</SectionTitle>
        <p className="-mt-2 mb-3 text-xs text-gray-500">{t.perfilNota}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {perfis.map((n) => {
            const p = dados.perfis[n]
            const m = medidas.get(n) ?? {}
            return (
              <Card key={n} className="!p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold text-dark">{n}</h3>
                  {p.partido && <span className="rounded bg-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-700">{p.partido}</span>}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{p.cargo} · {t.anos(idade(p.nascimento, agora))}</p>
                <div className={`mt-3 grid gap-2 ${kalshi ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  <Numero rotulo={t.vencer} valor={m.vencer} loc={locale} />
                  {kalshi && <Numero rotulo={t.kalshi} valor={kalshi.get(n)} loc={locale} />}
                  <Numero rotulo={m.listasMedia ? t.media(m.listasMedia) : t.semPesquisa} valor={m.media} loc={locale} />
                  <Numero rotulo={t.cedula} valor={m.cedula} loc={locale} />
                </div>
                <p className="mt-3 text-[13px] leading-snug text-gray-700"><span className="font-semibold">{t.candidatura}</span> {p.candidatura}</p>
                <p className="mt-2 text-[11px] text-gray-500">
                  {t.fontes}{' '}
                  {p.fontes.map((f, i) => (
                    <span key={f.url}>{i > 0 ? ' · ' : ''}<a href={f.url} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">{f.rotulo} ↗</a></span>
                  ))}
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      <section id="sec-analise" className="scroll-mt-20">
        <SectionTitle>{t.analise}</SectionTitle>
        <p className="-mt-2 mb-3 text-xs text-gray-500">{t.analiseNota}</p>
        <div className="space-y-4">
          {analise.nomes.map((n) => {
            const f = fatosMedidos(estat.find((e) => e.candidato === n), medidas.get(n) ?? {})
            const leitura = dados.leituras[n]
            return (
              <Card key={n} className="!p-5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-lg font-bold text-dark">{n}</h3>
                  {analise.soPesquisa.includes(n) && <span className="text-[11px] text-gray-500">· {t.soPesquisa}</span>}
                  {analise.soMercado.includes(n) && <span className="text-[11px] text-gray-500">· {t.soMercado}</span>}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-800">{t.aFavor}</p>
                    {f.aFavor.length ? <ul className="list-disc space-y-0.5 pl-4 text-[13px] text-gray-800">{f.aFavor.map((x, i) => <li key={i}>{textoFato(x, k, locale)}</li>)}</ul> : <p className="text-[13px] text-gray-500">{t.nada}</p>}
                  </div>
                  <div className="rounded-lg border border-rose-100 bg-rose-50 p-3">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-rose-800">{t.contra}</p>
                    {f.contra.length ? <ul className="list-disc space-y-0.5 pl-4 text-[13px] text-gray-800">{f.contra.map((x, i) => <li key={i}>{textoFato(x, k, locale)}</li>)}</ul> : <p className="text-[13px] text-gray-500">{t.nada}</p>}
                  </div>
                </div>
                {leitura && <p className="mt-3 text-[13px] leading-relaxed text-gray-700"><span className="font-semibold">{t.leitura}</span> {leitura}</p>}
              </Card>
            )
          })}
        </div>
      </section>

      <section id="sec-clima" className="scroll-mt-20">
        <SectionTitle>{t.clima}</SectionTitle>
        <p className="-mt-2 mb-3 text-xs text-gray-500">{t.climaNota}</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...ordemBlocos, 'SEM'].filter((b) => porBloco.has(b)).map((b) => (
            <Card key={b} className="!p-5">
              <h3 className="text-base font-bold text-primary">{b === 'SEM' ? t.semBloco : dados.blocos[b]}</h3>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                {(porBloco.get(b) ?? []).map((n) => {
                  const m = medidas.get(n) ?? {}
                  const p = dados.perfis[n]
                  return (
                    <li key={n}>
                      <span className="font-semibold text-dark">{n}</span>
                      <span className="text-gray-500"> · {p.nuance ?? '–'}{p.nuanceInferida ? '*' : ''}</span>
                      <div className="text-[12px] text-gray-600">
                        {t.vencer}: {m.vencer !== undefined ? fmtDecimal(m.vencer, locale, 2) : '–'} · {m.listasMedia ? `${t.media(m.listasMedia)}: ${fmtDecimal(m.media as number, locale, 1)}` : t.semPesquisa}
                      </div>
                    </li>
                  )
                })}
              </ul>
              {dados.clima[b] && <p className="mt-3 text-[13px] leading-relaxed text-gray-700">{dados.clima[b]}</p>}
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-gray-500">
          {dados.grade.nota} {doClima.some((n) => dados.perfis[n].nuanceInferida) ? `* ${dados.grade.notaInferida}` : ''}{' '}
          {dados.grade.fontes.map((f, i) => (
            <span key={f.url}>{i > 0 ? ' · ' : ''}<a href={f.url} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">{f.rotulo} ↗</a></span>
          ))}
        </p>
      </section>
    </>
  )
}
