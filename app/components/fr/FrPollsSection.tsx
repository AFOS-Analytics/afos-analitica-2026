'use client'

import { useTranslation } from '../../i18n/context'
import { SectionTitle, Card } from '../ui'
import { fmtDecimal, fmtMilhar } from '../../../lib/i18n/numero'
import type { Duelo, ListaPrincipal, MediaCandidato } from '../../../lib/fr/painel'

/**
 * Pesquisas do painel da FRANÇA. Decisão do André (08/Nov/2026): (a) a lista
 * principal de cada instituto e (b) a média por candidato ao lado, rotulada
 * como média de LISTAS DIFERENTES. Regras de cálculo em `lib/fr/painel.ts`.
 *
 * Cada número tem a ficha oficial da Commission des sondages ao lado, com link:
 * é a procedência que a lei francesa obriga e que o coletor conferiu.
 */

const T = {
  'pt-BR': {
    titulo1: '1º turno: intenção de voto',
    principal: 'Lista principal de cada instituto',
    principalNota: 'Cada instituto testa várias listas de candidatos na mesma rodada. Aqui está a primeira lista que ele publicou, na rodada mais recente dos últimos 45 dias.',
    media: 'Média por candidato',
    mediaNota: (dias: number) => `Média de todas as listas dos últimos ${dias} dias em que o candidato aparece. As listas têm candidatos diferentes, então a média é o centro do que foi medido, não uma previsão. Quanto menos listas, menos ela pesa.`,
    colCand: 'Candidato',
    colMedia: 'Média',
    colListas: 'Listas',
    colInst: 'Institutos',
    campo: (a: string, b: string) => `campo ${a} a ${b}`,
    amostra: (n: string) => `${n} entrevistados`,
    listas: (n: number) => (n === 1 ? '1 lista nesta rodada' : `${n} listas nesta rodada`),
    ficha: (n: string) => `ficha oficial ${n} ↗`,
    confira: 'Confira você mesmo:',
    listagem: 'todas as fichas da presidencial na Commission des sondages ↗',
    base: 'base aberta com cada lista (CSV) ↗',
    titulo2: '2º turno: duelos testados',
    duelosNota: 'A rodada mais recente de cada instituto, nos últimos 45 dias.',
    transparencia: 'Conferência com as fichas oficiais',
    conferidas: (pub: number, tot: number) => `${pub} de ${tot} listas da base aberta conferem com a ficha oficial que citam e entram nesta tela.`,
    diverge: 'Fora da tela porque a ficha citada não confere:',
    divergeItem: (inst: string, d: string, n: string) => `${inst}, campo até ${d}: a base cita a ficha ${n}, que na Commission é de outra pesquisa.`,
    pendentes: 'Fichas oficiais de intenção de voto que a base ainda não estruturou:',
    fonte: 'Base: MieuxVoter/presidentielle2027 (licença MIT), conferida contra a listagem da Commission des sondages.',
    vazio: 'Ainda não há pesquisa conferida nesta janela.',
    indisponivel: 'Não foi possível ler as pesquisas agora. Isto é falha de leitura, não ausência de pesquisa.',
    lido: (d: string) => `Coletado em ${d}`,
  },
  en: {
    titulo1: 'First round: voting intention',
    principal: 'Main list of each pollster',
    principalNota: 'Each pollster tests several candidate lists in the same wave. Shown here is the first list it published, in its latest wave of the past 45 days.',
    media: 'Average by candidate',
    mediaNota: (dias: number) => `Average of every list from the past ${dias} days in which the candidate appears. The lists have different candidates, so the average is the centre of what was measured, not a forecast. The fewer the lists, the less it weighs.`,
    colCand: 'Candidate',
    colMedia: 'Average',
    colListas: 'Lists',
    colInst: 'Pollsters',
    campo: (a: string, b: string) => `fieldwork ${a} to ${b}`,
    amostra: (n: string) => `${n} respondents`,
    listas: (n: number) => (n === 1 ? '1 list in this wave' : `${n} lists in this wave`),
    ficha: (n: string) => `official notice ${n} ↗`,
    confira: 'Check it yourself:',
    listagem: 'every presidential notice at the Commission des sondages ↗',
    base: 'open database with every list (CSV) ↗',
    titulo2: 'Runoff: matchups tested',
    duelosNota: 'Each pollster’s latest wave in the past 45 days.',
    transparencia: 'Check against the official notices',
    conferidas: (pub: number, tot: number) => `${pub} of ${tot} lists in the open database match the official notice they cite and are shown here.`,
    diverge: 'Kept off screen because the cited notice does not match:',
    divergeItem: (inst: string, d: string, n: string) => `${inst}, fieldwork to ${d}: the database cites notice ${n}, which at the Commission belongs to another poll.`,
    pendentes: 'Official voting-intention notices the database has not structured yet:',
    fonte: 'Database: MieuxVoter/presidentielle2027 (MIT licence), checked against the Commission des sondages listing.',
    vazio: 'No checked poll in this window yet.',
    indisponivel: 'The polls could not be read right now. This is a read failure, not an absence of polls.',
    lido: (d: string) => `Collected on ${d}`,
  },
  es: {
    titulo1: '1ª vuelta: intención de voto',
    principal: 'Lista principal de cada encuestadora',
    principalNota: 'Cada encuestadora prueba varias listas de candidatos en la misma ronda. Aquí está la primera lista que publicó, en su ronda más reciente de los últimos 45 días.',
    media: 'Promedio por candidato',
    mediaNota: (dias: number) => `Promedio de todas las listas de los últimos ${dias} días en las que aparece el candidato. Las listas tienen candidatos distintos, así que el promedio es el centro de lo medido, no un pronóstico. Cuantas menos listas, menos pesa.`,
    colCand: 'Candidato',
    colMedia: 'Promedio',
    colListas: 'Listas',
    colInst: 'Encuestadoras',
    campo: (a: string, b: string) => `campo ${a} a ${b}`,
    amostra: (n: string) => `${n} entrevistados`,
    listas: (n: number) => (n === 1 ? '1 lista en esta ronda' : `${n} listas en esta ronda`),
    ficha: (n: string) => `ficha oficial ${n} ↗`,
    confira: 'Compruébelo usted mismo:',
    listagem: 'todas las fichas de la presidencial en la Commission des sondages ↗',
    base: 'base abierta con cada lista (CSV) ↗',
    titulo2: '2ª vuelta: duelos probados',
    duelosNota: 'La ronda más reciente de cada encuestadora, en los últimos 45 días.',
    transparencia: 'Cotejo con las fichas oficiales',
    conferidas: (pub: number, tot: number) => `${pub} de ${tot} listas de la base abierta coinciden con la ficha oficial que citan y entran en esta pantalla.`,
    diverge: 'Fuera de la pantalla porque la ficha citada no coincide:',
    divergeItem: (inst: string, d: string, n: string) => `${inst}, campo hasta ${d}: la base cita la ficha ${n}, que en la Commission es de otra encuesta.`,
    pendentes: 'Fichas oficiales de intención de voto que la base aún no estructuró:',
    fonte: 'Base: MieuxVoter/presidentielle2027 (licencia MIT), cotejada con el listado de la Commission des sondages.',
    vazio: 'Aún no hay encuesta cotejada en esta ventana.',
    indisponivel: 'No fue posible leer las encuestas ahora. Es una falla de lectura, no ausencia de encuestas.',
    lido: (d: string) => `Recolectado el ${d}`,
  },
}

function dm(iso: string, locale: string): string {
  const [, m, d] = iso.slice(0, 10).split('-')
  return locale === 'en' ? `${m}/${d}` : `${d}/${m}`
}

export interface FrPollsView {
  estado: 'ok' | 'vazio' | 'indisponivel'
  principais: ListaPrincipal[]
  medias: MediaCandidato[]
  diasDaMedia: number
  /** rodadas de pesquisa (instituto + campo) que entram na média; é o que o nó do grafo conta */
  rodadasDaMedia: number
  duelos: Duelo[]
  publicaveis: number
  total: number
  divergencias: { instituto: string; fim: string; numero: string | null }[]
  pendentes: { numero: string; rotulo: string; url: string }[]
  fetchedAt: string | null
}

export function FrPollsSection({ v }: { v: FrPollsView }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]

  if (v.estado !== 'ok') {
    return (
      <section>
        <SectionTitle>{t.titulo1}</SectionTitle>
        <Card><p className="text-sm text-gray-600">{v.estado === 'vazio' ? t.vazio : t.indisponivel}</p></Card>
      </section>
    )
  }

  // Divergência aparece UMA vez por ficha, não uma por lista.
  const divPorFicha = new Map<string, (typeof v.divergencias)[number]>()
  for (const d of v.divergencias) divPorFicha.set(`${d.instituto}|${d.numero}|${d.fim}`, d)

  return (
    <>
      <section>
        <SectionTitle>{t.titulo1}</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-dark">{t.principal}</h3>
            <p className="mt-1 mb-3 text-[11px] leading-snug text-gray-500">{t.principalNota}</p>
            {v.principais.length === 0 ? (
              <p className="text-sm text-gray-600">{t.vazio}</p>
            ) : (
              <ul className="space-y-4">
                {v.principais.map((p) => (
                  <li key={`${p.instituto}-${p.campo.fim}`}>
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="font-semibold text-dark">{p.instituto}</span>
                      <span className="text-gray-500">{p.cliente}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {t.campo(dm(p.campo.inicio, locale), dm(p.campo.fim, locale))}
                      {p.amostra ? ` · ${t.amostra(fmtMilhar(p.amostra, locale))}` : ''} · {t.listas(p.listasNaRodada)}
                      {p.ficha.numero && p.ficha.url ? (
                        <> · <a href={p.ficha.url} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid">{t.ficha(p.ficha.numero)}</a></>
                      ) : null}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {p.intencoes.slice(0, 7).map((i) => (
                        <span key={i.candidato} className="whitespace-nowrap">
                          <span className="text-gray-600">{i.candidato}</span>{' '}
                          <span className="tabular-nums font-medium text-dark">{fmtDecimal(i.pct, locale, 1)}</span>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-dark">{t.media}</h3>
            <p className="mt-1 mb-3 text-[11px] leading-snug text-gray-500">{t.mediaNota(v.diasDaMedia)}</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="py-1 pr-2 font-semibold">{t.colCand}</th>
                  <th className="py-1 px-2 font-semibold text-right">{t.colMedia}</th>
                  <th className="py-1 px-2 font-semibold text-right">{t.colListas}</th>
                  <th className="py-1 pl-2 font-semibold text-right">{t.colInst}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border">
                {v.medias.slice(0, 12).map((m) => (
                  <tr key={m.candidato}>
                    <td className="py-1 pr-2 text-dark">{m.candidato}</td>
                    <td className="py-1 px-2 text-right tabular-nums font-medium">{fmtDecimal(m.media, locale, 1)}</td>
                    <td className="py-1 px-2 text-right tabular-nums text-gray-600">{m.listas}</td>
                    <td className="py-1 pl-2 text-right tabular-nums text-gray-600">{m.institutos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle>{t.titulo2}</SectionTitle>
        <Card>
          <p className="mb-3 text-[11px] leading-snug text-gray-500">{t.duelosNota}</p>
          {v.duelos.length === 0 ? (
            <p className="text-sm text-gray-600">{t.vazio}</p>
          ) : (
            <ul className="divide-y divide-light-border text-sm">
              {v.duelos.map((d, i) => (
                <li key={`${d.instituto}-${d.fim}-${i}`} className="flex flex-wrap items-baseline justify-between gap-2 py-1.5">
                  <span className="text-dark">
                    {d.a.candidato} <span className="tabular-nums font-medium">{fmtDecimal(d.a.pct, locale, 1)}</span>
                    <span className="text-gray-400"> × </span>
                    <span className="tabular-nums font-medium">{fmtDecimal(d.b.pct, locale, 1)}</span> {d.b.candidato}
                  </span>
                  <span className="text-[11px] text-gray-500">{d.instituto} · {dm(d.fim, locale)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold text-dark mb-1">{t.transparencia}</h3>
          <p className="text-[12px] text-gray-600">{t.conferidas(v.publicaveis, v.total)}</p>
          {divPorFicha.size > 0 && (
            <div className="mt-2">
              <p className="text-[12px] text-gray-600">{t.diverge}</p>
              <ul className="mt-1 list-disc pl-5 text-[11px] text-gray-500">
                {[...divPorFicha.values()].slice(0, 8).map((d) => (
                  <li key={`${d.instituto}-${d.numero}-${d.fim}`}>{t.divergeItem(d.instituto, dm(d.fim, locale), d.numero ?? '?')}</li>
                ))}
              </ul>
            </div>
          )}
          {v.pendentes.length > 0 && (
            <div className="mt-2">
              <p className="text-[12px] text-gray-600">{t.pendentes}</p>
              <ul className="mt-1 list-disc pl-5 text-[11px] text-gray-500">
                {v.pendentes.map((p) => (
                  <li key={p.numero}><a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">{p.rotulo}</a></li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 border-t border-light-border pt-2 text-[11px] text-gray-500">
            {t.fonte}{v.fetchedAt ? ` ${t.lido(dm(v.fetchedAt, locale))}.` : ''}{' '}
            {t.confira}{' '}
            <a href="https://www.commission-des-sondages.fr/notices/medias/fichiers/bytag/14/2027-Presidentielle" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">{t.listagem}</a>{' · '}
            <a href="https://github.com/MieuxVoter/presidentielle2027/blob/main/presidentielle2027.csv" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">{t.base}</a>
          </p>
        </Card>
      </section>
    </>
  )
}
