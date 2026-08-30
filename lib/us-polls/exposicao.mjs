/**
 * EXPOSIÇÃO da média ao buraco do índice.
 *
 * ─── A PERGUNTA QUE ESTE ARQUIVO RESPONDE ───────────────────────────────────
 *
 * O portão de cadência diz QUEM está calada. O verificador de rodada fora do
 * índice diz SE a rodada existe lá fora. Nenhum dos dois diz a única coisa que
 * decide o que fazer a respeito:
 *
 *   "e se a rodada que falta entrasse, a média mudaria o suficiente para
 *    mudar a frase que a gente publica?"
 *
 * Em 28/Ago/2026 essa conta foi feita à mão, e ela evitou uma correção
 * apressada: uma pesquisa a mais numa média de 17 movia o resultado entre
 * D+5,89 e D+6,33, o que não tirava a manchete. O achado de método foi
 * "cercar o dano antes de agir". Este arquivo transforma aquela conta de mão
 * em medida de toda passada.
 * Ver memory/feedback_o_atraso_global_e_cego_a_buraco_no_meio.md
 *
 * ─── DE ONDE VÊM OS NÚMEROS, E O ERRO QUE ESTA VERSÃO CORRIGE ───────────────
 *
 * 🔴 A primeira versão desta conta preenchia a rodada que falta com a MEDIANA
 * BRUTA daquela casa nos últimos 180 dias. Está errado, e o erro tem direção.
 *
 * A mediana bruta de 180 dias carrega a TENDÊNCIA DO TEMPO junto com o efeito
 * da casa. A The Economist/YouGov tem mediana bruta de D+3 no período, mas as
 * duas últimas rodadas dela mediram D+6 e D+4, num campo que hoje está em
 * D+5,66. Preencher agosto com o D+3 de abril não descreve a casa: descreve
 * uma eleição que já mudou. A conta saía sistematicamente mais republicana e
 * teria feito o buraco parecer maior do que é.
 *
 * ✅ O que a rodada que falta herda da casa é só o EFEITO DE CASA: o quanto
 * ela mede acima ou abaixo do campo, medido rodada a rodada contra o campo
 * DAQUELE momento, e não contra o campo de hoje.
 *
 *   efeito da casa = mediana de (leitura dela − campo na mesma data)
 *   rodada hipotética = campo de HOJE + efeito da casa
 *
 * ⚠️ O campo de comparação EXCLUI a própria casa. Comparar a casa com uma
 * média que a contém encolhe o efeito medido, e encolhe mais quanto menos
 * casas houver na janela.
 *
 * ⚠️ E a suposição fica declarada, porque ela é forte: supõe que o efeito de
 * casa é estável e que o campo de hoje é o nível certo. O que a faixa entrega
 * é o TAMANHO DO RISCO, não uma previsão.
 *
 * ─── QUANTAS RODADAS FALTAM ─────────────────────────────────────────────────
 *
 * Não se chuta: é a cadência da própria casa. Uma casa de 7 dias calada há 20
 * deve duas rodadas, nas datas esperadas de +7 e +14 sobre o último campo.
 *
 * ⚠️ Rodada com data esperada de HOJE não conta. Campo que encerra hoje quase
 * nunca está divulgado hoje, e contá-la inflaria a exposição todo dia.
 *
 * ⚠️ E só conta rodada que cai DENTRO da janela da média. Rodada esperada para
 * antes de `desde` não move média nenhuma, e somá-la seria alarme falso.
 *
 * ─── ONDE ISTO PODE APARECER ────────────────────────────────────────────────
 *
 * ⛔ NÃO entra no objeto `dados`. `public/us-polls-data.json` é servido em
 * público, e uma média hipotética ao lado da medida é a maneira mais rápida de
 * alguém citar a hipotética como se fosse medida. Vive em log de operador.
 * Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 */

import { media, ORDEM_RECORTE } from './collect.mjs'

const DIA_MS = 86_400_000
const soData = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
const somaDias = (iso, n) => new Date(new Date(`${iso}T00:00:00Z`).getTime() + n * DIA_MS).toISOString().slice(0, 10)

/** Mediana de verdade, não média: uma rodada fora da curva não pode mandar. */
function mediana(xs) {
  if (!xs.length) return null
  const s = [...xs].sort((a, b) => a - b)
  const meio = Math.floor(s.length / 2)
  return s.length % 2 ? s[meio] : Number(((s[meio - 1] + s[meio]) / 2).toFixed(2))
}

/**
 * As rodadas de uma casa dentro da janela de cadência, uma linha por rodada,
 * pela MESMA hierarquia de recorte que a média usa (LV > RV > A).
 *
 * ⚠️ Reusar a hierarquia é obrigatório, não estético. Se aqui eu escolhesse
 * pela maior amostra, o cenário hipotético entraria com o recorte de adultos e
 * a exposição sairia sistematicamente mais democrata do que a média real.
 */
function rodadas(polls, desde, instituto = null) {
  const porRodada = new Map()
  const peso = (x) => (ORDEM_RECORTE[x.amostraTipo] ?? 0) * 1e9 + (x.amostra ?? 0)
  for (const p of polls) {
    if (instituto && p.instituto !== instituto) continue
    if (!p.instituto || !soData(p.campoFim) || p.campoFim < desde) continue
    const chave = `${p.instituto}|${p.campoFim}`
    const atual = porRodada.get(chave)
    if (!atual || peso(p) > peso(atual)) porRodada.set(chave, p)
  }
  return [...porRodada.values()].sort((a, b) => (a.campoFim < b.campoFim ? 1 : -1))
}

/** Mínimo de rodadas para o campo de comparação valer alguma coisa. */
const MIN_RODADAS_NO_CAMPO = 3

/**
 * O campo numa data, pela MESMA janela da média servida e EXCLUINDO a casa que
 * está sendo medida. Devolve `null` quando há rodadas de menos: efeito medido
 * contra duas pesquisas é ruído, e ruído aqui vira faixa falsa.
 */
function campoEm(todas, iso, janelaDias, excluirInstituto) {
  const de = somaDias(iso, -janelaDias)
  const na = todas.filter((r) => r.instituto !== excluirInstituto && r.campoFim <= iso && r.campoFim >= de)
  if (na.length < MIN_RODADAS_NO_CAMPO) return null
  const m = (k) => na.reduce((s, r) => s + r[k], 0) / na.length
  return { dem: m('dem'), rep: m('rep'), n: na.length }
}

/**
 * Efeito de casa: o quanto ela mede acima ou abaixo do campo do MOMENTO de
 * cada rodada dela. Mediana, não média, pelo motivo de sempre.
 */
function efeitoDaCasa(todas, instituto, desde, janelaDias) {
  const minhas = todas.filter((r) => r.instituto === instituto && r.campoFim >= desde)
  const desvios = []
  for (const r of minhas) {
    const campo = campoEm(todas, r.campoFim, janelaDias, instituto)
    if (!campo) continue
    desvios.push({ dem: r.dem - campo.dem, rep: r.rep - campo.rep, campoFim: r.campoFim })
  }
  if (!desvios.length) return null
  const porVantagem = [...desvios].sort((a, b) => a.dem - a.rep - (b.dem - b.rep))
  return {
    n: desvios.length,
    mediana: { dem: mediana(desvios.map((d) => d.dem)), rep: mediana(desvios.map((d) => d.rep)) },
    piso: porVantagem[0],
    teto: porVantagem[porVantagem.length - 1],
  }
}

/**
 * Mede o quanto a média servida está exposta às rodadas que o índice não tem.
 *
 * A lista de casas vem do PORTÃO (`cadencia.atrasadas`), nunca de quem chama.
 * Mesma razão do verificador: escolher a casa converteria a medida numa
 * escolha. Ver lib/us-polls/fora-do-indice.mjs
 */
export function medirExposicao(dados, cadencia, opts = {}) {
  const { agora = new Date(), janelaCadenciaDias = 180 } = opts
  const m = dados?.mediaAfos
  if (!m || !Array.isArray(dados?.polls)) return null

  const hoje = agora.toISOString().slice(0, 10)
  const desdeCadencia = new Date(agora.getTime() - janelaCadenciaDias * DIA_MS).toISOString().slice(0, 10)

  // 🔴 A LINHA DE BASE É RECOMPUTADA, NÃO É A DO ARQUIVO.
  //
  // O `mediaAfos` gravado é de quando o arquivo foi gerado. A janela de 30
  // dias ROLA sozinha: em 04/Ago/2026 a média foi de D+5,69 para D+5,75 com
  // zero pesquisa nova, só porque uma antiga saiu pela borda. Se eu comparasse
  // o cenário de hoje contra a média de ontem, o deslocamento que eu chamaria
  // de "efeito do buraco" carregaria junto a rolagem da janela, e as duas
  // causas ficariam indistinguíveis.
  //
  // Comparando cenário contra cenário, ambos calculados AGORA e com a mesma
  // regra, sobra só o efeito das rodadas que faltam.
  // Ver memory/reference_media_da_janela_muda_sem_pesquisa_nova.md
  const base = media(dados.polls, m.janelaDias, agora)
  if (!base) return null

  const todas = rodadas(dados.polls, desdeCadencia)
  const porCasa = []
  const hipoteticas = { central: [], piso: [], teto: [] }
  const semEfeito = []

  for (const c of cadencia?.atrasadas ?? []) {
    const minhas = todas.filter((r) => r.instituto === c.instituto)
    const efeito = efeitoDaCasa(todas, c.instituto, desdeCadencia, m.janelaDias)
    if (!minhas.length || !efeito) {
      // ⚠️ Sem efeito medível não se inventa um. A casa entra na lista do que
      // NÃO foi possível cercar, que é diferente de "não expõe".
      semEfeito.push({ instituto: c.instituto, motivo: 'sem rodada com campo de comparacao suficiente' })
      continue
    }

    // Datas que a casa DEVERIA ter entregue, pela cadência dela mesma.
    const esperadas = []
    for (let k = 1; ; k++) {
      const d = somaDias(c.ultimoCampo, k * c.cadenciaDias)
      if (d >= hoje) break // hoje não conta: campo que encerra hoje não está divulgado hoje
      esperadas.push(d)
    }
    const naJanela = esperadas.filter((d) => d >= base.desde)

    // 🔑 Campo de HOJE mais o efeito da casa. Nunca a leitura velha dela.
    const cenarios = {
      central: { dem: base.dem + efeito.mediana.dem, rep: base.rep + efeito.mediana.rep },
      piso: { dem: base.dem + efeito.piso.dem, rep: base.rep + efeito.piso.rep },
      teto: { dem: base.dem + efeito.teto.dem, rep: base.rep + efeito.teto.rep },
    }

    for (const d of naJanela) {
      for (const nome of ['central', 'piso', 'teto']) {
        hipoteticas[nome].push({
          instituto: c.instituto,
          campoFim: d,
          amostraTipo: minhas[0].amostraTipo,
          amostra: minhas[0].amostra,
          dem: Number(cenarios[nome].dem.toFixed(2)),
          rep: Number(cenarios[nome].rep.toFixed(2)),
          vantagemDem: Number((cenarios[nome].dem - cenarios[nome].rep).toFixed(2)),
          hipotetica: true,
        })
      }
    }

    const vant = (c2) => Number((c2.dem - c2.rep).toFixed(2))
    porCasa.push({
      instituto: c.instituto,
      cadenciaDias: c.cadenciaDias,
      ultimoCampo: c.ultimoCampo,
      rodadasEsperadas: esperadas.length,
      rodadasEsperadasNaJanela: naJanela.length,
      datasEsperadasNaJanela: naJanela,
      rodadasObservadas: minhas.length,
      rodadasComEfeitoMedido: efeito.n,
      efeitoDeCasaPp: Number((efeito.mediana.dem - efeito.mediana.rep).toFixed(2)),
      vantagemCentral: vant(cenarios.central),
      vantagemPiso: vant(cenarios.piso),
      vantagemTeto: vant(cenarios.teto),
    })
  }

  const recalcular = (extras) => (extras.length ? media([...dados.polls, ...extras], m.janelaDias, agora) : base)
  const central = recalcular(hipoteticas.central)
  const piso = recalcular(hipoteticas.piso)
  const teto = recalcular(hipoteticas.teto)

  // ⚠️ Piso e teto são os EXTREMOS, e a ordem entre eles não é garantida por
  // construção quando duas casas puxam para lados opostos. Ordenar aqui evita
  // imprimir uma faixa invertida, que é defeito de etiqueta e passa por todo
  // portão de valor. Ver memory/feedback_faixa_que_nao_fecha_normaliza_e_troca_a_etiqueta.md
  const extremos = [piso.vantagemDem, teto.vantagemDem].sort((a, b) => a - b)

  const rodadasFaltando = porCasa.reduce((s, c) => s + c.rodadasEsperadasNaJanela, 0)

  return {
    janelaDias: base.janelaDias,
    desde: base.desde,
    rodadasFaltando,
    casasSinalizadas: porCasa.length,
    porCasa,
    semEfeitoMedivel: semEfeito,
    atual: { vantagemDem: base.vantagemDem, nPesquisas: base.nPesquisas, nInstitutos: base.nInstitutos },
    // Diferença entre a base recomputada agora e a que está gravada no
    // arquivo. Zero quer dizer que o arquivo é de hoje. Diferente de zero é
    // rolagem de janela, e é informação, não defeito.
    arquivo: { vantagemDem: m.vantagemDem, nPesquisas: m.nPesquisas, desde: m.desde },
    rolagemDaJanelaPp: Number((base.vantagemDem - m.vantagemDem).toFixed(2)),
    central: { vantagemDem: central.vantagemDem, nPesquisas: central.nPesquisas, nInstitutos: central.nInstitutos },
    faixa: { min: extremos[0], max: extremos[1] },
    deslocamentoCentralPp: Number((central.vantagemDem - base.vantagemDem).toFixed(2)),
    amplitudePp: Number((extremos[1] - extremos[0]).toFixed(2)),
    suposicao:
      'cada rodada que falta entra como CAMPO DE HOJE mais o EFEITO daquela casa, medido rodada a rodada contra o campo da epoca (' +
      janelaCadenciaDias +
      ' dias, casa excluida do campo). Mediana no cenario central, menor e maior desvio nos extremos',
  }
}
