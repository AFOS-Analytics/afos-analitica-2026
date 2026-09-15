#!/usr/bin/env node
/**
 * 🔬 A rodada que ficou fora do índice mede a MESMA COISA que a nossa média?
 *
 * ─── POR QUE ESTE SCRIPT EXISTE ─────────────────────────────────────────────
 *
 * O `fora-do-indice.mjs` responde "existe rodada com campo mais novo do que o
 * índice tem?". É uma pergunta sobre DATA, e ela foi respondida certo. Só que
 * dois leitores transformavam a resposta numa afirmação que a medição não
 * sustenta, o passo 1 do `polls:usa` e o e-mail do cron, nestas palavras:
 *
 *     "o buraco é do ÍNDICE, não das casas"
 *
 * Em 15/Set/2026 essa frase estava errada. As duas rodadas da The
 * Economist/YouGov fora do índice (4-8/Set e 11-14/Set) trocaram de
 * instrumento: a cédula passou a ser NOMINAL, com o eleitor vendo os nomes dos
 * candidatos do distrito dele. Não é generic ballot. O índice pode estar
 * excluindo as duas com razão.
 *
 * 🔑 E o custo não era só de frase. O `exposicao.mjs` projeta as rodadas
 * devidas pela CADÊNCIA da casa, então cobrava da YouGov 07/Set e 14/Set e
 * somava as duas no número que a passada imprime. Rodada de outro instrumento
 * não é devida a esta média.
 *
 * ─── A REGRA QUE ELE SEGUE ──────────────────────────────────────────────────
 *
 * 🎯 A lista de documentos vem da LISTAGEM da própria casa, que é a mesma que
 * o portão já consulta, e nunca de URL que alguém colou. Conferir só o que eu
 * reparei trocaria uma amostra sistemática por uma escolhida, que é a família
 * de defeito que o AFOS existe para não cometer.
 * Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
 *
 * ⛔ Ele NÃO ingere, NÃO escreve em `public/us-polls-data.json` e NÃO decide
 * composição de média. Ingerir muda a procedência e segue decisão do André.
 *
 * ─── COMO RODAR ─────────────────────────────────────────────────────────────
 *
 *   node scripts/conferir-instrumento-us.mjs                      # casas com rodada fora do indice
 *   node scripts/conferir-instrumento-us.mjs --casa="The Economist/YouGov"
 *   node scripts/conferir-instrumento-us.mjs --url=<pdf>          # um documento so
 *   node scripts/conferir-instrumento-us.mjs --texto=<arquivo.txt> # sem rede, para depurar
 *
 * ⚠️ Depende do `pdftotext`. Ele existe nesta máquina (MiKTeX) e NÃO existe no
 * CI nem na Vercel, então este script é conferidor de rodada e nunca passo de
 * cron. Sem o binário ele sai INDETERMINADO e código 1, nunca "nada novo".
 */
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { medirCadencia } from '../lib/us-polls/atraso.mjs'
import { LISTAGENS_POR_CASA, verificarCasasAtrasadas } from '../lib/us-polls/fora-do-indice.mjs'
import { classificarLote, VEREDITOS_INSTRUMENTO as V } from '../lib/us-polls/instrumento.mjs'

const UA = 'AFOS-Analytics/1.0 (https://www.afos-analytics.com; pesquisa academica aberta)'
const ARQUIVO_PADRAO = 'public/us-polls-data.json'

const argv = process.argv.slice(2)
const valor = (f) => argv.find((a) => a.startsWith(`${f}=`))?.slice(f.length + 1) ?? null
const temFlag = (f) => argv.includes(f)

/**
 * Onde o `pdftotext` costuma estar nesta máquina. A busca é por ORDEM e para
 * no primeiro que existe; nada de tentar adivinhar versão.
 */
const CAMINHOS_PDFTOTEXT = [
  'pdftotext',
  join(process.env.LOCALAPPDATA ?? '', 'Programs', 'MiKTeX', 'miktex', 'bin', 'x64', 'pdftotext.exe'),
  'C:/Program Files/MiKTeX/miktex/bin/x64/pdftotext.exe',
  'C:/Program Files/Git/mingw64/bin/pdftotext.exe',
]

function acharPdftotext() {
  for (const c of CAMINHOS_PDFTOTEXT) {
    try {
      if (c !== 'pdftotext' && !existsSync(c)) continue
      execFileSync(c, ['-v'], { stdio: 'ignore' })
      return c
    } catch {
      // -v sai com codigo != 0 em algumas builds mesmo funcionando
      try {
        if (c === 'pdftotext' || existsSync(c)) {
          execFileSync(c, ['-h'], { stdio: 'ignore' })
          return c
        }
      } catch {
        /* segue procurando */
      }
    }
  }
  return null
}

async function baixar(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 30_000)
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA }, signal: ctrl.signal })
    if (!r.ok) return { erro: `HTTP ${r.status}` }
    return { buffer: Buffer.from(await r.arrayBuffer()) }
  } catch (e) {
    return { erro: e?.name === 'AbortError' ? 'tempo esgotado' : String(e?.message ?? e) }
  } finally {
    clearTimeout(t)
  }
}

/**
 * Os PDFs de uma casa, tirados da listagem DELA.
 *
 * A regra é deliberadamente burra: todo link `.pdf` da página. Uma regra
 * esperta por casa seria mais uma superfície para mudar de formato em
 * silêncio, e este script prefere trazer documento a mais do que a menos.
 */
async function pdfsDaListagem(instituto) {
  const reg = LISTAGENS_POR_CASA[instituto]
  if (!reg?.url) return { erro: 'casa nao esta no registro de listagens', url: null, pdfs: [] }
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 30_000)
  try {
    const r = await fetch(reg.url, { headers: { 'user-agent': UA }, signal: ctrl.signal })
    if (!r.ok) return { erro: `HTTP ${r.status} na listagem`, url: reg.url, pdfs: [] }
    const html = await r.text()
    const pdfs = [...new Set([...html.matchAll(/https?:\/\/[^"'\s<>\\]+?\.pdf/gi)].map((m) => m[0]))]
    return { erro: null, url: reg.url, pdfs }
  } catch (e) {
    return { erro: String(e?.message ?? e), url: reg.url, pdfs: [] }
  } finally {
    clearTimeout(t)
  }
}

/**
 * 🎯 QUEM ENTRA NA CONFERÊNCIA, e a resposta não é "todo mundo do registro".
 *
 * Varrer as onze casas baixaria todo `.pdf` de toda listagem, incluindo
 * material que nada tem a ver com generic ballot, e seria peso gratuito nos
 * servidores dos institutos. Pior: seria conferir por conta própria, quando a
 * régua da casa diz que a lista vem do PORTÃO.
 *
 * Então a mesma dupla que o passo 1 já usa decide aqui: `medirCadencia` aponta
 * quem está fora do próprio ritmo, e `verificarCasasAtrasadas` diz quais delas
 * têm rodada com campo mais novo do que o índice tem. Só essas.
 * Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
 */
async function casasComRodadaFora() {
  if (!existsSync(ARQUIVO_PADRAO)) return []
  const dados = JSON.parse(readFileSync(ARQUIVO_PADRAO, 'utf8'))
  const cad = medirCadencia(dados)
  if (!cad?.atrasadas?.length) return []
  const ver = await verificarCasasAtrasadas(dados, cad)
  return (ver?.comRodadaFora ?? []).map((v) => v.instituto ?? v)
}

/** As datas de campo que a NOSSA base já tem daquela casa. */
function camposQueJaTemos(instituto) {
  if (!existsSync(ARQUIVO_PADRAO)) return new Set()
  try {
    const dados = JSON.parse(readFileSync(ARQUIVO_PADRAO, 'utf8'))
    return new Set(
      (dados.polls ?? []).filter((p) => p.instituto === instituto).map((p) => `${p.campoInicio}→${p.campoFim}`),
    )
  } catch {
    return new Set()
  }
}

const MARCA = {
  [V.GENERICO]: '✅',
  [V.NOMINAL]: '🔀',
  [V.COM_RESSALVA]: '⚠️',
  [V.AUSENTE]: '➖',
  [V.INDETERMINADO]: '⚠️',
}

async function main() {
  console.log('\n🔬 INSTRUMENTO DAS RODADAS FORA DO ÍNDICE  [USO INTERNO, nao publicar]')

  const bin = acharPdftotext()
  const soTexto = valor('--texto')
  if (!bin && !soTexto) {
    console.log('\n   ⚠️ INDETERMINADO: `pdftotext` nao encontrado nesta maquina.')
    console.log('      Procurado em:')
    for (const c of CAMINHOS_PDFTOTEXT) console.log(`        ${c}`)
    console.log('      Isto NAO quer dizer que as rodadas estao em ordem. Quer dizer que nao deu para olhar.')
    process.exit(1)
  }

  // ── modo offline: um texto ja extraido ──────────────────────────────────
  if (soTexto) {
    const texto = readFileSync(soTexto, 'utf8')
    const { resultados } = classificarLote([{ rotulo: soTexto, texto }])
    imprimir(resultados)
    process.exit(0)
  }

  const dir = mkdtempSync(join(tmpdir(), 'afos-instrumento-'))
  const umaUrl = valor('--url')
  const casaPedida = valor('--casa')

  /** @type {{instituto: string, url: string|null, docs: any[], erro: string|null}[]} */
  const porCasa = []

  if (umaUrl) {
    porCasa.push({ instituto: '(url avulsa)', url: null, erro: null, docs: [{ url: umaUrl }] })
  } else {
    const casas = casaPedida ? [casaPedida] : await casasComRodadaFora()
    if (!casas.length) {
      console.log('\n   ✅ nenhuma casa com rodada fora do índice nesta passada. Nada a conferir.')
      console.log('      Para forçar uma casa: --casa="The Economist/YouGov"')
      process.exit(0)
    }
    for (const c of casas) {
      const { erro, url, pdfs } = await pdfsDaListagem(c)
      if (erro && !pdfs.length) {
        porCasa.push({ instituto: c, url, erro, docs: [] })
        continue
      }
      if (!pdfs.length) {
        porCasa.push({ instituto: c, url, erro: 'listagem sem link de PDF', docs: [] })
        continue
      }
      porCasa.push({ instituto: c, url, erro: null, docs: pdfs.map((u) => ({ url: u })) })
    }
  }

  let saida = 0
  for (const casa of porCasa) {
    console.log(`\n── ${casa.instituto}`)
    if (casa.url) console.log(`   listagem ${casa.url}`)
    if (casa.erro) {
      console.log(`   ⚠️ INDETERMINADO — ${casa.erro}`)
      console.log('      NAO e "nada novo": e o conferidor dizendo que nao enxergou a listagem.')
      saida = 1
      continue
    }

    const documentos = []
    for (const d of casa.docs) {
      const nome = d.url.split('/').pop()
      const { buffer, erro } = await baixar(d.url)
      if (erro) {
        documentos.push({ rotulo: nome, url: d.url, texto: '' })
        console.log(`   ⚠️ ${nome}: download falhou (${erro})`)
        continue
      }
      const pdf = join(dir, nome)
      const txt = `${pdf}.txt`
      writeFileSync(pdf, buffer)
      let texto = ''
      try {
        execFileSync(bin, ['-layout', pdf, txt], { stdio: 'ignore' })
        texto = readFileSync(txt, 'utf8')
      } catch (e) {
        console.log(`   ⚠️ ${nome}: pdftotext falhou (${String(e?.message ?? e).slice(0, 80)})`)
      }
      documentos.push({ rotulo: nome, url: d.url, texto })
    }

    const lote = classificarLote(documentos)
    const jaTemos = camposQueJaTemos(casa.instituto)
    imprimir(lote.resultados, jaTemos)

    console.log(
      `   📊 ${lote.comparaveis.length} comparavel(is) · ${lote.naoComparaveis.length} de outro instrumento ou sem a pergunta · ${lote.naoConcluidos.length} nao concluido(s)`,
    )
    if (lote.naoConcluidos.length) saida = 1

    // ⚠️ `=== false` e nao `!r.jaNaBase`: campo ilegivel vem como null, e null
    // nao e "falta na base". Contar o ilegivel como rodada nova fabricaria o
    // buraco que este script existe justamente para nao afirmar sem medir.
    const genericosNovos = lote.comparaveis.filter((r) => r.jaNaBase === false)
    if (genericosNovos.length) {
      console.log(
        `   🔴 ${genericosNovos.length} documento(s) com a MESMA pergunta e campo que a nossa base nao tem: aqui o buraco e mesmo do indice`,
      )
    } else if (lote.naoComparaveis.length) {
      console.log(
        '   📌 nenhum documento novo com a MESMA pergunta. Rodada fora do indice NAO prova buraco do indice:',
      )
      console.log('      a casa pode ter trocado o instrumento, e o indice pode estar excluindo com razao.')
    }
  }

  console.log('\n⛔ Nada foi ingerido. Composicao da media servida nao mudou.\n')
  process.exit(saida)
}

function imprimir(resultados, jaTemos = new Set()) {
  for (const r of resultados) {
    const campo = r.campo ?? '(campo nao lido)'
    const amostra = r.amostra ? `${r.amostra.n} ${r.amostra.tipo}` : '(amostra nao lida)'

    // 🔑 Campo que NAO deu para ler nao conta como "falta na base". Sem campo
    // nao existe comparacao, e chamar isso de rodada nova seria fabricar
    // buraco a partir de uma leitura que falhou.
    r.jaNaBase = r.campoIso ? jaTemos.has(`${r.campoIso.inicio}→${r.campoIso.fim}`) : null
    const selo = r.jaNaBase === true ? ' · JA NA BASE' : r.jaNaBase === false ? ' · fora da base' : ' · campo ilegivel'

    console.log(`   ${MARCA[r.veredito] ?? '·'} ${r.veredito.padEnd(14)} ${r.rotulo}${selo}`)
    console.log(`        campo ${campo} · ${amostra}${r.margemErro != null ? ` · margem ±${r.margemErro}` : ''}`)
    console.log(`        ${r.motivo}`)
    if (r.ressalva) console.log(`        ressalva: «${r.ressalva}»`)
    if (r.numeros && r.numeros.dem != null) {
      const n = r.numeros
      console.log(
        `        D ${n.dem} · R ${n.rep} · outro ${n.outro ?? '-'} · nao sei ${n.naoSei ?? '-'} · nao vou ${n.naoVou ?? '-'} · soma ${n.soma}`,
      )
    }
    if (r.url) console.log(`        ${r.url}`)
  }
}

main().catch((e) => {
  console.error('\n⚠️ INDETERMINADO — o conferidor caiu:', e?.message ?? e)
  console.error('   Isto NAO e "nada novo".')
  process.exit(1)
})
