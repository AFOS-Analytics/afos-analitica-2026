/**
 * contar-casas.ts — quantas CASAS mediram um nome, e com que número, na base do painel.
 *
 * Uso:
 *   npx tsx scripts/contar-casas.ts "Augusto Cury"
 *   npx tsx scripts/contar-casas.ts "Augusto Cury" --dias=15
 *   npx tsx scripts/contar-casas.ts --2t "Lula" "Flávio"     # o par de 2º turno
 *
 * 🔴 POR QUE ISTO EXISTE. Escrito em 03/Set/2026, depois de eu publicar em NOVE
 * arquivos, nos três idiomas, que o salto de Augusto Cury tinha sido medido por
 * "duas casas independentes". Eram TRÊS, e a primeira, a Real Time Big Data de
 * 01/Set, estava na nossa própria base desde a véspera com o maior número dos
 * três, 11%. Eu contei de cabeça as casas que tinha acabado de ler, em vez de
 * contar as que a base tem.
 *
 * 🔑 A CLASSE DO DEFEITO: afirmação de CONTAGEM sobre a própria base, feita sem
 * consultar a base. Nenhum portão da casa pega. O `validate-polls-data` confere
 * SCHEMA, o `check-frescor` confere IDADE, o gate da tradução confere NÚMERO
 * contra o pt-BR. Nenhum deles sabe contar quantos institutos mediram um nome,
 * porque isso não é forma nem idade nem aritmética: é uma afirmação sobre o
 * mundo que por acaso é verificável no disco. → feedback_verify_every_number_before_sending
 *
 * ⚠️ E o erro era do lado SEGURO de errar apenas por sorte: contar a menos
 * enfraquece a frase, contar a mais a inventa. Desta vez enfraqueceu, e ainda
 * assim estava errado, porque a casa que faltava media o número mais alto.
 *
 * ⛔ Este script NÃO escreve nada. Ele lê `public/polls-data.json` e conta.
 */
import { readFileSync } from 'fs'

type Resultado = { candidate: string; percent: number }
type Cenario = { name: string; results: Resultado[] }
type SegundoTurno = { matchup: string; candidate1: string; percent1: number; candidate2: string; percent2: number }
type Pesquisa = {
  institute: string
  date: string
  scope?: string
  sample?: number
  register?: string
  fieldDates?: string
  scenarios?: Cenario[]
  secondRound?: SegundoTurno[]
}

const ARQ = 'public/polls-data.json'

function normalizar(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Duas casas com nomes diferentes podem ser a MESMA: "PoderData" e "PoderData/Aya". */
function casaCanonica(nome: string) {
  return normalizar(nome).split(/[\/(]/)[0].trim()
}

function main() {
  const args = process.argv.slice(2)
  const dias = Number(args.find((a) => a.startsWith('--dias='))?.slice(7) ?? 30)
  const nomes = args.filter((a) => !a.startsWith('--'))
  if (nomes.length === 0) {
    console.error('❌ Falta o nome. Ex.: npx tsx scripts/contar-casas.ts "Augusto Cury"')
    process.exit(1)
  }

  const dados = JSON.parse(readFileSync(ARQ, 'utf-8')) as { polls: Pesquisa[] }
  const corte = new Date(Date.now() - dias * 86400_000).toISOString().slice(0, 10)

  // 🔒 Portão de colapso: base vazia faria toda contagem dar zero, e zero aqui
  // pareceria achado ("nenhuma casa mediu") em vez de leitura ruim.
  if (!Array.isArray(dados.polls) || dados.polls.length === 0) {
    console.error('❌ polls-data.json sem pesquisas. Zero aqui não é medição.')
    process.exit(1)
  }

  const nacionais = dados.polls
    .filter((p) => (p.scope ?? 'national') === 'national' && p.date >= corte)
    .sort((a, b) => b.date.localeCompare(a.date))

  console.log(`\n📊 Base: ${ARQ}, ${nacionais.length} pesquisa(s) NACIONAIS nos últimos ${dias} dias (desde ${corte}).`)

  if (args.includes('--2t')) {
    const [a, b] = nomes
    console.log(`\n🥊 2º TURNO, o par ${a} x ${b}:`)
    const linhas: string[] = []
    for (const p of nacionais) {
      for (const s of p.secondRound ?? []) {
        const c1 = normalizar(s.candidate1)
        const c2 = normalizar(s.candidate2)
        const bate =
          (c1.includes(normalizar(a)) && c2.includes(normalizar(b))) ||
          (c1.includes(normalizar(b)) && c2.includes(normalizar(a)))
        if (!bate) continue
        const vencedor = s.percent1 >= s.percent2 ? s.candidate1 : s.candidate2
        const margem = Math.abs(s.percent1 - s.percent2)
        linhas.push(
          `   ${p.date}  ${p.institute.slice(0, 22).padEnd(22)} ${s.candidate1} ${s.percent1} x ${s.percent2} ${s.candidate2}   → ${vencedor} por ${margem}`,
        )
      }
    }
    if (linhas.length === 0) console.log('   nenhuma pesquisa da janela testa este par.')
    else linhas.forEach((l) => console.log(l))
    console.log(`\n   leituras: ${linhas.length}  |  casas distintas: ${new Set(nacionais.map((p) => casaCanonica(p.institute))).size}`)
    return
  }

  for (const nome of nomes) {
    const alvo = normalizar(nome)
    console.log(`\n🗳️  ${nome} no 1º turno, por casa:`)
    const porCasa = new Map<string, Array<{ data: string; instituto: string; pct: number; cenario: string }>>()

    for (const p of nacionais) {
      for (const c of p.scenarios ?? []) {
        for (const r of c.results ?? []) {
          if (!normalizar(r.candidate).includes(alvo)) continue
          const casa = casaCanonica(p.institute)
          if (!porCasa.has(casa)) porCasa.set(casa, [])
          porCasa.get(casa)!.push({ data: p.date, instituto: p.institute, pct: r.percent, cenario: c.name })
        }
      }
    }

    if (porCasa.size === 0) {
      console.log('   nenhuma pesquisa nacional da janela mede este nome.')
      continue
    }

    // Dentro de cada casa, a comparação que vale: a série da própria casa.
    for (const [, leituras] of [...porCasa.entries()].sort()) {
      const porData = new Map<string, { instituto: string; pct: number }>()
      for (const l of leituras.sort((x, y) => x.data.localeCompare(y.data))) {
        // Um cenário por data basta para a série; o maior, para não subestimar.
        const atual = porData.get(l.data)
        if (!atual || l.pct > atual.pct) porData.set(l.data, { instituto: l.instituto, pct: l.pct })
      }
      const serie = [...porData.entries()].map(([d, v]) => `${d.slice(5)} ${v.pct}%`).join('  →  ')
      const inst = [...porData.values()][0].instituto
      console.log(`   ${inst.slice(0, 26).padEnd(26)} ${serie}`)
    }

    const casas = porCasa.size
    const leiturasTotais = [...porCasa.values()].reduce((n, v) => n + v.length, 0)
    const maior = [...porCasa.values()].flat().sort((a, b) => b.pct - a.pct)[0]
    console.log(`\n   🔑 CASAS DISTINTAS QUE MEDIRAM: ${casas}   (leituras: ${leiturasTotais})`)
    console.log(`   🔝 maior número da janela: ${maior.pct}% na ${maior.instituto}, ${maior.data}`)
    console.log(`   ⚠️  Antes de escrever "duas casas" ou "a primeira a medir", é este ${casas} que vale.`)
  }
}

main()
