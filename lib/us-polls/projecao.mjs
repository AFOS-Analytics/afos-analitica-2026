/**
 * Projeção da ROLAGEM da janela do generic ballot dos EUA.
 *
 * 🔴 POR QUE EXISTE, medido em 31/Ago/2026.
 *
 * O índice da Wikipédia não recebe linha nova desde o lote de 24/Ago, que
 * chegou à nossa leitura em 25/Ago. Em sete dias a amostra da média servida
 * caiu de 22 pesquisas de 16 institutos para 15 de 11, e a vantagem passeou
 * por 5,91 · 6,16 · 6,00 · 6,00 · 5,66 · 5,66 · 5,66 com ZERO pesquisa nova.
 * Todo esse movimento é COMPOSIÇÃO: quem se moveu foi a borda da janela.
 *
 * A pergunta que este módulo responde é aritmética e não tem opinião dentro:
 *
 *   se nenhuma linha nova entrar, o que a média servida faz, e QUANDO ela
 *   deixa de existir?
 *
 * ⚠️ NÃO é previsão de eleição, nem de intenção de voto. É a conta do que a
 * própria regra da casa produz sobre a base que já está no arquivo. Vender
 * isso como leitura do eleitorado seria atribuir ao MUNDO o que é da NOSSA
 * coleta. Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 *
 * ⛔ POR ISSO NADA DAQUI ENTRA NO OBJETO `dados`, pela mesma razão que o
 * `atraso.mjs` declara: o objeto que o cron grava no Neon é o mesmo que vira
 * `public/us-polls-data.json`, e esse arquivo é SERVIDO PUBLICAMENTE. Isto é
 * medida de operador, vive em log e em alerta, em nenhum outro lugar.
 *
 * 🔑 A REGRA DE DESENHO QUE MAIS IMPORTA AQUI:
 *   a linha de base é RECOMPUTADA com a `media()` de produção, nunca lida de
 *   `dados.mediaAfos`. Ler do arquivo foi exatamente o defeito que a primeira
 *   versão do `exposicao.mjs` teve em 30/Ago: misturava a rolagem da janela
 *   com o efeito que se queria medir, e o teste pegou porque o `n` não batia.
 *   Ver memory/reference_media_da_janela_muda_sem_pesquisa_nova.md
 *
 * E a média sai da MESMA função que o painel serve, importada, não copiada.
 * Duas cópias da mesma regra foi o defeito que custou os rótulos de faixa do
 * mercado em 29/Jul: elas convivem sem incidente até o dia em que uma é
 * corrigida e a outra não.
 */

import { media } from './collect.mjs'

/** Horizonte padrão da projeção, em dias. */
export const HORIZONTE_PADRAO = 30

/**
 * Meio-dia UTC é uma escolha SEM efeito, e o teste prova isso.
 *
 * O corte da `media()` é `agora - dias`, fatiado em `YYYY-MM-DD`. Como o
 * deslocamento é de dias inteiros e UTC não tem horário de verão, a hora do
 * dia não muda o corte: 07:10Z (a hora do cron) e 12:00Z dão a mesma borda.
 */
const HORA_DE_REFERENCIA = 'T12:00:00Z'

function ehDataIso(d) {
  return typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
}

function somarDias(diaIso, n) {
  return new Date(Date.parse(diaIso + HORA_DE_REFERENCIA) + n * 86400000).toISOString().slice(0, 10)
}

/**
 * A média da casa como ela sairia SE o dia fosse `diaIso`, sobre a base dada.
 *
 * Devolve `null` quando a janela fica vazia, que é o que a `media()` de
 * produção já faz. Quem chama tem de tratar o `null` como EVENTO, nunca como
 * "não mudou": janela vazia é o instrumento acabando, não um dia parado.
 */
export function mediaEm(polls, diaIso, dias) {
  if (!Array.isArray(polls) || !ehDataIso(diaIso)) return null
  return media(polls, dias, new Date(diaIso + HORA_DE_REFERENCIA))
}

/** A data de campo mais recente da base, ou `null` se não houver nenhuma. */
export function campoMaisRecente(polls) {
  const datas = (polls ?? []).map((p) => p?.campoFim).filter(ehDataIso).sort()
  return datas.length ? datas[datas.length - 1] : null
}

/**
 * O dia em que a janela fica VAZIA se nada entrar.
 *
 * É o dia seguinte àquele em que o corte ultrapassa a última data de campo:
 * o corte é `dia - dias`, e a pesquisa fica na janela enquanto `campoFim >=
 * corte`. Então o último dia com média é `campoMaisRecente + dias`, e o
 * primeiro sem é o seguinte.
 */
export function diaQueEsvazia(polls, dias) {
  const ultimo = campoMaisRecente(polls)
  if (!ultimo || !Number.isFinite(dias)) return null
  return somarDias(ultimo, dias + 1)
}

/**
 * Projeta a janela dia a dia a partir de `agora`, sem nenhuma linha nova.
 *
 * Serve também para RECONSTRUIR dias já passados, com `agora` no passado: é a
 * mesma conta, e foi assim que a projeção de 31/Ago foi validada contra os
 * sete dias que o Neon já tinha gravado, batendo 7 de 7.
 */
export function projetarJanela(dados, opts = {}) {
  const polls = dados?.polls ?? []
  const dias = Number.isFinite(opts.dias) ? opts.dias : (dados?.mediaAfos?.janelaDias ?? 30)
  const horizonte = Number.isFinite(opts.horizonte) ? opts.horizonte : HORIZONTE_PADRAO
  const agora = opts.agora instanceof Date ? opts.agora : new Date()
  const dia0 = agora.toISOString().slice(0, 10)

  const linhas = []
  let esvaziaEm = null
  let corteAnterior = null

  for (let i = 0; i <= horizonte; i++) {
    const dia = somarDias(dia0, i)
    const m = mediaEm(polls, dia, dias)
    if (!m) {
      esvaziaEm = dia
      linhas.push({ dia, desde: somarDias(dia, -dias), vazia: true, media: null, saindo: [] })
      break
    }
    // Quem estava dentro na borda anterior e não está mais. Na primeira linha
    // não há borda anterior, então ninguém "sai": sair é um evento entre dois
    // dias, e inventar um saindo no dia zero seria contar duas vezes.
    //
    // 🏷️ SAI RODADA, NÃO LINHA. O mesmo instituto na mesma data de campo pode
    // ter três linhas no arquivo, uma por recorte, e a `media()` já conta isso
    // como UMA. Listar as três faria a saída parecer três vezes maior do que a
    // queda do `n`, e número com rótulo errado é defeito que todo portão de
    // valor deixa passar. O `linhas` fica declarado ao lado.
    // Ver memory/feedback_rotulo_diz_do_que_o_numero_e.md
    const saindo = []
    if (corteAnterior !== null) {
      const porRodada = new Map()
      for (const p of polls) {
        if (!ehDataIso(p?.campoFim)) continue
        if (!(p.campoFim >= corteAnterior && p.campoFim < m.desde)) continue
        const chave = `${p.instituto}|${p.campoFim}`
        const j = porRodada.get(chave)
        if (j) j.linhas++
        else porRodada.set(chave, { instituto: p.instituto, campoFim: p.campoFim, linhas: 1 })
      }
      saindo.push(...porRodada.values())
    }
    linhas.push({ dia, desde: m.desde, vazia: false, media: m, saindo })
    corteAnterior = m.desde
  }

  const comMedia = linhas.filter((l) => !l.vazia)
  const vantagens = comMedia.map((l) => l.media.vantagemDem)

  /**
   * ⚠️ Base sem NENHUMA data de campo não "esvazia" em lugar nenhum: ela já
   * nasce vazia. O teste pegou isto na primeira rodada, porque o laço marcava
   * `esvaziaEm` no dia zero e o resumo saía dizendo que a média acabaria hoje.
   * Data de fim inventada a partir do nada é pior que ausência de data: ela
   * tem cara de medida.
   */
  const ultimoCampo = campoMaisRecente(polls)
  const baseVazia = ultimoCampo === null

  return {
    janelaDias: dias,
    horizonte,
    de: dia0,
    baseVazia,
    base: {
      nLinhas: polls.length,
      campoMaisRecente: ultimoCampo,
      // ⚠️ recomputada, NÃO lida de dados.mediaAfos. Ver o cabeçalho.
      mediaHoje: mediaEm(polls, dia0, dias),
    },
    linhas,
    esvaziaEm: baseVazia ? null : (esvaziaEm ?? diaQueEsvazia(polls, dias)),
    esvaziaDentroDoHorizonte: Boolean(esvaziaEm) && !baseVazia,
    vantagemMin: vantagens.length ? Math.min(...vantagens) : null,
    vantagemMax: vantagens.length ? Math.max(...vantagens) : null,
    // A amplitude é o achado que justifica o módulo: é quanto a vantagem
    // servida se move SEM nenhuma informação nova entrar.
    amplitudePp: vantagens.length ? Number((Math.max(...vantagens) - Math.min(...vantagens)).toFixed(2)) : null,
  }
}
