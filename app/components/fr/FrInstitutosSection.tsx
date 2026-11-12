'use client'

import { useTranslation } from '../../i18n/context'
import { SectionTitle, Card } from '../ui'
import { fmtDecimal, fmtMilhar } from '../../../lib/i18n/numero'
import type { EstatInstituto } from '../../../lib/fr/painel'

/**
 * Institutos monitorados, França. Decisão do André (08/Nov/2026): TABELA DE
 * MEDIÇÃO, sem estrelas. Nada aqui é nota do AFOS:
 *  - o que cada instituto fez neste ciclo (calculado da coleta conferida);
 *  - quanto errou no 1º turno de 2022 (última pesquisa antes do silêncio
 *    eleitoral contra o resultado oficial);
 *  - as ações formais da Commission des sondages de 2021 a 2026.
 * Ordem por atividade no ciclo, nunca por erro (seria ranking de qualidade).
 * Dados de 2022 e ações: public/fr/institutos.json, com as fontes.
 */

interface Em2022 { nome: string; campoFim: string; amostra: number; rolling: boolean; erroMedio: number; erroLePen: number; erroMelenchon: number; erroMacron: number }
interface Acao { data: string; tipo: 'miseAuPoint' | 'avertissement'; eleicao: string; motivo: string; superadaEm?: string; url: string }
export interface FrInstitutos {
  fontes: Record<string, { rotulo: string; url: string }>
  institutos: Record<string, { nome: string; em2022: Em2022[]; nota2022?: string }>
  acoes: Record<string, Acao[]>
}

const T = {
  'pt-BR': {
    titulo: 'Institutos monitorados, medidos',
    nota: 'Sem nota nem estrela: o que cada instituto fez neste ciclo, quanto errou no 1º turno de 2022 e as ações formais da Commission des sondages de 2021 a 2026. Ordem pelo número de rodadas no ciclo.',
    colInst: 'Instituto', colRod: 'Rodadas no ciclo', colAm: 'Amostra típica', colUlt: 'Última rodada', colCli: 'Para quem',
    colErro: 'Erro médio em 2022', colLp: 'Le Pen 2022', colJlm: 'Mélenchon 2022', colCom: 'Commission 2021-2026',
    nenhuma: 'nenhuma',
    sem2022: 'sem pesquisa em 2022 nesta base',
    mise: 'correção', avert: 'aviso', superada: (d: string) => `superada em ${d}`,
    motivo: { representatividade: 'representatividade da amostra', apresentacao: 'mudou a apresentação entre rodadas', metodoDeclarado: 'método declarado e não usado' } as Record<string, string>,
    eleicao: { presidentielle2022: 'presidencial 2022', legislatives2024: 'legislativas 2024', europeennes2024: 'europeias 2024' } as Record<string, string>,
    nota2022: { harris: 'Em 2022, "Harris Interactive".', ipsosbva: 'Em 2022, Ipsos e BVA eram institutos separados: os dois aparecem.', yougov: 'A última pesquisa completa do YouGov em 2022 é de 31/03, uma semana antes das outras.', kantar: 'Em 2022, "Kantar Public"; o nome mudou para Verian em 2023.' } as Record<string, string>,
    regra: 'Erro de 2022: a última pesquisa de 1º turno com os 12 candidatos e campo até 08/04/2022 (véspera do silêncio eleitoral), menos o resultado oficial, em pontos. Erro médio: média do erro absoluto nos 12 candidatos. Sinal positivo: a pesquisa deu mais do que a urna.',
    achado: (a: string, b: string, n: number) => `Em 2022, as ${n} pesquisas desta tabela subestimaram Mélenchon, de ${a} a ${b} pontos.`,
    fontes: 'Fontes:',
  },
  en: {
    titulo: 'Monitored pollsters, measured',
    nota: 'No grade and no stars: what each pollster did this cycle, how far off it was in the 2022 first round, and the formal actions of the Commission des sondages from 2021 to 2026. Ordered by number of waves this cycle.',
    colInst: 'Pollster', colRod: 'Waves this cycle', colAm: 'Typical sample', colUlt: 'Latest wave', colCli: 'For whom',
    colErro: 'Average error in 2022', colLp: 'Le Pen 2022', colJlm: 'Mélenchon 2022', colCom: 'Commission 2021-2026',
    nenhuma: 'none',
    sem2022: 'no 2022 poll in this database',
    mise: 'correction', avert: 'warning', superada: (d: string) => `withdrawn on ${d}`,
    motivo: { representatividade: 'sample representativeness', apresentacao: 'changed the presentation between waves', metodoDeclarado: 'declared a method it did not use' } as Record<string, string>,
    eleicao: { presidentielle2022: '2022 presidential', legislatives2024: '2024 legislative', europeennes2024: '2024 European' } as Record<string, string>,
    nota2022: { harris: 'In 2022, "Harris Interactive".', ipsosbva: 'In 2022, Ipsos and BVA were separate pollsters: both are shown.', yougov: 'YouGov’s last complete 2022 poll is from 03/31, a week before the others.', kantar: 'In 2022, "Kantar Public"; renamed Verian in 2023.' } as Record<string, string>,
    regra: '2022 error: the last first-round poll with all 12 candidates and fieldwork up to 04/08/2022 (the eve of the electoral silence), minus the official result, in points. Average error: mean absolute error over the 12 candidates. Positive sign: the poll gave more than the ballot box.',
    achado: (a: string, b: string, n: number) => `In 2022, all ${n} polls in this table underestimated Mélenchon, by ${a} to ${b} points.`,
    fontes: 'Sources:',
  },
  es: {
    titulo: 'Encuestadoras monitoreadas, medidas',
    nota: 'Sin nota ni estrellas: lo que hizo cada encuestadora en este ciclo, cuánto erró en la 1ª vuelta de 2022 y las acciones formales de la Commission des sondages de 2021 a 2026. Orden por número de rondas en el ciclo.',
    colInst: 'Encuestadora', colRod: 'Rondas en el ciclo', colAm: 'Muestra típica', colUlt: 'Última ronda', colCli: 'Para quién',
    colErro: 'Error medio en 2022', colLp: 'Le Pen 2022', colJlm: 'Mélenchon 2022', colCom: 'Commission 2021-2026',
    nenhuma: 'ninguna',
    sem2022: 'sin encuesta de 2022 en esta base',
    mise: 'corrección', avert: 'advertencia', superada: (d: string) => `retirada el ${d}`,
    motivo: { representatividade: 'representatividad de la muestra', apresentacao: 'cambió la presentación entre rondas', metodoDeclarado: 'declaró un método que no usó' } as Record<string, string>,
    eleicao: { presidentielle2022: 'presidencial 2022', legislatives2024: 'legislativas 2024', europeennes2024: 'europeas 2024' } as Record<string, string>,
    nota2022: { harris: 'En 2022, "Harris Interactive".', ipsosbva: 'En 2022, Ipsos y BVA eran encuestadoras separadas: aparecen las dos.', yougov: 'La última encuesta completa de YouGov en 2022 es del 31/03, una semana antes que las demás.', kantar: 'En 2022, "Kantar Public"; pasó a llamarse Verian en 2023.' } as Record<string, string>,
    regra: 'Error de 2022: la última encuesta de 1ª vuelta con los 12 candidatos y campo hasta el 08/04/2022 (víspera del silencio electoral), menos el resultado oficial, en puntos. Error medio: promedio del error absoluto en los 12 candidatos. Signo positivo: la encuesta dio más que la urna.',
    achado: (a: string, b: string, n: number) => `En 2022, las ${n} encuestas de esta tabla subestimaron a Mélenchon, de ${a} a ${b} puntos.`,
    fontes: 'Fuentes:',
  },
}

function dm(iso: string, locale: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return locale === 'en' ? `${m}/${d}/${y}` : `${d}/${m}/${y}`
}

export function FrInstitutosSection({ dados, estat }: { dados: FrInstitutos | null; estat: EstatInstituto[] }) {
  const { locale } = useTranslation()
  const k = (locale === 'en' || locale === 'es' ? locale : 'pt-BR') as keyof typeof T
  const t = T[k]
  if (!dados || estat.length === 0) return null

  const sinal = (v: number) => `${v > 0 ? '+' : ''}${fmtDecimal(v, locale, 2)}`
  const todos2022 = Object.values(dados.institutos).flatMap((i) => i.em2022)
  const jlm = todos2022.map((x) => x.erroMelenchon)
  const todosSub = jlm.length > 0 && jlm.every((v) => v < 0)
  const notas = [...new Set(estat.map((e) => dados.institutos[e.chave]?.nota2022).filter(Boolean) as string[])]

  return (
    <section id="sec-institutos" className="scroll-mt-20">
      <SectionTitle>{t.titulo}</SectionTitle>
      <p className="-mt-2 mb-3 text-xs text-gray-500">{t.nota}</p>
      <Card className="!p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-[13px]">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wider text-gray-500">
                <th className="py-1.5 pr-2 font-semibold">{t.colInst}</th>
                <th className="py-1.5 px-2 text-right font-semibold">{t.colRod}</th>
                <th className="py-1.5 px-2 text-right font-semibold">{t.colAm}</th>
                <th className="py-1.5 px-2 font-semibold">{t.colUlt}</th>
                <th className="py-1.5 px-2 font-semibold">{t.colCli}</th>
                <th className="py-1.5 px-2 text-right font-semibold">{t.colErro}</th>
                <th className="py-1.5 px-2 text-right font-semibold">{t.colLp}</th>
                <th className="py-1.5 px-2 text-right font-semibold">{t.colJlm}</th>
                <th className="py-1.5 pl-2 font-semibold">{t.colCom}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border align-top">
              {estat.map((e) => {
                const inst = dados.institutos[e.chave]
                const acoes = dados.acoes[e.chave] ?? []
                const anos = inst?.em2022 ?? []
                return (
                  <tr key={e.chave}>
                    <td className="py-2 pr-2 font-semibold text-dark">{inst?.nome ?? e.nome}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{e.rodadas}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{e.amostraMediana ? fmtMilhar(e.amostraMediana, locale) : '–'}</td>
                    <td className="py-2 px-2 tabular-nums text-gray-600">{dm(e.ultimoCampo, locale)}</td>
                    <td className="py-2 px-2 text-[12px] text-gray-600">{e.clientes.join(', ')}</td>
                    {anos.length === 0 ? (
                      <td colSpan={3} className="py-2 px-2 text-right text-[12px] text-gray-600">{t.sem2022}</td>
                    ) : (
                      <>
                        <td className="py-2 px-2 text-right tabular-nums">{anos.map((a) => <div key={a.nome}>{anos.length > 1 ? <span className="text-[11px] text-gray-600">{a.nome} </span> : null}{fmtDecimal(a.erroMedio, locale, 2)}</div>)}</td>
                        <td className="py-2 px-2 text-right tabular-nums">{anos.map((a) => <div key={a.nome}>{sinal(a.erroLePen)}</div>)}</td>
                        <td className="py-2 px-2 text-right tabular-nums">{anos.map((a) => <div key={a.nome}>{sinal(a.erroMelenchon)}</div>)}</td>
                      </>
                    )}
                    <td className="py-2 pl-2 text-[12px]">
                      {acoes.length === 0 ? <span className="text-gray-600">{t.nenhuma}</span> : acoes.map((a) => (
                        <div key={a.url}>
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">
                            {a.tipo === 'miseAuPoint' ? t.mise : t.avert} {dm(a.data, locale)} ↗
                          </a>
                          <span className="text-gray-600"> · {t.eleicao[a.eleicao] ?? a.eleicao} · {t.motivo[a.motivo] ?? a.motivo}</span>
                          {a.superadaEm && <span className="text-gray-500"> · {t.superada(dm(a.superadaEm, locale))}</span>}
                        </div>
                      ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-1 border-t border-light-border pt-2 text-[11px] leading-snug text-gray-500">
          {todosSub && <p className="font-medium text-gray-700">{t.achado(fmtDecimal(Math.abs(Math.max(...jlm)), locale, 2), fmtDecimal(Math.abs(Math.min(...jlm)), locale, 2), todos2022.length)}</p>}
          <p>{t.regra}</p>
          {notas.map((n) => <p key={n}>{t.nota2022[n]}</p>)}
          <p>
            {t.fontes}{' '}
            {Object.values(dados.fontes).map((f, i) => (
              <span key={f.url}>{i > 0 ? ' · ' : ''}<a href={f.url} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-dotted underline-offset-2">{f.rotulo} ↗</a></span>
            ))}
          </p>
        </div>
      </Card>
    </section>
  )
}
