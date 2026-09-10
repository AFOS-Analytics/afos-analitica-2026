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

/**
 * ⚖️ COMPARADOR DE LARGURAS DA JANELA, criado em 10/Set/2026.
 *
 * 🔴 POR QUE EXISTE. Em 08/Set a janela de 30 dias apareceu com data de morte,
 * 01/Out, e a pergunta "e se ela fosse de 45, 60 ou 90 dias?" foi respondida
 * rodando este script quatro vezes e anotando os números à mão. Conta refeita à
 * mão toda rodada é a mesma falha que o `conferir-us-polls` tinha antes de 05/Set
 * e que o `projetar-janela` tinha antes de 06/Set, quando eu errei a borda em um
 * dia. A pergunta vai voltar todo dia até a régua ser decidida.
 *
 * 🔑 Ele NÃO tem regra nova: chama a mesma `projetarJanela`, que chama a `media()`
 * de produção, uma vez por largura. Nenhuma conta nasce aqui.
 *
 * ⛔ E ele NÃO decide nada. A largura da janela é régua da casa, decisão do André,
 * e trocá-la no meio da série quebra a comparabilidade de tudo que já foi
 * publicado. Alargar também trata SINTOMA: a doença é o índice parar de receber
 * rodadas, e uma janela mais larga só adia a data em que isso aparece na tela.
 *
 * Uso:  node scripts/projetar-janela-us.mjs --comparar=30,45,60,90
 */
const COMPARAR = opt('comparar', null)
if (COMPARAR) {
  const larguras = COMPARAR.split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0)

  if (!larguras.length) {
    console.log('   ⚠️ --comparar veio sem nenhuma largura válida, nada a comparar\n')
  } else {
    console.log(`⚖️ LARGURAS DE JANELA, LADO A LADO  [USO INTERNO, nao publicar]`)
    console.log(`   a mesma base de ${p.base.nLinhas} linhas, a mesma media() de producao, so a largura muda`)
    console.log('')
    console.log(`   dias | n  | inst | hoje     | esvazia em | faltam | passeio ate o horizonte | ampl.`)
    for (const d of larguras) {
      const c = projetarJanela(dados, { agora, horizonte: HORIZONTE, dias: d })
      const m = c.base.mediaHoje
      const faltam = c.esvaziaEm
        ? Math.round((Date.parse(c.esvaziaEm + 'T12:00:00Z') - Date.parse(c.de + 'T12:00:00Z')) / 86400000)
        : null
      const passeio = c.vantagemMin === null ? '-' : `${fmt(c.vantagemMin)} a ${fmt(c.vantagemMax)}`
      console.log(
        `   ${String(d).padStart(4)} | ${String(m ? m.nPesquisas : 0).padStart(2)} | ${String(m ? m.nInstitutos : 0).padStart(4)} | ` +
          `${(m ? fmt(m.vantagemDem) : 'SEM MEDIA').padStart(8)} | ${(c.esvaziaEm || '-').padStart(10)} | ` +
          `${String(faltam === null ? '-' : faltam + 'd').padStart(6)} | ${passeio.padEnd(23)} | ${c.amplitudePp === null ? '-' : c.amplitudePp + 'pp'}`
      )
    }
    console.log('')
    console.log('   ⚠️ "esvazia em" fora do horizonte da projecao aparece como a data, sem passeio medido:')
    console.log('      a amplitude so vale ate onde a projecao foi calculada.')
    console.log('   ⛔ A largura e REGUA DA CASA e nao se troca no meio da serie sem decisao do Andre:')
    console.log('      alargar trata sintoma, porque a doenca e o indice parar de receber rodadas.')
    console.log('')
  }
}
