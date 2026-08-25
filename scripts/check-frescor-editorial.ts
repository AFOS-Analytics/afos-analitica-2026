/**
 * Portão de FRESCOR do painel do Brasil.
 *
 * Roda sobre o pt-BR, ANTES da tradução, e reprova com exit 1.
 *
 * 🔴 O DEFEITO QUE ELE EXISTE PARA PEGAR, medido em 19/Ago/2026 em produção:
 * o `analysis-data.json` carimbava "19/08/2026, 14:58" no topo e três dos quatro
 * blocos do cartão de clima carregavam a leitura de 17/Ago às 18:48, com o líder
 * em 64,50% e o segundo em 31,45%, quando o preço do dia era 63,50% e 32,55%. O
 * volume denunciava junto: USD 8,46M contra os 8,63M da captura certificada. E o
 * `analysis-criteriosa.json` carregava as DUAS camadas ao mesmo tempo, com 15
 * carimbos de 19/Ago convivendo com 3 de 16/Ago.
 *
 * ⚠️ Nenhum validador da casa pegava isso, e o motivo é estrutural: o número
 * estava internamente coerente, a aritmética fechava, o schema estava certo, e o
 * gate numérico da tradução compara o pt-BR com o pt-BR traduzido, não o pt-BR
 * com a realidade. O erro era de IDADE, não de forma nem de conta.
 *
 * ⛔ Ele NÃO reescreve texto. Lê e reprova. Corrigir a prosa é da rodada.
 *
 * 🔬 REGRESSÃO DA RÉGUA 6, rodada em 24/Ago/2026 antes de ela entrar, contra as
 * 14 versões do `analysis-criteriosa.json` que o git guarda:
 *
 *   18/Ago · 19/Ago (x2) · 20/Ago (x2) · 21/Ago (x2) · 22/Ago (x2) · 24/Ago (x2)
 *      -> CONTRADICAO = 0   (as outras réguas seguem acusando 18 e 19/Ago, que é
 *                            o incidente para o qual elas foram feitas)
 *   23/Ago (x2)
 *      -> CONTRADICAO = 3   e as três são REAIS, conferidas à mão
 *
 * 🔑 Portão que acusa dia legítimo é portão que alguém aprende a pular. As duas
 * primeiras versões desta régua acusavam 20 e 21/Ago, e as duas acusações eram
 * DELA, não do arquivo: uma lia "o topo da série dele é 17,90%, de 09/Jun" como
 * afirmação de hoje, e a outra lia "paga 55,50% nele no contrato de 3º lugar"
 * como preço presidencial, porque só procurava o rótulo do contrato ANTES do
 * valor. Ambas corrigidas antes de entrar.
 *
 * Uso:
 *   npx tsx scripts/check-frescor-editorial.ts
 */

import { readFileSync } from 'fs'
import { join } from 'path'

const RAIZ = join(process.cwd(), 'public')
const ARQUIVOS = ['analysis-data.json', 'analysis-criteriosa.json'] as const
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface Falha {
  arquivo: string
  regra: string
  detalhe: string
}

interface LinhaQuadro {
  n?: string
  m?: string
}

/** "19/08/2026, 14:58" vira "19/Ago 14:58", que é a forma usada na prosa. */
function carimboEsperado(updatedAt: string): string | null {
  const m = String(updatedAt ?? '').match(/^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/)
  if (!m) return null
  const mes = MESES[Number(m[2]) - 1]
  return mes ? `${Number(m[1])}/${mes} ${m[4]}:${m[5]}` : null
}

/** "05/Ago" e "5/Ago" são a mesma data. */
function normalizaData(d: string): string {
  const [dia, mes] = d.split('/')
  return `${Number(dia)}/${mes}`
}

const falhas: Falha[] = []

for (const arquivo of ARQUIVOS) {
  const bruto = readFileSync(join(RAIZ, arquivo), 'utf-8')
  const json = JSON.parse(bruto) as { updatedAt?: string; quadroComparativo?: LinhaQuadro[] }
  const esperado = carimboEsperado(json.updatedAt ?? '')

  if (!esperado) {
    falhas.push({
      arquivo,
      regra: 'CARIMBO',
      detalhe: `updatedAt ausente ou fora do formato: ${JSON.stringify(json.updatedAt)}`,
    })
    continue
  }

  // ── Régua 1: todo "leitura confirmada de" é do carimbo do PRÓPRIO arquivo.
  const carimbos = new Map<string, number>()
  for (const m of bruto.matchAll(/leitura confirmada de (\d{1,2}\/\w{3})[, ]+(\d{2}:\d{2})/gi)) {
    const chave = `${normalizaData(m[1])} ${m[2]}`
    carimbos.set(chave, (carimbos.get(chave) ?? 0) + 1)
  }
  for (const [chave, n] of carimbos) {
    if (chave !== esperado) {
      falhas.push({
        arquivo,
        regra: 'CARIMBO',
        detalhe: `${n}x "leitura confirmada de ${chave}" num arquivo carimbado ${esperado}. Bloco de rodada anterior sobreviveu.`,
      })
    }
  }

  // ── Régua 2: a série tem UMA data de início por arquivo.
  //
  // ⚠️ A CONTAGEM de dias pode variar entre candidatos, e varia por motivo
  // legítimo: cada contrato abriu num dia, então Caiado tem 86 dias onde Lula
  // tem 88. O que não pode variar é a DATA DE INÍCIO. Confundir as duas coisas
  // faria a régua acusar todo dia.
  const inicios = new Map<string, string[]>()
  for (const m of bruto.matchAll(/(\d+) dias(?: gravados)?(?: da série)?(?: gravada)? desde (\d{1,2}\/\w{3})/gi)) {
    const dia = normalizaData(m[2])
    inicios.set(dia, [...(inicios.get(dia) ?? []), `${m[1]} dias`])
  }
  if (inicios.size > 1) {
    const desc = [...inicios.entries()].map(([d, c]) => `desde ${d} (${c.join(', ')})`).join('  x  ')
    falhas.push({
      arquivo,
      regra: 'SERIE',
      detalhe: `duas datas de início da série convivendo: ${desc}. A contagem varia por candidato, a data de início não.`,
    })
  }

  // ── Régua 3: preço e volume citados batem com o quadro do mesmo dia.
  //
  // 🔑 O valor tem de estar AMARRADO AO CANDIDATO, e essa é a lição que a
  // primeira versão desta régua custou. Ela comparava todo "vol USD X" contra o
  // CONJUNTO de volumes do quadro, e acusou cinco: dois eram reais (Caiado com
  // 5,92M onde o quadro diz 6,35M, Zema com 5,49M onde o quadro diz 5,72M) e
  // TRÊS eram falso positivo, porque Marçal, Tarcísio e Haddad não estão nas 6
  // linhas do quadro e nunca estariam naquele conjunto.
  //
  // ⛔ Portanto: só se confere o que o quadro conhece, e o par lido é o que
  // aparece logo DEPOIS do nome do candidato. Valor solto do dono não se julga.
  const escapa = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  for (const linha of json.quadroComparativo ?? []) {
    const partes = String(linha.n ?? '').match(/^(.*?)\s*\((.+)\)\s*$/)
    const nome = (partes ? partes[1] : String(linha.n ?? '')).trim()
    const partido = partes ? partes[2].trim() : null
    if (nome.length < 3) continue

    const canon = String(linha.m ?? '')
    const precoCanon = canon.match(/(\d+,\d+)%/)?.[1]
    const volCanon = canon.match(/USD\s+([\d.,]+)\s*(M|mil)/i)
    if (!volCanon) continue
    const volChave = `${volCanon[1]}${volCanon[2].toLowerCase()}`

    // Duas formas de achar o dono do valor, e a segunda existe por necessidade:
    //   1. o nome como está no quadro ("Romeu Zema")
    //   2. o SOBRENOME seguido do PARTIDO ("ZEMA (Novo)"), que é como os blocos
    //      de rótulo escrevem, e onde a forma 1 não casa.
    //
    // ⚠️ O partido não é enfeite na forma 2, é o que a torna segura: sobrenome
    // solto colide (existe mais de um Bolsonaro no noticiário, e o dataset do
    // Hugging Face já foi contaminado exatamente por colisão de sobrenome).
    // Exigir "(PL)" logo depois amarra o valor a UMA pessoa.
    const alvos = [escapa(nome)]
    const sobrenome = nome.split(/\s+/).pop() ?? ''
    if (partido && sobrenome.length >= 4 && sobrenome !== nome) {
      alvos.push(`${escapa(sobrenome)}\\s*\\(${escapa(partido)}\\)`)
    }

    const vistos = new Set<string>()
    for (const alvo of alvos) {
      // O dono, e o par "X,XX% ... USD Y" logo depois dele, sem cruzar fim de
      // frase: assim o valor não se solta do candidato a que pertence.
      const re = new RegExp(`${alvo}[^.!?]{0,90}?(\\d+,\\d+)%[^.!?]{0,40}?USD\\s+([\\d.,]+)\\s*(M|mil)`, 'gi')
      for (const m of bruto.matchAll(re)) {
        const vol = `${m[2]}${m[3].toLowerCase()}`
        if (vol === volChave) continue
        const chave = `${m[1]}|${vol}`
        if (vistos.has(chave)) continue
        vistos.add(chave)
        falhas.push({
          arquivo,
          regra: 'VOLUME',
          detalhe: `${nome}: o texto cita USD ${vol} e o quadro de hoje diz USD ${volChave}. Volume acumulado só cresce, então valor menor é de rodada anterior.`,
        })
        if (precoCanon && m[1] !== precoCanon) {
          falhas.push({
            arquivo,
            regra: 'PRECO',
            detalhe: `${nome}: no mesmo bloco de volume velho, o texto cita ${m[1]}% e o quadro de hoje diz ${precoCanon}%.`,
          })
        }
      }
    }
  }
}

// ── Régua 5: o carimbo do polls-data acompanha os outros dois.
//
// 🔴 Achado da auditoria EVAL: `polymarketComparison.updatedAt` marcava
// "17/08/2026, 18:48" enquanto os preços logo abaixo eram os de 19/Ago, e o
// `lastUpdate` do arquivo dizia 2026-08-19. Três carimbos, duas datas.
//
// ⚠️ Este campo é `updatedAt`, que está em FORA_DE_TRADUCAO, logo é cópia byte
// a byte nos três idiomas: conferir o pt-BR cobre os três.
try {
  const polls = JSON.parse(readFileSync(join(RAIZ, 'polls-data.json'), 'utf-8')) as {
    lastUpdate?: string
    polymarketComparison?: { updatedAt?: string }
  }
  const dados = JSON.parse(readFileSync(join(RAIZ, 'analysis-data.json'), 'utf-8')) as { updatedAt?: string }
  const carimboPolls = String(polls.polymarketComparison?.updatedAt ?? '')
  if (carimboPolls && dados.updatedAt && carimboPolls !== dados.updatedAt) {
    falhas.push({
      arquivo: 'polls-data.json',
      regra: 'CARIMBO',
      detalhe: `polymarketComparison.updatedAt é "${carimboPolls}" e o painel do dia é "${dados.updatedAt}". O bloco de preço é o MESMO nos dois arquivos.`,
    })
  }
  // `lastUpdate` é só a data, sem hora: compara o dia.
  const m = carimboPolls.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  const diaDoCarimbo = m ? `${m[3]}-${m[2]}-${m[1]}` : null
  if (diaDoCarimbo && polls.lastUpdate && diaDoCarimbo !== polls.lastUpdate) {
    falhas.push({
      arquivo: 'polls-data.json',
      regra: 'CARIMBO',
      detalhe: `lastUpdate é "${polls.lastUpdate}" e polymarketComparison.updatedAt é de ${diaDoCarimbo}. O mesmo arquivo declara dois dias.`,
    })
  }
} catch (e) {
  falhas.push({ arquivo: 'polls-data.json', regra: 'LEITURA', detalhe: (e as Error).message })
}

// ── Régua 4: os preços do resumo batem com o quadro, entre os DOIS arquivos.
try {
  const dados = JSON.parse(readFileSync(join(RAIZ, 'analysis-data.json'), 'utf-8')) as {
    cards?: { sentimento?: { polymarket?: string } }
  }
  const crit = JSON.parse(readFileSync(join(RAIZ, 'analysis-criteriosa.json'), 'utf-8')) as {
    quadroComparativo?: LinhaQuadro[]
  }
  const resumo = dados.cards?.sentimento?.polymarket ?? ''
  const quadro = crit.quadroComparativo ?? []
  for (const par of resumo.matchAll(/([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*)*)\s+(\d+,\d+)%/g)) {
    const primeiro = par[1].trim().split(' ')[0].toLowerCase()
    const linha = quadro.find((r) => String(r.n ?? '').toLowerCase().startsWith(primeiro))
    const precoQuadro = linha ? String(linha.m ?? '').match(/(\d+,\d+)%/)?.[1] : undefined
    if (precoQuadro && precoQuadro !== par[2]) {
      falhas.push({
        arquivo: 'analysis-data x analysis-criteriosa',
        regra: 'PRECO',
        detalhe: `${par[1].trim()}: o resumo diz ${par[2]}% e o quadro diz ${precoQuadro}%.`,
      })
    }
  }
} catch (e) {
  falhas.push({ arquivo: 'cruzamento', regra: 'LEITURA', detalhe: (e as Error).message })
}


// ── Régua 6: CONTRADIÇÃO INTERNA — o campo de comentário contra o CANÔNICO do
// MESMO candidato.
//
// 🔴 O PONTO CEGO QUE ELA FECHA, medido em 24/Ago/2026. O portão deu VERDE sobre
// um arquivo que se contradizia. A linha do Renan Santos dizia, no campo `m`,
// "no contrato de 3º lugar ele paga 56,00%, contra 41,00% de Caiado", e no campo
// `s` dizia "o mercado paga 55,50% nele contra 35,00% em Caiado". Nenhum dos
// dois pares era o do dia, que era 54,00% e 39,00%: eram DUAS rodadas anteriores
// diferentes convivendo no mesmo bloco.
//
// ⚠️ Por que as réguas 1 a 3 não viam: elas comparam o campo `m` contra o
// `quadroComparativo` do dia, e NENHUMA compara `s` contra `m` do mesmo
// candidato. O `s` é prosa de contexto, não cita carimbo, e por isso escapa
// também da régua de CARIMBO. Portão que compara o arquivo contra o QUADRO só
// enxerga o que o quadro cobre; campo de prosa livre é ponto cego por construção.
//
// 🔑 O canônico é o `m`, porque é ele que as réguas 1 a 3 já amarram ao dia.
{
  const crit = JSON.parse(readFileSync(join(RAIZ, 'analysis-criteriosa.json'), 'utf-8')) as {
    quadroComparativo?: (LinhaQuadro & { p?: string; s?: string; t?: string })[]
  }
  const quadro = crit.quadroComparativo ?? []

  /** "Renan Santos (Missão)" -> "renan". Primeiro nome, sem partido, minúsculo. */
  const chaveDe = (nome: string): string =>
    nome.replace(/\s*\(.+\)\s*$/, '').trim().split(/\s+/)[0].toLowerCase()

  const ROTULOS: Array<[RegExp, string]> = [
    [/contrato de 3º\s*lugar|3º\s*LUGAR|terceiro lugar/gi, '3º lugar'],
    [/contrato de 2º\s*lugar|2º\s*LUGAR|segundo lugar/gi, '2º lugar'],
  ]

  // ⛔ Valor citado como HISTÓRICO não é contradição, é narrativa de delta.
  // "subiu de 41,00% para 39,00%" tem duas verdades, e só a segunda é de hoje.
  const HISTORICO = /\b(era|vinha de|ontem|na leitura de|no fechamento de|em \d{1,2}\/\w{3}|topo da s[ée]rie|piso da s[ée]rie|m[áa]xim|m[íi]nim|recorde|desde)\b/i
  const ehHistorico = (texto: string, pos: number): boolean => {
    const antes = texto.slice(Math.max(0, pos - 45), pos)
    if (HISTORICO.test(antes)) return true
    // 🔑 Valor seguido de DATA é referência a outro dia, não afirmação de hoje:
    // "o topo da série dele é 17,90%, de 09/Jun" (falso positivo medido em 21/Ago).
    if (/^%?[,;]?\s*(?:de|em)\s+\d{1,2}\/\w{3}/.test(texto.slice(pos).replace(/^\d+,\d+/, ''))) return true
    // padrão "de X% para Y%": o X é o valor velho
    return /\bde\s*$/.test(antes) && /^\s*\d+,\d+%\s+para\s+\d/.test(texto.slice(pos))
  }

  /** Extrai (dono, rótulo, valor) de um texto, com o dono da LINHA como padrão. */
  const extrai = (texto: string, donoPadrao: string): Array<{ dono: string; rotulo: string; valor: string }> => {
    const saida: Array<{ dono: string; rotulo: string; valor: string }> = []
    for (const [re, rotulo] of ROTULOS) {
      re.lastIndex = 0
      for (const m of texto.matchAll(re)) {
        const ini = (m.index ?? 0) + m[0].length
        // A janela CRUZA a fronteira de frase de propósito: o rótulo costuma
        // abrir o parágrafo e os valores vêm na frase seguinte. Ela para no
        // próximo rótulo, para não atribuir valor de 2º lugar ao 3º.
        let fim = Math.min(texto.length, ini + 300)
        for (const [re2] of ROTULOS) {
          re2.lastIndex = 0
          for (const m2 of texto.slice(ini).matchAll(re2)) {
            const p = ini + (m2.index ?? 0)
            if (p > ini && p < fim) fim = p
          }
        }
        // ⛔ E ela para também quando o texto troca de PREÇO para URNA: depois de
        // "a Veritá" ou "na urna" o que vem é intenção de voto, não cotação.
        const trocaDeAssunto = texto
          .slice(ini, fim)
          .search(/\b(urna|pesquisa|instituto|Datafolha|Verit[áa]|Quaest|Nexus|AtlasIntel|PoderData|Ipsos|Gerp|Indexa)\b/i)
        if (trocaDeAssunto > 0) fim = ini + trocaDeAssunto
        const janela = texto.slice(ini, fim)
        // 🔑 Preço nesta casa é SEMPRE com duas casas ("54,00%"). Número de urna
        // vem com uma ("5,2%"). Exigir as duas casas separa preço de pesquisa, e
        // foi o que matou os 2 falsos positivos medidos no teste de 24/Ago.
        for (const v of janela.matchAll(/(\d+,\d{2})%/g)) {
          const pos = v.index ?? 0
          if (ehHistorico(janela, pos)) continue
          // dono explícito depois do valor: "41,00% de Caiado", "35,00% em Caiado"
          const depois = janela.slice(pos + v[0].length, pos + v[0].length + 30)
          const nom = depois.match(/^\s*(?:de|em|para|a)\s+([A-ZÀ-Ú][\wÀ-ÿ]+)/)
          if (nom) {
            saida.push({ dono: nom[1].toLowerCase(), rotulo, valor: v[1] })
            continue
          }
          // ⛔ "X contra Y" sem nome depois do Y: o Y é do ADVERSÁRIO, e qual
          // adversário não está escrito. Valor sem dono NÃO se julga, que é a
          // mesma regra da régua 3. Sem isto, "54,00% contra 39,00%" acusaria o
          // dono da linha de citar o preço do outro (falso positivo medido em
          // 24/Ago, no arquivo que estava CERTO).
          if (/\bcontra\s*$/i.test(janela.slice(Math.max(0, pos - 12), pos))) continue
          saida.push({ dono: donoPadrao, rotulo, valor: v[1] })
        }
      }
    }
    return saida
  }

  // 1. CANÔNICO, lido só do campo `m`.
  const canon = new Map<string, string>()
  const nomeDe = new Map<string, string>()
  for (const linha of quadro) {
    const nome = String(linha.n ?? '')
    const dono = chaveDe(nome)
    if (dono.length < 3) continue
    nomeDe.set(dono, nome)
    const m = String(linha.m ?? '')
    const preco = m.match(/(\d+,\d+)%/)?.[1]
    if (preco) canon.set(`${dono}|presidencial`, preco)
    for (const e of extrai(m, dono)) canon.set(`${e.dono}|${e.rotulo}`, e.valor)
  }

  // 2. CONFERÊNCIA dos campos de comentário contra o canônico.
  const jaVisto = new Set<string>()
  for (const linha of quadro) {
    const dono = chaveDe(String(linha.n ?? ''))
    if (dono.length < 3) continue
    for (const campo of ['s', 't', 'p'] as const) {
      const texto = String((linha as Record<string, unknown>)[campo] ?? '')
      if (!texto) continue

      for (const e of extrai(texto, dono)) {
        const chave = `${e.dono}|${e.rotulo}`
        const esperado = canon.get(chave)
        if (!esperado || esperado === e.valor) continue
        const id = `${chave}|${e.valor}|${campo}`
        if (jaVisto.has(id)) continue
        jaVisto.add(id)
        falhas.push({
          arquivo: 'analysis-criteriosa.json',
          regra: 'CONTRADICAO',
          detalhe: `${nomeDe.get(e.dono) ?? e.dono}, ${e.rotulo}: o campo "${campo}" de ${nomeDe.get(dono) ?? dono} cita ${e.valor}% e o campo "m" canônico diz ${esperado}%. Mesmo candidato, mesmo contrato, dois valores.`,
        })
      }

      // preço presidencial citado na prosa, quando governado por marcador de PREÇO
      // ("o preço", "paga", "precifica"). Sem o marcador seria número de urna.
      for (const v of texto.matchAll(/(?:o preço|paga|precifica|cotação)[^.!?]{0,60}?(\d+,\d+)%/gi)) {
        const pos = (v.index ?? 0)
        if (ehHistorico(texto, pos)) continue
        // se estiver dentro de janela de rótulo de contrato, já foi tratado acima
        // ⚠️ O rótulo do contrato pode vir DEPOIS do valor: "paga 55,50% nele no
        // contrato de 3º lugar". Olhar só para trás dava falso positivo (20/Ago).
        const ROT = /3º\s*lugar|2º\s*lugar|terceiro lugar|segundo lugar/i
        if (ROT.test(texto.slice(Math.max(0, pos - 220), pos))) continue
        if (ROT.test(texto.slice(pos, pos + 80))) continue
        const esperado = canon.get(`${dono}|presidencial`)
        if (!esperado || esperado === v[1]) continue
        const id = `${dono}|presidencial|${v[1]}|${campo}`
        if (jaVisto.has(id)) continue
        jaVisto.add(id)
        falhas.push({
          arquivo: 'analysis-criteriosa.json',
          regra: 'CONTRADICAO',
          detalhe: `${nomeDe.get(dono) ?? dono}, preço presidencial: o campo "${campo}" cita ${v[1]}% e o campo "m" canônico diz ${esperado}%. Mesmo candidato, dois preços.`,
        })
      }
    }
  }
}

if (falhas.length === 0) {
  console.log('✅ frescor: carimbo único por arquivo, série com uma data de início, preço e volume coerentes com o quadro, e nenhum candidato se contradizendo entre os próprios campos.')
  process.exit(0)
}

console.error(`\n❌ check-frescor-editorial: ${falhas.length} problema(s) de IDADE do conteúdo.\n`)
for (const f of falhas) {
  console.error(`   [${f.regra}] ${f.arquivo}`)
  console.error(`     ${f.detalhe}`)
}
console.error('\n   Isto NÃO é erro de forma nem de conta: os números estão internamente coerentes.')
console.error('   É bloco de rodada anterior que sobreviveu à regeração do dia.\n')
process.exit(1)
