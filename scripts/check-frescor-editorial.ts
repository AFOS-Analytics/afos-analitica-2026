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

if (falhas.length === 0) {
  console.log('✅ frescor: carimbo único por arquivo, série com uma data de início, preço e volume coerentes com o quadro do dia.')
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
