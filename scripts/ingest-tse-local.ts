/**
 * ingest-tse-local.ts — ingere o ZIP oficial de pesquisas do TSE a partir de um
 * arquivo LOCAL, quando a coleta automática não consegue alcançar o CDN.
 *
 * Uso:
 *   npx tsx scripts/ingest-tse-local.ts caminho/para/pesquisa_eleitoral_2026.zip
 *   npx tsx scripts/ingest-tse-local.ts <arquivo> --apply     # grava no Neon
 *
 * 🔴 POR QUE ISTO EXISTE. Em 18/Ago/2026 às 18h02 o CDN do TSE passou a
 * responder 403 na borda da Akamai, e a ingestão diária parou. Medido: o 403
 * atinge todo host do TSE atrás de `*.edgesuite.net` (`cdn`, `www`,
 * `dadosabertos`, `divulgacandcontas`) e também os TREs, enquanto
 * `sig.tse.jus.br`, que não está atrás da CDN, responde normalmente.
 *
 * ⛔ ISTO NÃO É CONTORNO DE BLOQUEIO, e a distinção importa:
 *   - o arquivo é o MESMO ZIP oficial, baixado do Portal de Dados Abertos;
 *   - quem baixa é uma PESSOA, com navegador, que é o uso previsto do portal;
 *   - nada aqui disfarça agente, troca origem ou repete tentativa.
 * O que muda é apenas QUEM foi até o arquivo. O dado e a procedência são os
 * mesmos, e por isso o parser e o persist também são os mesmos: um segundo
 * caminho de gravação seria duas cópias da mesma regra.
 *
 * 📌 `runType` sai como `tse_manual` de propósito, para a trilha registrar como
 * a linha entrou. Não é para distinguir a FONTE, que continua sendo o TSE.
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { readFileSync, existsSync, statSync } from 'fs'
import { basename } from 'path'
import { parseTSEZipBytes, filterRecentPolls, detectScope } from '../lib/tse/ingest'
import type { TSEPoll } from '../lib/tse/ingest'

// 🔴 `lib/tse/persist` importa `lib/db`, que resolve a DATABASE_URL NO MOMENTO
// EM QUE É CARREGADO. Importado no topo, ele carrega antes do dotenv rodar e o
// prisma nasce nulo. E `persistPolls` devolve `{inserted: 0, skipped: 0}` quando
// não há banco, ou seja: com `--apply` o script imprimiria "✅ 0 inserida(s)" e
// NÃO GRAVARIA NADA, reportando sucesso. Pego no primeiro ensaio, pela linha
// "[db] DATABASE_URL não configurada" que apareceu ANTES do dotenv.
// Por isso o import é dinâmico, depois do config() acima.
async function carregarPersist() {
  return (await import('../lib/tse/persist')).persistPolls
}

const ANO = 2026

// ⚠️ `classifyScope` recebe TRÊS campos e devolve `{scope, source}`; `detectScope`
// devolve só a string. Passar o objeto da pesquisa inteiro não dá erro: cai em
// 'unknown' e o contador de nacionais zera CALADO. Ver a mesma família de defeito
// em feedback_loader_descarta_bloco_com_campo_errado_em_silencio.
const ehNacional = (p: TSEPoll) =>
  detectScope(p.metodologia, p.planoAmostral, p.dadoMunicipio) === 'national'

async function main() {
  const args = process.argv.slice(2)
  const caminho = args.find(a => !a.startsWith('--'))
  const aplicar = args.includes('--apply')

  if (!caminho) {
    console.error('❌ Falta o caminho do ZIP.\n   npx tsx scripts/ingest-tse-local.ts pesquisa_eleitoral_2026.zip [--apply]')
    process.exit(1)
  }
  if (!existsSync(caminho)) {
    console.error(`❌ Arquivo não encontrado: ${caminho}`)
    process.exit(1)
  }

  const info = statSync(caminho)
  console.log(`\n📦 ${basename(caminho)}  ${(info.size / 1024 / 1024).toFixed(2)} MB  modificado ${info.mtime.toISOString()}`)

  // ⚠️ Portal de erro devolve HTML com extensão .zip quando alguém salva a
  // página de 403 por engano. Vale conferir a assinatura antes de culpar o parser.
  const bytes = readFileSync(caminho)
  if (!(bytes[0] === 0x50 && bytes[1] === 0x4b)) {
    console.error('❌ Isto não é um ZIP (faltam os bytes "PK" no início).')
    console.error('   Se você salvou a página do navegador em vez do arquivo, baixe de novo pelo link do conjunto de dados.')
    process.exit(1)
  }

  let polls
  try {
    polls = await parseTSEZipBytes(bytes, ANO)
  } catch (err) {
    console.error(`❌ Falha ao ler o ZIP: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }

  const recentes = filterRecentPolls(polls, 15)
  const nacionais = polls.filter(ehNacional)

  console.log(`\n📊 Presidenciais no arquivo: ${polls.length}`)
  console.log(`   últimos 15 dias: ${recentes.length}  |  escopo nacional: ${nacionais.length}`)

  // 🔒 Portão de colapso, mesma régua do /atualizar-pesquisas-brz: arquivo que
  // volta vazio ou quase vazio não sobrescreve base boa.
  if (polls.length === 0) {
    console.error('\n❌ ZERO pesquisas presidenciais. NÃO gravar. Conferir se o ZIP é o do ano certo.')
    process.exit(1)
  }

  const maisRecente = polls.map(p => p.campoFim).filter(Boolean).sort().pop()
  console.log(`   campo mais recente no arquivo: ${maisRecente}`)

  const novas = recentes
    .filter(ehNacional)
    .sort((a, b) => (b.divulgacao || '').localeCompare(a.divulgacao || ''))
    .slice(0, 12)
  if (novas.length) {
    console.log('\n🗳️  Nacionais recentes no arquivo:')
    for (const p of novas) {
      console.log(`   ${p.divulgacao}  ${(p.institutoFantasia || p.instituto).slice(0, 34).padEnd(34)} campo ${p.campoInicio} a ${p.campoFim}  n=${p.amostra}  ${p.protocolo}`)
    }
  }

  if (!aplicar) {
    console.log('\n🔵 ENSAIO: nada foi gravado. Repita com --apply para persistir no Neon.')
    return
  }

  // 🔒 Sem banco, PARAR. Não deixar o persist devolver zero e isso passar por sucesso.
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ DATABASE_URL ausente. Sem banco o persist devolve 0 e pareceria sucesso. Nada foi gravado.')
    process.exit(1)
  }

  console.log('\n💾 Gravando...')
  const persistPolls = await carregarPersist()
  const { inserted, skipped } = await persistPolls(polls, 'tse_manual')
  console.log(`✅ ${inserted} inserida(s), ${skipped} já existente(s).`)

  // 🔒 Conferir que o número bate com o que se esperava gravar.
  if (inserted === 0 && skipped === 0) {
    console.error('❌ Zero inseridas E zero puladas com arquivo não vazio: o persist não viu o banco. Tratar como FALHA.')
    process.exit(1)
  }
  console.log('\n📋 Depois disto: rodar /atualizar-brz para o painel refletir, se algo nacional entrou.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
