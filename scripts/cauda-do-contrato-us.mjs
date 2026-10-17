#!/usr/bin/env node
/**
 * cauda-do-contrato-us.mjs · FECHA a cauda cega do backup com os pontos
 * INTRADIÁRIOS da rota de histórico, em vez de com um ponto só.
 *
 * ─── O DEFEITO QUE ELE EXISTE PARA MATAR ────────────────────────────────────
 *
 * 🔴 O backup do Neon é gerado 1x por dia e a série viva cresce o dia inteiro,
 *    então entre o último ponto do backup e agora existe uma CAUDA CEGA. O
 *    `serie-do-contrato.mjs` já a fecha, mas com a LEITURA CERTIFICADA da trava
 *    de captura, que é UM ponto. Um ponto não cobre uma janela.
 *
 * 💥 Dois superlativos FALSOS foram publicados por isso, em 09 e 13/Out/2026.
 *    O caso de 13/Out é o retrato: o topo da série era 99,10, tocado às 18:30Z,
 *    **57 minutos ANTES** da leitura certificada das 19:27Z, que marcava 99,05.
 *    O backup não tinha, a certificada não viu, e saiu "RECORDE" sobre o valor
 *    errado. → memory/feedback_o_backup_tem_uma_cauda_cega_de_ate_um_dia.md
 *
 * ⚠️ E o limiar `CAUDA_CEGA_ESPERADA_H = 26` nunca disparou nos dois casos,
 *    porque as caudas reais moram em ~22h. Ele avisa sobre o TAMANHO da cauda;
 *    ele não a FECHA. São coisas diferentes, e eu as confundi por dois dias.
 *
 * ─── POR QUE A ROTA DE HISTÓRICO, QUE A RÉGUA PROÍBE ────────────────────────
 *
 * 🔑 A proibição é REAL e continua valendo, mas ela é sobre OUTRA coisa: a rota
 *    trava a janela em 90 dias e devolve `truncated: false`, escondendo o
 *    começo da série do Senado. Isso envenena superlativo de SÉRIE INTEIRA.
 *
 * ✅ Para uma cauda de horas o defeito dos 90 dias **não existe**, e a rota é a
 *    única fonte que tem os pontos daquele intervalo.
 *
 * 🧪 E não é aposta: o CONTROLE POSITIVO roda por série, comparando rota e
 *    backup na janela em que os dois têm dado. Medido em 16/Out/2026 na Câmara
 *    democrata: 15 pontos de cada lado, mesmos valores e mesmos carimbos.
 *    Série cujo controle não fecha sai INDETERMINADO, nunca "fechada".
 *
 * ⛔ Ele NÃO substitui o `serie-do-contrato.mjs` e NÃO publica nada: a série
 *    inteira segue saindo do backup. Isto mede só o pedaço que o backup não
 *    tem, que é exatamente onde os dois erros moraram.
 *
 * ─── COMO LER ───────────────────────────────────────────────────────────────
 *
 *   CAUDA FECHADA         há pontos na cauda e nenhum ultrapassa o extremo
 *   CAUDA VAZIA           cauda menor que 1h, abaixo da grade de 30 min
 *   🔴 EXTREMO NA CAUDA   há ponto ALÉM do extremo: o superlativo tem de usá-lo
 *   INDETERMINADO         rota muda com cauda aberta, ou controle positivo que
 *                         não fecha. ⛔ NÃO é "nada novo"
 *
 * Saída: 0 tudo fechado · 1 algum indeterminado · 2 extremo na cauda
 *
 * Uso:
 *   node scripts/cauda-do-contrato-us.mjs
 *   node scripts/cauda-do-contrato-us.mjs --slug=which-party-will-win-the-senate-in-2026
 */
import { lerCsvGz } from './serie-do-contrato.mjs'
import { serieDe, agruparPorLivro, extremos, instantesSuspeitos } from './lib/serie-contrato.mjs'
import { baseDeLeitura } from './lib/base-afos.mjs'
import { vereditoDaCauda, controlePositivo, VEREDITO } from '../lib/us-market/cauda-cega.mjs'

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const SO_SLUG = arg('slug')
const DIAS_ROTA = Number(arg('dias') ?? 3)
const BASE = baseDeLeitura()

// Os livros dos EUA que o painel PUBLICA. Distribuicao fica fora: ela nao tem
// superlativo de serie, tem portao de soma.
const PADROES = [/which-party-will-win-the-house/, /which-party-will-win-the-senate/, /midterm-elections-happen-as-scheduled/]

async function pontosDaRota(slug, outcome) {
  // 🔑 A rota casa o contrato pelo prefixo do slug, sem o sufixo do ano, e os
  //    nomes de desfecho se REPETEM entre Camara e Senado: sem o contrato na
  //    consulta as duas series COLAM. Por isso o slug entra sempre, e a
  //    resposta ainda e filtrada pelo slug CHEIO.
  const pais = slug.replace(/-in-\d{4}$/, '')
  const u = `${BASE}/api/market/history?candidate=${encodeURIComponent(outcome)}&country=${encodeURIComponent(pais)}&days=${DIAS_ROTA}`
  try {
    const r = await fetch(u)
    if (!r.ok) return { erro: `HTTP ${r.status}` }
    const j = await r.json()
    const d = Array.isArray(j.data) ? j.data : []
    const meus = d.filter((p) => String(p.slug ?? '') === slug)
    return {
      pontos: meus.map((p) => ({ t: String(p.date), v: Number(p.probability) })),
      deOutroLivro: d.length - meus.length,
    }
  } catch (e) {
    return { erro: String(e.message ?? e).slice(0, 80) }
  }
}

async function principal() {
  const precos = lerCsvGz('marketPrice')
  if (!precos.length) {
    console.error('❌ nenhum ponto em backup/neon/marketPrice. O backup existe e descompacta?')
    process.exit(1)
  }
  const mercadoDe = new Map(lerCsvGz('market').map((m) => [m.id, m]))
  const outcomeDe = new Map(lerCsvGz('marketOutcome').map((o) => [o.id, o]))

  // A MESMA quarentena do serie-do-contrato, importada e nao reescrita.
  const suspeitos = instantesSuspeitos(precos)
  const limpos = suspeitos.size === 0 ? precos : precos.filter((p) => !suspeitos.has(String(p.snapshotAt).slice(0, 19)))

  const todos = serieDe(limpos, outcomeDe, mercadoDe, SO_SLUG ? { slug: SO_SLUG } : {})
  const livros = agruparPorLivro(SO_SLUG ? todos : todos.filter((p) => PADROES.some((re) => re.test(p.slug))))

  console.log('')
  console.log('🕳️ CAUDA CEGA DO BACKUP, fechada com os pontos intradiários da rota')
  console.log(`   backup: backup/neon/marketPrice · rota: ${BASE}/api/market/history?days=${DIAS_ROTA}`)
  console.log('')

  const agora = new Date()
  let comExtremo = 0
  let indeterminados = 0

  for (const [chave, pontos] of [...livros.entries()].sort()) {
    const [slug, outcome] = chave.split('␟')
    const ext = extremos(pontos)
    const rotulo = `${outcome} · ${slug.replace(/-in-\d{4}$/, '')}`
    if (!ext) continue

    const r = await pontosDaRota(slug, outcome)
    if (r.erro) {
      indeterminados++
      console.log(`   ⚠️ INDETERMINADO  ${rotulo}`)
      console.log(`        a rota não respondeu: ${r.erro}`)
      continue
    }

    // 🧪 CONTROLE POSITIVO antes do veredito: a rota é espelho do gravado?
    const cp = controlePositivo(pontos, r.pontos)
    if (!cp.fiel) {
      indeterminados++
      console.log(`   ⚠️ INDETERMINADO  ${rotulo}`)
      console.log(
        cp.semSobreposicao
          ? '        rota e backup não se sobrepõem, então não há como provar que a rota espelha o gravado'
          : `        🔴 CONTROLE POSITIVO FALHOU: na sobreposição o backup tem ${cp.nBackup} ponto(s) e a rota ${cp.nRota}, carimbos ${cp.mesmosCarimbos ? 'iguais' : 'DIFERENTES'}, valores ${cp.mesmosValores ? 'iguais' : 'DIFERENTES'}`
      )
      continue
    }

    const v = vereditoDaCauda(ext, r.pontos, agora)
    if (v.veredito === VEREDITO.EXTREMO) {
      comExtremo++
      console.log(`   🔴 EXTREMO NA CAUDA  ${rotulo}`)
      if (v.bateTopo) console.log(`        topo do backup ${ext.max.toFixed(2)}% em ${ext.maxEm} e a cauda tem ${v.maxCauda.toFixed(2)}%`)
      if (v.bateFundo) console.log(`        piso do backup ${ext.min.toFixed(2)}% em ${ext.minEm} e a cauda tem ${v.minCauda.toFixed(2)}%`)
      console.log('        ⛔ superlativo escrito sobre o backup sozinho sai FALSO. Usar o valor da cauda.')
    } else if (v.veredito === VEREDITO.INDETERMINADO) {
      indeterminados++
      console.log(`   ⚠️ INDETERMINADO  ${rotulo}`)
      console.log(`        ${v.motivo}`)
    } else {
      console.log(`   ✅ ${v.veredito === VEREDITO.VAZIA ? 'CAUDA VAZIA  ' : 'CAUDA FECHADA'}  ${rotulo}`)
      const faixa = v.naCauda ? `, de ${v.minCauda.toFixed(2)}% a ${v.maxCauda.toFixed(2)}%` : ''
      console.log(`        ${v.naCauda} ponto(s) em ${v.caudaH.toFixed(1)}h${faixa}, dentro de ${ext.min.toFixed(2)}%-${ext.max.toFixed(2)}%`)
      console.log(`        🧪 controle: ${cp.nBackup} ponto(s) de cada lado na sobreposição, idênticos`)
    }
    if (r.deOutroLivro) console.log(`        (${r.deOutroLivro} ponto(s) de outro livro, descartados pelo filtro de slug)`)
  }

  console.log('')
  if (comExtremo) console.log(`🔴 VEREDITO: ${comExtremo} série(s) com EXTREMO NA CAUDA. Nenhum superlativo antes de usar o valor da cauda.`)
  else if (indeterminados) console.log(`⚠️ VEREDITO: INDETERMINADO em ${indeterminados} série(s). Não é "cauda fechada", é não ter enxergado.`)
  else console.log('✅ VEREDITO: CAUDA FECHADA em todas as séries. O extremo do backup é o extremo de agora.')
  console.log('')
  process.exit(comExtremo ? 2 : indeterminados ? 1 : 0)
}

principal()
