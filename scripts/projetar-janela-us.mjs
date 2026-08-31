/**
 * PROJEÇÃO DA JANELA: o que a média servida faz se nenhuma pesquisa nova entrar.
 *
 * ⚠️ POR QUE ESTE SCRIPT EXISTE. Em 31/Ago/2026 o índice da Wikipédia estava há
 * sete dias sem receber uma linha, e mesmo assim a média servida tinha se mexido
 * quatro vezes na semana. A pergunta que ficou foi: quanto desse movimento é
 * pesquisa, e quanto é a borda da janela andando sozinha?
 *
 * 🔑 O QUE ELE NÃO É. Ele não coleta nada, não escreve arquivo nenhum e NÃO
 * prevê eleição. Ele aplica a regra da casa, a `media()` de produção, sobre a
 * base que já está no arquivo, dia a dia. É aritmética do nosso próprio método.
 *
 * ⛔ E O RESULTADO NÃO SE PUBLICA. Dizer ao leitor que a nossa média vai encolher
 * seria atribuir ao mundo um problema que é da NOSSA coleta. Isto é medida de
 * operador, como o `atraso.mjs`.
 * Ver memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
 *
 * ✅ O CONTROLE QUE FAZ A PROJEÇÃO VALER: a RECONSTRUÇÃO.
 *
 * Uma projeção sem controle é chute com casas decimais. Antes de projetar para
 * a frente, o script roda a MESMA conta sobre dias que já foram gravados no
 * Neon e imprime o resultado ao lado do que ficou registrado. Se as duas colunas
 * não baterem, a projeção não vale e o script diz isso.
 *
 * ⚠️ A reconstrução só é válida enquanto a BASE não muda. Um dia em que
 * `linhasLidas` era diferente da de hoje não é comparável, porque a base de hoje
 * tem linhas que aquele dia não tinha. Por isso o alvo da conferência sai do
 * `historico-us-polls.mjs`, que sabe desde quando o índice está congelado.
 *
 * Uso:
 *   node scripts/projetar-janela-us.mjs
 *   node scripts/projetar-janela-us.mjs --horizonte=45 --dias=30
 *   node scripts/projetar-janela-us.mjs --de=2026-08-25   (reconstruir a partir de)
 */
import { readFileSync } from 'fs'
import { projetarJanela } from '../lib/us-polls/projecao.mjs'

const args = process.argv.slice(2)
const opt = (nome, padrao) => {
  const a = args.find((x) => x.startsWith(`--${nome}=`))
  return a ? a.slice(nome.length + 3) : padrao
}

const ARQUIVO = opt('arquivo', 'public/us-polls-data.json')
const HORIZONTE = Number(opt('horizonte', '30'))
const DE = opt('de', null)
const DIAS = opt('dias', null)

const dados = JSON.parse(readFileSync(ARQUIVO, 'utf8'))
const agora = DE ? new Date(`${DE}T12:00:00Z`) : new Date()

const p = projetarJanela(dados, {
  agora,
  horizonte: HORIZONTE,
  ...(DIAS ? { dias: Number(DIAS) } : {}),
})

const fmt = (v) => (v >= 0 ? `D+${v.toFixed(2)}` : `R+${Math.abs(v).toFixed(2)}`)

console.log(`\n📏 PROJEÇÃO DA JANELA DO GENERIC BALLOT  [USO INTERNO, nao publicar]`)
console.log(`   arquivo ${ARQUIVO} · ${p.base.nLinhas} linhas · janela de ${p.janelaDias} dias`)
console.log(`   campo mais recente da base: ${p.base.campoMaisRecente}`)
console.log(`   media recomputada para ${p.de}: ${p.base.mediaHoje ? fmt(p.base.mediaHoje.vantagemDem) : 'SEM MEDIA'}`)

const servida = dados?.mediaAfos?.vantagemDem
if (p.base.mediaHoje && typeof servida === 'number' && p.base.mediaHoje.vantagemDem !== servida && !DE) {
  // Não é erro necessariamente: o arquivo pode ter sido gerado ontem. Mas é
  // divergência entre o que está SERVIDO e o que a regra dá hoje, e isso se
  // declara em vez de sumir.
  console.log(`   ⚠️ o arquivo serve ${fmt(servida)} e a regra da hoje ${fmt(p.base.mediaHoje.vantagemDem)}: o arquivo foi gerado em outro dia`)
}

console.log(`\n   dia        | n  | inst | vantagem | quem SAI da janela nesse dia`)
for (const l of p.linhas) {
  if (l.vazia) {
    console.log(`   ${l.dia} | 🔴 JANELA VAZIA: com corte em ${l.desde}, nao sobra nenhuma pesquisa e a media DEIXA DE EXISTIR`)
    break
  }
  const m = l.media
  const saindo = l.saindo
    .map((s) => `${s.instituto} (${s.campoFim}${s.linhas > 1 ? `, ${s.linhas} recortes` : ''})`)
    .join(', ')
  console.log(
    `   ${l.dia} | ${String(m.nPesquisas).padStart(2)} | ${String(m.nInstitutos).padStart(4)} | ${fmt(m.vantagemDem).padStart(8)} | ${saindo || '-'}`
  )
}

console.log('')
if (p.baseVazia) {
  console.log(`   🔴 a base nao tem NENHUMA data de campo legivel: nao ha o que projetar, e isto e defeito de leitura, nao resultado.`)
  process.exitCode = 1
} else if (p.esvaziaDentroDoHorizonte) {
  console.log(`   🔴 sem linha nova, a media acaba em ${p.esvaziaEm}, dentro do horizonte de ${p.horizonte} dias`)
} else {
  console.log(`   a media so acabaria em ${p.esvaziaEm}, fora do horizonte de ${p.horizonte} dias`)
}
if (p.amplitudePp === null) {
  console.log(`   (sem nenhum dia com media no horizonte, nao ha amplitude a medir)\n`)
} else {
  console.log(
    `   ⭐ com ZERO informacao nova, a vantagem servida ainda passeia de ${fmt(p.vantagemMin)} a ${fmt(p.vantagemMax)}: amplitude de ${p.amplitudePp}pp`
  )
  console.log(`   Isso e o piso de ruido da propria janela movel, nao movimento de intencao de voto.\n`)
}
