/**
 * SEMANA DO CONTRATO: o fechamento diário e o Δ da semana, lidos no BACKUP.
 *
 * ⚠️ POR QUE EXISTE. Toda edição do `/tradeoff-brz` e do `/tradeoff-usa` abre com
 * um Δ semanal ("o vão fechou de 29.60pp para 19.90pp em cinco pregões") e não
 * havia ferramenta: a conta era refeita à mão a cada semana. Conta de fechamento
 * semanal tem duas armadilhas que a mão erra em silêncio, e as duas custam a
 * manchete da edição, porque o Δ É a manchete.
 *
 *   1. QUAL PONTO É O FECHAMENTO. A série grava de 30 em 30 minutos. O
 *      fechamento de um dia é o ÚLTIMO ponto daquele dia, não o primeiro nem a
 *      média, e dia sem ponto tem de herdar o último fechamento anterior em vez
 *      de virar buraco.
 *   2. QUAL É A BORDA DA SEMANA. Δ de "seg a sex" pode significar três coisas
 *      diferentes, e elas dão números diferentes. Este script imprime as três e
 *      deixa a escolha explícita, em vez de embutir uma e chamar de a verdade.
 *
 * 🔑 ELE NÃO REIMPLEMENTA NADA. A carga, o casamento de outcome e a quarentena
 * vêm de `scripts/lib/serie-contrato.mjs`, a mesma que o `serie-do-contrato.mjs`
 * usa. Duas cópias da mesma regra foi o defeito que custou os rótulos de faixa
 * do mercado em 29/Jul: convivem sem incidente até o dia em que uma é corrigida
 * e a outra não. → memory/feedback_duas_copias_da_mesma_regra.md
 *
 * ⛔ Não coleta, não escreve e não toca na rede. Lê o backup e imprime.
 *
 * ⚠️ E o backup tem CAUDA CEGA de até 24h, porque ele é gerado uma vez por dia
 * e a série viva cresce de 30 em 30 minutos. Para uma semana JÁ FECHADA isso é
 * irrelevante; para o dia de hoje, não é, e por isso o último dia sai marcado.
 * → memory/feedback_o_backup_tem_uma_cauda_cega_de_ate_um_dia.md
 *
 * Uso:
 *   node scripts/semana-do-contrato.mjs --pais=br --de=2026-08-31 --ate=2026-09-04
 *   node scripts/semana-do-contrato.mjs --slug=brazil-presidential-election --de=... --ate=...
 *   node scripts/semana-do-contrato.mjs --pais=br --de=... --ate=... --nomes=Lula,Flávio Bolsonaro
 *   node scripts/semana-do-contrato.mjs --pais=us --de=... --ate=... --distribuicoes
 *        acrescenta as distribuições de cadeiras, faixa a faixa, com a soma do livro
 *
 * Desde 13/Set/2026 cada desfecho sai também com LEITURAS e AMPLITUDE da semana e
 * DINHEIRO NOVO, e cada livro com o PAR BINÁRIO ou a SOMA das faixas nas bordas.
 * A Tradeoff EUA №7 fez essas contas à mão; a calibração da extensão foi exigir
 * que a semana de 31/Ago a 04/Set reproduzisse os números publicados nela.
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { gunzipSync } from 'zlib'
import { join } from 'path'
import { agruparPorLivro, instantesSuspeitos, parBinario, PAR_MAX, PAR_MIN, serieDe } from './lib/serie-contrato.mjs'

const RAIZ = 'backup/neon'

const PAISES = {
  br: [/^brazil-presidential-election$/, /^any-brazil-stf-justice-removed-by-impeachment-before-2027$/, /^next-brazil-senate-election-most-seats-won$/, /^brazil-presidential-election-first-round-2nd-place$/, /^brazil-presidential-election-first-round-3rd-place$/],
  us: [/^which-party-will-win-the-(house|senate)-in-2026$/, /^will-the-2026-midterm-elections-happen-as-scheduled$/],
}

function lerCsvGz(dir) {
  const caminho = join(RAIZ, dir)
  if (!existsSync(caminho)) return []
  const linhas = []
  for (const f of readdirSync(caminho).filter((x) => x.endsWith('.csv.gz'))) {
    const txt = gunzipSync(readFileSync(join(caminho, f))).toString('utf8')
    const [cab, ...resto] = txt.split(/\r?\n/).filter(Boolean)
    const cols = cab.split(',')
    for (const l of resto) {
      const v = l.split(',')
      const o = {}
      cols.forEach((c, i) => (o[c] = v[i]))
      linhas.push(o)
    }
  }
  return linhas
}

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const somarDias = (d, n) => new Date(Date.parse(d + 'T12:00:00Z') + n * 86400000).toISOString().slice(0, 10)

const pais = arg('pais') ?? 'br'
const soSlug = arg('slug')
const de = arg('de')
const ate = arg('ate')
const filtroNomes = (arg('nomes') ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const comDistribuicoes = process.argv.includes('--distribuicoes')

/**
 * A SEGUNDA borda. Sem `--desde`, é a véspera de `de`. Com `--desde=AAAA-MM-DD`,
 * é o fechamento daquele dia, e o uso é a CONTINUIDADE entre edições: medir a
 * partir do último fechamento que a edição anterior publicou, para que o que se
 * negociou no fim de semana e na própria segunda não caia entre duas edições.
 */
const BORDA2 = arg('desde') ?? somarDias(de, -1)
const ROTULO2 = arg('desde') ? `de ${BORDA2}` : 'da véspera'

/**
 * As distribuições que o Tradeoff lê faixa a faixa. Ficam fora do padrão de
 * propósito: são 21 faixas, e quem pede só o Δ dos binários não precisa delas.
 */
const DISTRIBUICOES = {
  us: [/^republican-senate-seats-after-the-2026-midterm-elections-927$/, /^republican-house-seats-after-the-2026-midterm-elections$/],
}

if (!de || !ate) {
  console.error('❌ faltam as bordas. Use --de=AAAA-MM-DD --ate=AAAA-MM-DD')
  process.exit(1)
}

const mercados = lerCsvGz('market')
const saidas = lerCsvGz('marketOutcome')
const precos = lerCsvGz('marketPrice')
if (!precos.length) {
  console.error(`❌ nenhum ponto lido em ${RAIZ}/marketPrice`)
  process.exit(1)
}

const mercadoDe = new Map(mercados.map((m) => [m.id, m]))
const outcomeDe = new Map(saidas.map((o) => [o.id, o]))
const suspeitos = instantesSuspeitos(precos)
const limpos = suspeitos.size === 0 ? precos : precos.filter((p) => !suspeitos.has(String(p.snapshotAt).slice(0, 19)))

const todos = serieDe(limpos, outcomeDe, mercadoDe, soSlug ? { slug: soSlug } : {})
const padroes = [...(PAISES[pais] ?? []), ...(comDistribuicoes ? DISTRIBUICOES[pais] ?? [] : [])]
const livros = agruparPorLivro(soSlug ? todos : todos.filter((p) => padroes.some((re) => re.test(p.slug))))

/** Último ponto de CADA dia. Fechamento é o último, não a média nem o primeiro. */
function fechamentosPorDia(pontos) {
  const porDia = new Map()
  for (const p of pontos) {
    // 🔑 a lib devolve { t, v }: t é o carimbo e v é o preço. Ler outro nome
    // aqui daria série VAZIA em silêncio, que foi o que aconteceu na 1a rodada.
    const dia = String(p.t ?? '').slice(0, 10)
    if (!dia) continue
    const atual = porDia.get(dia)
    if (!atual || p.t > atual.carimbo) porDia.set(dia, { valor: p.v, carimbo: p.t })
  }
  return porDia
}

/** O fechamento vigente EM `dia`: o do próprio dia, ou o último anterior. */
function vigenteEm(porDia, dia) {
  const dias = [...porDia.keys()].filter((d) => d <= dia).sort()
  if (!dias.length) return null
  const d = dias[dias.length - 1]
  return { dia: d, ...porDia.get(d), herdado: d !== dia }
}

const HOJE = new Date().toISOString().slice(0, 10)
console.log(`\n📆 SEMANA DO CONTRATO · ${de} a ${ate} · pais=${pais}${soSlug ? ` · slug=${soSlug}` : ''}`)
console.log(`   fechamento = ÚLTIMO ponto do dia · lido no backup, não na API`)
console.log(`   ⚠️  as três bordas abaixo dão números DIFERENTES: escolher uma e declarar qual\n`)

/** Por livro, o que cada desfecho fez, para somar o par e a distribuição no fim. */
const porSlug = new Map()

for (const [chave, pontos] of [...livros.entries()].sort()) {
  // a chave de agruparPorLivro e `slug␟outcome`
  const [slug, nome] = String(chave).split('␟')
  if (filtroNomes.length && !filtroNomes.some((n) => nome.includes(n))) continue
  const porDia = fechamentosPorDia(pontos)
  if (!porDia.size) continue

  const abreNoDia = vigenteEm(porDia, de)
  const abreNaVespera = vigenteEm(porDia, BORDA2)
  const fecha = vigenteEm(porDia, ate)
  if (!abreNoDia || !fecha) continue

  const d = (a, b) => (b === null || a === null ? null : +(b - a).toFixed(2))
  console.log(`   ${nome}  ·  ${slug}`)
  console.log(`      fecha em ${fecha.dia}: ${Number(fecha.valor).toFixed(2)}${fecha.herdado ? ' (herdado)' : ''}${fecha.dia === HOJE ? '  ⚠️ dia de hoje, cauda cega' : ''}`)
  console.log(`      Δ desde o fechamento de ${de} .............. ${fmt(d(abreNoDia.valor, fecha.valor))}   (abre ${Number(abreNoDia.valor).toFixed(2)})`)
  console.log(`      Δ desde o fechamento ${ROTULO2}, ${abreNaVespera?.dia ?? 'n/d'} ... ${fmt(d(abreNaVespera?.valor ?? null, fecha.valor))}   (abre ${abreNaVespera ? Number(abreNaVespera.valor).toFixed(2) : 'n/d'})`)

  const caminho = []
  for (let x = de; x <= ate; x = somarDias(x, 1)) {
    const v = porDia.get(x)
    caminho.push(`${x.slice(5)} ${v ? Number(v.valor).toFixed(2) : '  ·  '}`)
  }
  console.log(`      caminho: ${caminho.join(' | ')}`)

  /**
   * 🔑 LEITURAS, AMPLITUDE E DINHEIRO NOVO, que a Tradeoff EUA №7 calculou à mão.
   *
   * Amplitude é sobre TODAS as leituras gravadas na semana, não sobre os
   * fechamentos: um contrato que foi a 14.50 às 15h e voltou a 13.50 às 18h tem
   * fechamentos idênticos e amplitude de 1.00pp. E o número de leituras vai
   * junto, porque "0.00pp em 30 leituras" e "0.00pp em 3" são frases diferentes.
   *
   * ⚠️ A série grava por MOVIMENTO e não por relógio, então "leituras" é pontos
   * GRAVADOS, não capturas feitas. → memory/feedback_a_serie_so_gravava_quando_o_lider_se_movia.md
   *
   * Dinheiro novo é o volume acumulado no fechamento de `ate` menos o do
   * FECHAMENTO DE `de`, a mesma borda do Δ de preço. ✅ Calibrado: é a borda que
   * reproduz EXATO os três valores da №7 (USD 39.642, 23.812 e 96.064). A borda
   * da véspera, que inclui o que se negociou no primeiro dia, dá 40.805, 24.099
   * e 99.683, e sai impressa ao lado para a escolha ficar explícita.
   */
  const daSemana = pontos.filter((p) => { const dia = p.t.slice(0, 10); return dia >= de && dia <= ate })
  const ultimoAte = (dia) => [...pontos].reverse().find((p) => p.t.slice(0, 10) <= dia) ?? null
  const volFim = ultimoAte(ate)?.vol ?? null
  const volIni = ultimoAte(de)?.vol ?? null
  const volVespera = ultimoAte(BORDA2)?.vol ?? null
  const novo = volFim != null && volIni != null ? volFim - volIni : null
  const novoVespera = volFim != null && volVespera != null ? volFim - volVespera : null
  if (daSemana.length) {
    const vs = daSemana.map((p) => p.v)
    const min = Math.min(...vs)
    const max = Math.max(...vs)
    // Um preço pode aparecer várias vezes na semana: a data impressa é a da 1ª vez.
    const quando = (alvo) => daSemana.find((p) => p.v === alvo).t.slice(5, 16).replace('T', ' ')
    console.log(`      leituras na semana: ${daSemana.length} · piso ${min.toFixed(2)} (1ª em ${quando(min)}) · topo ${max.toFixed(2)} (1ª em ${quando(max)}) · amplitude ${(max - min).toFixed(2)}pp`)
  } else {
    console.log(`      leituras na semana: 0 · o fechamento é HERDADO de antes da semana`)
  }
  const usd = (x) => (x == null ? 'n/d' : 'USD ' + Math.round(x).toLocaleString('pt-BR'))
  console.log(`      dinheiro novo desde o fechamento de ${de}: ${usd(novo)}   (desde o fechamento ${ROTULO2}: ${usd(novoVespera)}) · acumulado: ${usd(volFim)}\n`)

  if (!porSlug.has(slug)) porSlug.set(slug, [])
  porSlug.get(slug).push({ nome, abreNoDia: abreNoDia.valor, abreNaVespera: abreNaVespera?.valor ?? null, fecha: fecha.valor, novo, novoVespera, volFim })
}

/**
 * ⚖️ O PAR BINÁRIO e a SOMA DA DISTRIBUIÇÃO, nas duas bordas.
 *
 * A conta do par é a `parBinario` da lib, a mesma do `serie-do-contrato`, e não
 * uma cópia. Livro de dois desfechos que não somam perto de 100 é recusado por
 * ela, e a recusa é impressa em vez de sumir.
 */
for (const [slug, lados] of [...porSlug.entries()].sort()) {
  const r2 = (x) => (x == null ? 'n/d' : x.toFixed(2))
  if (lados.length === 2) {
    console.log(`   ⚖️ PAR · ${slug}`)
    for (const [rotulo, campo] of [[`fechamento de ${de}`, 'abreNoDia'], [`fechamento ${ROTULO2}`, 'abreNaVespera']]) {
      const par = parBinario(lados.map((l) => ({ outcome: l.nome, antes: l[campo], agora: l.fecha })))
      if (!par) { console.log(`      desde ${rotulo}: sem par`); continue }
      if (!par.ehPar) { console.log(`      desde ${rotulo}: RECUSADO, soma ${r2(par.somaAgora)} fora de ${PAR_MIN}-${PAR_MAX}`); continue }
      const txt = par.lados.map((l) => `${l.outcome} cru ${fmt(l.deltaCru)} norm ${r2(l.normAntes)}→${r2(l.normAgora)} ${fmt(l.deltaNorm)}`).join(' | ')
      console.log(`      desde ${rotulo}: soma ${r2(par.somaAntes)}→${r2(par.somaAgora)} · ${txt}`)
    }
    console.log(`      dinheiro novo no livro: desde o fechamento de ${de} ${usdLivro(lados, 'novo')} · desde o fechamento ${ROTULO2} ${usdLivro(lados, 'novoVespera')}\n`)
  } else if (lados.length > 2) {
    const soma = (campo) => lados.every((l) => l[campo] != null) ? lados.reduce((s, l) => s + l[campo], 0) : null
    const acum = lados.every((l) => l.volFim != null) ? lados.reduce((s, l) => s + l.volFim, 0) : null
    console.log(`   📊 DISTRIBUIÇÃO · ${slug} · ${lados.length} faixas`)
    console.log(`      soma das faixas: fechamento ${ROTULO2} ${r2(soma('abreNaVespera'))} · fechamento de ${de} ${r2(soma('abreNoDia'))} · fechamento de ${ate} ${r2(soma('fecha'))}   (portão 95-105)`)
    console.log(`      dinheiro novo no livro: desde o fechamento de ${de} ${usdLivro(lados, 'novo')} · desde o fechamento ${ROTULO2} ${usdLivro(lados, 'novoVespera')} · acumulado ${acum == null ? 'n/d' : 'USD ' + Math.round(acum).toLocaleString('pt-BR')}\n`)
  }
}

/** Soma um campo de dinheiro no livro inteiro. Faixa sem o dado deixa n/d, nunca uma soma menor. */
function usdLivro(lados, campo) {
  if (!lados.every((l) => l[campo] != null)) return 'n/d'
  return 'USD ' + Math.round(lados.reduce((s, l) => s + l[campo], 0)).toLocaleString('pt-BR')
}

function fmt(v) {
  if (v === null) return '  n/d '
  return (v >= 0 ? '+' : '') + v.toFixed(2) + 'pp'
}
