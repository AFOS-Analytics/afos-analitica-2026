/**
 * Candidatos do painel da FRANÇA: quem entra em cada seção e os FATOS MEDIDOS
 * de cada um. Criado 08/Nov/2026. Funções puras, testáveis sem banco.
 *
 * 📏 Decisões do André (08/Nov/2026):
 *  - PERFIL: os 8 com mais de 5 pontos no mercado (vencer) ou na média das
 *    pesquisas, ordenados pelo maior dos dois.
 *  - ANÁLISE CRITERIOSA: entra quem está entre os 4 primeiros em QUALQUER um dos
 *    dois lados da medição (média das pesquisas ou contrato "vai ao 2º turno").
 *    Se os dois lados concordam, são 4; se discordam, a diferença aparece.
 *
 * ⛔ "Ponto forte" e "ponto fraco" aqui NÃO são opinião: são contagens sobre a
 * medição desta rodada (listas, duelos, contratos). Os textos ficam no
 * componente, nos 3 idiomas; aqui só os números e o tipo do fato.
 */

import type { FrPesquisa } from './painel'

const DIA = 864e5

export interface EstatCandidato {
  candidato: string
  /** listas de 1º turno (janela) em que o candidato aparece */
  listas: number
  /** dessas, em quantas ele fica entre os 2 primeiros (a vaga do 2º turno) */
  top2: number
  /** e em quantas fica em 1º */
  primeiro: number
  /** duelos de 2º turno (janela) em que aparece */
  duelos: number
  duelosVencidos: number
}

export function estatisticasPorCandidato(pesquisas: readonly FrPesquisa[], agora: Date, dias = 45): EstatCandidato[] {
  const corte = new Date(agora.getTime() - dias * DIA).toISOString().slice(0, 10)
  const ok = pesquisas.filter((p) => p.publicavel && p.campo.fim >= corte)
  const m = new Map<string, EstatCandidato>()
  const de = (c: string) => {
    let e = m.get(c)
    if (!e) { e = { candidato: c, listas: 0, top2: 0, primeiro: 0, duelos: 0, duelosVencidos: 0 }; m.set(c, e) }
    return e
  }
  for (const p of ok) {
    if (p.turno === 1) {
      p.intencoes.forEach((i, pos) => {
        const e = de(i.candidato)
        e.listas++
        if (pos < 2) e.top2++
        if (pos === 0) e.primeiro++
      })
    } else if (p.intencoes.length === 2) {
      const [a, b] = p.intencoes
      for (const i of [a, b]) {
        const e = de(i.candidato)
        e.duelos++
        if (i === a && a.pct > b.pct) e.duelosVencidos++
      }
    }
  }
  return [...m.values()]
}

export interface Medidas {
  /** média das listas (30 dias) */
  media?: number
  /** listas da média */
  listasMedia?: number
  /** Polymarket, vencer a eleição */
  vencer?: number
  /** Polymarket, ir ao 2º turno */
  segundoTurno?: number
  /** Polymarket, estar na cédula */
  cedula?: number
  /** posição na média das pesquisas (1 = primeiro) */
  posMedia?: number
  /** posição no contrato de vencer (1 = primeiro) */
  posVencer?: number
}

/**
 * Junta mercado e pesquisas por NOME. Os nomes batem porque as duas fontes
 * escrevem o nome completo ("Marine Le Pen"); quem só existe num lado entra com
 * o outro vazio, e é isso que a tela mostra (Lagarde: mercado sem pesquisa).
 */
export function montarMedidas(
  medias: readonly { candidato: string; media: number; listas: number }[],
  vencer: ReadonlyMap<string, number>,
  segundoTurno: ReadonlyMap<string, number>,
  cedula: ReadonlyMap<string, number>,
): Map<string, Medidas> {
  const nomes = new Set([...medias.map((m) => m.candidato), ...vencer.keys()])
  const posM = new Map([...medias].sort((a, b) => b.media - a.media).map((m, i) => [m.candidato, i + 1]))
  const posV = new Map([...vencer.entries()].sort((a, b) => b[1] - a[1]).map(([c], i) => [c, i + 1]))
  const out = new Map<string, Medidas>()
  for (const n of nomes) {
    const md = medias.find((m) => m.candidato === n)
    out.set(n, { media: md?.media, listasMedia: md?.listas, vencer: vencer.get(n), segundoTurno: segundoTurno.get(n), cedula: cedula.get(n), posMedia: posM.get(n), posVencer: posV.get(n) })
  }
  return out
}

/** PERFIL: os 8 com mais de 5 pontos no mercado ou na média, pelo maior dos dois. */
export function selecionarPerfis(medidas: ReadonlyMap<string, Medidas>, n = 8, piso = 5): string[] {
  return [...medidas.entries()]
    .map(([c, m]) => ({ c, v: Math.max(m.vencer ?? 0, m.media ?? 0) }))
    .filter((x) => x.v > piso)
    .sort((a, b) => b.v - a.v)
    .slice(0, n)
    .map((x) => x.c)
}

/**
 * ANÁLISE CRITERIOSA: união dos 4 primeiros pela média das pesquisas e dos 4
 * primeiros pelo contrato "vai ao 2º turno". Ordem: pela média, e quem só
 * entra pelo mercado vem depois, pelo preço.
 */
export function selecionarAnalise(medidas: ReadonlyMap<string, Medidas>, n = 4): { nomes: string[]; soPesquisa: string[]; soMercado: string[] } {
  const arr = [...medidas.entries()]
  const porMedia = arr.filter(([, m]) => m.media !== undefined).sort((a, b) => (b[1].media as number) - (a[1].media as number)).slice(0, n).map(([c]) => c)
  const porMercado = arr.filter(([, m]) => m.segundoTurno !== undefined).sort((a, b) => (b[1].segundoTurno as number) - (a[1].segundoTurno as number)).slice(0, n).map(([c]) => c)
  const soMercado = porMercado.filter((c) => !porMedia.includes(c))
  return {
    nomes: [...porMedia, ...soMercado],
    soPesquisa: porMedia.filter((c) => !porMercado.includes(c)),
    soMercado,
  }
}

export type Fato =
  | { tipo: 'top2'; x: number; y: number }
  | { tipo: 'primeiro'; x: number; y: number }
  | { tipo: 'foraTop2'; x: number; y: number }
  | { tipo: 'duelosVence'; x: number; y: number }
  | { tipo: 'duelosPerde'; x: number; y: number }
  | { tipo: 'segundoTurnoAlto'; v: number }
  | { tipo: 'segundoTurnoBaixo'; v: number }
  | { tipo: 'cedula'; v: number }
  | { tipo: 'semDuelo' }
  | { tipo: 'posMedia'; pos: number }
  | { tipo: 'posVencer'; pos: number }

/**
 * Fatos medidos, separados em "a favor" e "contra" da ida ao 2º turno, que é a
 * pergunta da eleição em dois turnos. Regras fixas, iguais para todos:
 *  - lista: estar entre os 2 primeiros em metade ou mais das listas = a favor;
 *  - duelos: vencer mais da metade = a favor; perder mais da metade = contra;
 *  - mercado: "vai ao 2º turno" a 50 ou mais = a favor; abaixo de 25 = contra;
 *  - cédula: abaixo de 95 = contra (o mercado vê risco de não concorrer);
 *  - posição: até 3º na média das pesquisas ou no contrato de vencer = a favor.
 */
export function fatosMedidos(e: EstatCandidato | undefined, m: Medidas): { aFavor: Fato[]; contra: Fato[] } {
  const aFavor: Fato[] = []
  const contra: Fato[] = []
  if (e && e.listas > 0) {
    if (e.primeiro > 0 && e.primeiro === e.listas) aFavor.push({ tipo: 'primeiro', x: e.primeiro, y: e.listas })
    else if (e.top2 * 2 >= e.listas) aFavor.push({ tipo: 'top2', x: e.top2, y: e.listas })
    else contra.push({ tipo: 'foraTop2', x: e.listas - e.top2, y: e.listas })
  }
  if (e && e.duelos > 0) {
    const perdidos = e.duelos - e.duelosVencidos
    if (e.duelosVencidos * 2 > e.duelos) aFavor.push({ tipo: 'duelosVence', x: e.duelosVencidos, y: e.duelos })
    else if (perdidos * 2 > e.duelos) contra.push({ tipo: 'duelosPerde', x: perdidos, y: e.duelos })
  } else {
    contra.push({ tipo: 'semDuelo' })
  }
  if (m.segundoTurno !== undefined) {
    if (m.segundoTurno >= 50) aFavor.push({ tipo: 'segundoTurnoAlto', v: m.segundoTurno })
    else if (m.segundoTurno < 25) contra.push({ tipo: 'segundoTurnoBaixo', v: m.segundoTurno })
  }
  if (m.posMedia !== undefined && m.posMedia <= 3) aFavor.push({ tipo: 'posMedia', pos: m.posMedia })
  if (m.posVencer !== undefined && m.posVencer <= 3) aFavor.push({ tipo: 'posVencer', pos: m.posVencer })
  if (m.cedula !== undefined && m.cedula < 95) contra.push({ tipo: 'cedula', v: m.cedula })
  return { aFavor, contra }
}
