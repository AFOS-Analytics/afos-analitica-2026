#!/usr/bin/env node
/**
 * calendario-pesquisas-brz.mjs — emite a tabela "Calendário de pesquisas,
 * próximos 7 dias" da AFOS Daily, pronta para colar, nos três idiomas.
 *
 * 🔴 POR QUE ISTO EXISTE. A tabela era digitada à mão a cada daily, e em
 * 11/Set/2026 eu conferi a de 10/Set contra a fonte: **as QUATRO linhas da
 * coluna `Conf.` estavam erradas**. A API devolvia 0,9 · 0,7 · 0,9 · 0,7 para
 * aqueles mesmos protocolos e a peça publicada trazia 0,5 · 0,2 · 0,5 · 0,4.
 *
 * 🔑 O que torna esse defeito perigoso é que ele é INVISÍVEL a todo portão da
 * casa: os valores publicados EXISTEM na distribuição do campo (0,4 e 0,5 são
 * valores reais de outras pesquisas), a coluna é a certa, o formato é o certo e
 * o total de linhas bate. Número plausível na coluna certa não dispara nada.
 * → memory/feedback_defeito_de_etiqueta_passa_por_todo_portao_de_valor.md
 *
 * ⛔ A causa é a redigitação, então o conserto é não redigitar.
 *
 * 🔒 Os filtros são os da skill e ficam AQUI, não na cabeça de quem escreve:
 *    escopo `national` (nunca `state`, nunca `unknown`), amostra >= 1.000,
 *    publicação depois de hoje e até hoje+7, ordenado por data e depois por
 *    amostra decrescente. O rodapé declara os DOIS números, o que entrou e o
 *    que ficou de fora, porque dizer só "as N nacionais" esconde o corte.
 *
 * Uso:
 *   npm run calendario:brz
 *   npm run calendario:brz -- --locale=en
 *   npm run calendario:brz -- --hoje=2026-09-11 --dias=7
 */

import { readFileSync, existsSync } from 'node:fs'
import { TETO_API_POLLS, bordaDoCorte } from './lib/tse-api-polls.mjs'
import { dataCivilBrasil } from './lib/data-civil-brz.mjs'
import { baseDeLeitura } from './lib/base-afos.mjs'
import { divulgacaoAntesDoCampo } from '../lib/tse/saiu-hoje-brz.mjs'

const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MESES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MESES_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const TSE = 'https://divulgacandcontas.tse.jus.br/divulga/'

const arg = (n, p) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? p
const locale = arg('locale', 'pt-BR')
const dias = Number(arg('dias', 7))
// 🔴 Data civil do BRASIL, não UTC, desde 15/Set/2026. A tabela olha para a
// FRENTE a partir de hoje, então um "hoje" adiantado um dia esconderia as
// divulgações de hoje e anteciparia as de amanhã. Ver scripts/lib/data-civil-brz.mjs
const hoje = arg('hoje', dataCivilBrasil())

const fim = new Date(hoje + 'T00:00:00Z')
fim.setUTCDate(fim.getUTCDate() + dias)
const FIM = fim.toISOString().slice(0, 10)

const MESES = locale === 'en' ? MESES_EN : locale === 'es' ? MESES_ES : MESES_PT
const dataCurta = (iso) => `${iso.slice(8, 10)}/${MESES[+iso.slice(5, 7) - 1]}`

/**
 * Nome de vitrine da casa, quando ela tem um. O registro do TSE traz a RAZÃO
 * SOCIAL ("INSTITUTO DATATRENDS LTDA"), que estoura a coluna e não é como o
 * instituto é conhecido.
 *
 * ⛔ Mapa EXPLÍCITO, e quem não está nele sai inteiro. Encurtar por regra
 * automática (cortar no primeiro token, remover sufixo societário) adivinharia
 * o nome de casas que ainda não existem no índice, e nome errado na coluna do
 * instituto é exatamente o tipo de defeito que esta ferramenta veio impedir.
 */
const NOME_CURTO = new Map([
  ['NEXUS PESQUISA E INTELIGENCIA DE DADOS LTDA', 'NEXUS'],
  ['INSTITUTO INDEXA PESQUISAS LTDA', 'Indexa'],
  ['INSTITUTO DATATRENDS LTDA', 'Datatrends'],
  ['AMERICAN ANALYTICS DO BRASIL CONSULTORIA LTDA', 'American Analytics'],
  ['MDA-PESQUISA DE OPINIAO PUBLICA E MERCADO LTDA', 'MDA'],
  ['PODERDATA PESQUISA, JORNALISMO E COMUNICACAO LTDA', 'PoderData'],
  ['REAL TIME BIG DATA', 'Real Time Big Data'],
])
const nomeCasa = (bruto) => {
  const s = String(bruto || '').trim()
  if (NOME_CURTO.has(s)) return NOME_CURTO.get(s)
  for (const [longo, curto] of NOME_CURTO) if (s.startsWith(longo.slice(0, 24))) return curto
  return s
}

/** Protocolo do TSE no formato humano: BR012342026 vira BR-01234/2026. */
const protocoloBonito = (p) => {
  const m = String(p || '').match(/^([A-Z]{2})(\d{5})(\d{4})$/)
  return m ? `${m[1]}-${m[2]}/${m[3]}` : String(p || '')
}

/**
 * ⚠️ A confiança sai do campo `confidence` da API, UMA casa decimal, e em
 * vírgula no pt-BR e no es, ponto no en. Ela chega como float binário
 * (0.8999999999999999), então arredondar é obrigatório e não é cosmético.
 */
const conf = (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) return '?'
  const s = v.toFixed(1)
  return locale === 'en' ? s : s.replace('.', ',')
}

const milhar = (n) => (locale === 'en' ? n.toLocaleString('en-US') : n.toLocaleString('pt-BR'))

const T = {
  'pt-BR': {
    head: '### Calendário de pesquisas, próximos 7 dias',
    intro: (a, b) =>
      `Pesquisas registradas no TSE com publicação prevista entre ${a} e ${b}. Inclusão na tabela não significa publicação confirmada, porque institutos podem atrasar ou cancelar divulgação. Filtros aplicados: escopo nacional e amostra maior ou igual a 1.000. Cada protocolo linkado à [consulta pública TSE](${TSE}).`,
    cols: ['Data', 'Instituto', 'Amostra', 'Escopo', 'Protocolo TSE', 'Conf.'],
    escopo: 'nacional',
    vazio: 'Sem pesquisas de escopo nacional com amostra maior ou igual a 1.000 registradas no TSE para os próximos 7 dias.',
    rodape: (n, fora) =>
      `Fonte: registro público [TSE](${TSE}) via API AFOS. Amostras maiores ou iguais a 3.000 em negrito. A tabela lista as ${n} NACIONAIS e VIVAS da janela; ${fora} registros do mesmo período ficaram de fora por escopo ou por amostra${nacionaisFantasma ? `, e ${nacionaisFantasma} nacional(is) saiu(ram) do registro do TSE depois de registrada(s) e por isso não são compromisso` : ``}. O status é registrada e não publicada.`,
  },
  en: {
    head: '### Polling calendar, next 7 days',
    intro: (a, b) =>
      `Polls registered with the TSE scheduled for publication between ${a} and ${b}. Appearing in the table does not mean publication is confirmed, because pollsters can delay or cancel a release. Filters applied: national scope and sample of 1,000 or more. Each registration links to the [TSE public record](${TSE}).`,
    cols: ['Date', 'Pollster', 'Sample', 'Scope', 'TSE registration', 'Conf.'],
    escopo: 'national',
    vazio: 'No national polls with a sample of 1,000 or more are registered with the TSE for the next 7 days.',
    rodape: (n, fora) =>
      `Source: public [TSE](${TSE}) record via the AFOS API. Samples of 3,000 or more in bold. The table lists the ${n} NATIONAL polls in the window; ${fora} records from the same period were left out by scope or by sample. The status is registered, not published.`,
  },
  es: {
    head: '### Calendario de encuestas, próximos 7 días',
    intro: (a, b) =>
      `Encuestas registradas en el TSE con publicación prevista entre ${a} y ${b}. Aparecer en la tabla no significa publicación confirmada, porque los institutos pueden retrasar o cancelar la divulgación. Filtros aplicados: ámbito nacional y muestra mayor o igual a 1.000. Cada registro enlaza a la [consulta pública del TSE](${TSE}).`,
    cols: ['Fecha', 'Instituto', 'Muestra', 'Ámbito', 'Registro TSE', 'Conf.'],
    escopo: 'nacional',
    vazio: 'Sin encuestas de ámbito nacional con muestra mayor o igual a 1.000 registradas en el TSE para los próximos 7 días.',
    rodape: (n, fora) =>
      `Fuente: registro público del [TSE](${TSE}) vía API AFOS. Muestras mayores o iguales a 3.000 en negrita. La tabla lista las ${n} NACIONALES de la ventana; ${fora} registros del mismo período quedaron fuera por ámbito o por muestra. El estado es registrada y no publicada.`,
  },
}

const t = T[locale] || T['pt-BR']

const res = await fetch(`${baseDeLeitura()}/api/polls/tse?days=${Math.max(10, dias + 3)}`, {
  signal: AbortSignal.timeout(30000),
})
if (!res.ok) {
  console.error(`❌ a API devolveu ${res.status}. Tabela NÃO gerada, e não se digita à mão.`)
  process.exit(1)
}
const { polls = [] } = await res.json()

// 🔴 A rota para em 200 linhas por divulgação decrescente e diz "total" igual ao
// que serviu (medido em 14/Set/2026: 351 na janela de 30d, 200 servidas). O corte
// come as datas MAIS ANTIGAS primeiro, e esta tabela só olha para depois de hoje,
// então ela só quebra quando a borda do corte passa de hoje.
const borda = bordaDoCorte(polls)
if (borda !== null && borda > hoje) {
  console.error(`❌ a API parou no teto de ${TETO_API_POLLS} linhas e o corte alcança ${borda}, dentro da janela. Tabela NÃO gerada.`)
  process.exit(1)
}

const naJanela = polls.filter((r) => {
  const p = String(r.publicationDate || '').slice(0, 10)
  return p > hoje && p <= FIM
})

// 👻 O CORTE DE FANTASMA, instalado em 20/Set/2026, e ele vem ANTES do escopo.
//
// 🔴 O defeito, medido no dia: esta tabela anunciava a `BR-00548/2026` como
//    divulgação nacional prevista para 23/Set, e aquele protocolo JÁ TINHA SIDO
//    RETIRADO do registro do TSE. O `relatorio-pesquisas-brz.ts` filtrava e
//    imprimia "calendário limpo: 10 nacionais"; esta tabela, que é a que VAI
//    PARA A PEÇA PUBLICADA, imprimia 11. Duas ferramentas sobre a mesma janela
//    discordando, e a que publica era a errada.
//
// 🔑 Publicar "divulgação prevista" sem tirar os retirados é anunciar
//    compromisso que o TSE já não tem.
//    → memory/feedback_o_registro_do_tse_perde_linhas_e_o_banco_nunca_perde.md
//
// ⛔ E ausência do arquivo de fantasmas NÃO vira "nenhum fantasma": sem ele o
//    script para, porque zero calculado sobre base ausente publica sossegado
//    justamente no caso em que ninguém olhou.
const FANTASMAS = (() => {
  const f = 'data/tse/fantasmas.jsonl'
  if (!existsSync(f)) {
    console.error(`❌ ${f} não existe. Sem o conjunto de fantasmas a tabela anunciaria compromisso retirado. Rodar o /atualizar-pesquisas-brz com --apply.`)
    process.exit(1)
  }
  const linhas = readFileSync(f, 'utf8').trim().split('\n').filter(Boolean)
  const ultima = JSON.parse(linhas[linhas.length - 1])
  return new Set(ultima.protocolos ?? ultima.conjunto ?? [])
})()
// ⚠️ NÃO usar `\D` aqui: ele apaga o "BR" do protocolo, e o conjunto de
//    fantasmas guarda "BR005482026". A primeira versão desta linha casou ZERO e
//    ficou MUDA: a tabela seguiu publicando o retirado e o rodapé seguiu
//    dizendo que estava limpa. Chave normalizada de formas diferentes dos dois
//    lados é o defeito que mais produz zero plausível neste repositório.
const semProtocolo = (p) => String(p || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
const ehFantasma = (r) => FANTASMAS.has(semProtocolo(r.protocolo))

const vivas = naJanela.filter((r) => !ehFantasma(r))

// 🕳️ ANTI-MUDO: conjunto cheio e ZERO casamento na janela é o sinal clássico de
//    chave normalizada de formas diferentes. Não é prova de erro, porque pode
//    não haver fantasma nesta janela, então avisa e não bloqueia.
if (FANTASMAS.size > 0 && naJanela.length === vivas.length) {
  console.error(
    `   ⚠️ ${FANTASMAS.size} fantasma(s) no conjunto e NENHUM casou nesta janela. Conferir o formato do protocolo dos dois lados antes de confiar no zero.`
  )
}
const fantasmasNaJanela = naJanela.length - vivas.length

// 🔴 O corte de escopo é o SEGUNDO, e `unknown` NÃO entra: quando o registro
// do TSE não permite inferir, o painel registra a ausência em vez de chutar.
const entram = vivas
  .filter((r) => r.scope === 'national' && (r.sampleSize || 0) >= 1000)
  .sort((a, b) => String(a.publicationDate).localeCompare(String(b.publicationDate)) || b.sampleSize - a.sampleSize)

const fora = vivas.length - entram.length
const nacionaisFantasma = naJanela.filter((r) => ehFantasma(r) && r.scope === 'national' && (r.sampleSize || 0) >= 1000).length

// 🔒 Portão de colapso: janela inteira vazia é outra coisa que "nenhuma
// nacional", e as duas não podem imprimir a mesma tabela.
if (naJanela.length === 0) {
  console.error(`❌ ZERO registros na janela ${hoje} a ${FIM}. Isso não é calendário vazio, é leitura suspeita da API.`)
  process.exit(1)
}

console.log('')
console.log(t.head)
console.log('')

if (entram.length === 0) {
  console.log(t.vazio)
  console.log('')
  console.log(t.rodape(0, fora))
  process.exit(0)
}

const a = dataCurta(String(entram[0].publicationDate).slice(0, 10))
const b = dataCurta(String(entram[entram.length - 1].publicationDate).slice(0, 10))
console.log(t.intro(a, b))
console.log('')
console.log(`| ${t.cols.join(' | ')} |`)
console.log('|------|-----------|---------|--------|---------------|-------|')

for (const r of entram) {
  const iso = String(r.publicationDate).slice(0, 10)
  const grande = (r.sampleSize || 0) >= 3000
  const n = (s) => (grande ? `**${s}**` : s)
  console.log(
    `| ${n(dataCurta(iso))} | ${n(nomeCasa(r.institute))} | ${n(milhar(r.sampleSize))} | ${t.escopo} | [${protocoloBonito(r.protocolo)}](${TSE}) | ${conf(r.confidence)} |`,
  )
}

console.log('')
console.log(t.rodape(entram.length, fora))
console.log('')
console.error(`✅ ${entram.length} nacional(is) na janela ${hoje} a ${FIM}, ${fora} fora por escopo ou amostra. Confiança lida do campo \`confidence\` da API.`)

// 📅 A tabela publica a data do REGISTRO, e ela fica. Mas quem escreve a peça tem
//    de saber quando essa data é impossível pelo próprio registro: em 25/Set/2026
//    as duas nacionais da Gerp marcavam divulgação em 29/Set com campo de 30/Set
//    a 02/Out e de 01 a 03/Out. O aviso vai para o stderr, fora da tabela.
const impossiveis = entram.filter((r) => divulgacaoAntesDoCampo(r))
if (impossiveis.length) {
  console.error(`📅 ${impossiveis.length} linha(s) com divulgação ANTES do fim do campo, no próprio registro:`)
  for (const r of impossiveis) {
    console.error(`   ${protocoloBonito(r.protocolo)}  ${nomeCasa(r.institute)}  campo ${r.fieldStart} a ${r.fieldEnd}  div ${String(r.publicationDate).slice(0, 10)}  ${divulgacaoAntesDoCampo(r)}`)
  }
  console.error(`   ⛔ Na peça, não escrever "prometeu para o dia X" nem "prometeu e não saiu" sobre elas.`)
}
