#!/usr/bin/env node
/**
 * PASSADA DO PAINEL BRASIL — atalho de ORQUESTRAÇÃO das etapas de MERCADO.
 *
 * ⛔ Sem regra própria, igual ao `rodada-us.mjs`. Só chama, na ordem certa, o
 *    que já existe e já é testado. Se alguma conta aparecer aqui, ela vira a
 *    SEGUNDA cópia de uma regra que já existe.
 *
 * 🔴 POR QUE ELE EXISTE, e o motivo não é conforto. Havia `npm run rodada:usa`
 *    desde 09/Set/2026 e **nada equivalente do lado do Brasil**, que é o país
 *    onde a passada escreve PROSA EDITORIAL em três idiomas. A mesma
 *    assimetria entre países que já custou seis edições do Tradeoff com o
 *    cenário errado. → memory/feedback_ferramenta_pronta_e_nenhum_comando_a_chama.md
 *
 * A ORDEM é o ponto:
 *   1. ler-mercado        a leitura ao vivo, com fresh=1 e país
 *   2. capture-guard      BLOQUEANTE, 8 minutos, e é ele que CERTIFICA
 *   3. amplitude-do-dia   SÓ para os livros que a trava bloqueou (ETAPA 1.8)
 *   4. deltas-brz         a variação contra a certificada ANTERIOR (ETAPA 1.9)
 *
 * 🔑 O passo 4 depende do 2, e o passo 3 depende de SABER QUAIS livros
 *    bloquearam, que só o 2 responde. Rodar os deltas antes da trava terminar
 *    devolve a certificada da véspera com +0,00pp em tudo, que se lê como
 *    "nada se moveu" e vira frase falsa no relatório.
 *
 * ⭐ O PASSO 3 É O QUE ESTE ATALHO ACRESCENTA. A ETAPA 1.8 do comando diz, desde
 *    04/Set/2026, que "a pergunta certa não é publicar ou não, é: este bloqueio
 *    se resolve esperando?", e que ela é MENSURÁVEL pelo `amplitude-do-dia`.
 *    Medido em 21/Set/2026: aquele script **não era chamado por nenhum outro
 *    arquivo do repositório**, só citado em prosa. Régua mensurável que ninguém
 *    mede é régua que sai de cabeça.
 *
 * ⛔ Ele NÃO decide. Imprime o veredito (PASSAGEIRO, ESTRUTURAL ou
 *    INDETERMINADO) e para. Publicar livro bloqueado COM A FAIXA é decisão
 *    editorial e tem quatro obrigações que só quem escreve pode cumprir.
 *
 * ⛔ E ele não coleta notícia, não escreve JSON, não traduz, não commita e não
 *    publica. As ETAPAS 2 em diante seguem à mão.
 *
 * Uso:
 *   node scripts/rodada-brz.mjs
 *   node scripts/rodada-brz.mjs --sem-trava    (pula os 8 min; os deltas saem DEGRADADOS)
 *   node scripts/rodada-brz.mjs --dias=6       (janela do amplitude-do-dia)
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { MAPA_CAPTURA } from './lib/serie-contrato.mjs'

const argv = process.argv.slice(2)
const semTrava = argv.includes('--sem-trava')
const dias = (argv.find((a) => a.startsWith('--dias=')) ?? '--dias=6').slice(7)

/**
 * Livro da trava → slug do book, para o passo 3.
 *
 * 🔑 Por que NÃO sai inteiro do `MAPA_CAPTURA`: aquele mapa existe para juntar
 *    a captura com a SÉRIE, e por isso só lista os livros que têm série casável.
 *    O 2º e o 3º lugar têm dezenas de desfechos e não entram lá, mas bloqueiam
 *    a trava como qualquer outro. Os três que existem nos dois lugares são
 *    conferidos abaixo, para uma divergência futura não passar calada.
 */
const SLUG_DO_LIVRO = {
  presidential: 'brazil-presidential-election',
  secondPlace: 'brazil-presidential-election-first-round-2nd-place',
  thirdPlace: 'brazil-presidential-election-first-round-3rd-place',
  stf: 'any-brazil-stf-justice-removed-by-impeachment-before-2027',
  senate: 'next-brazil-senate-election-most-seats-won',
  inflation: 'brazil-annual-inflation-2026',
}

// 🕳️ Anti-divergência: o que existe nos dois mapas tem de bater. Sem isto, um
//    conserto no MAPA_CAPTURA deixaria este arquivo apontando para o slug velho.
for (const linha of MAPA_CAPTURA.br ?? []) {
  const meu = SLUG_DO_LIVRO[linha.grupo]
  if (meu && meu !== linha.slug) {
    console.error(`❌ MAPA DIVERGENTE para "${linha.grupo}": aqui ${meu}, em MAPA_CAPTURA ${linha.slug}`)
    process.exit(1)
  }
}

const regua = '─'.repeat(72)
const resultados = []

function rodar(id, titulo, cmd, args, { bloqueante = false } = {}) {
  console.log('')
  console.log(regua)
  console.log(`▶️  ${titulo}`)
  console.log(regua)
  const r = spawnSync(cmd, args, { stdio: 'inherit' })
  const codigo = r.error ? null : r.status
  resultados.push({ id, codigo, estado: r.error ? 'NAO EXECUTOU' : codigo === 0 ? 'ok' : 'saiu != 0' })
  if (r.error) console.log(`❌ ${id}: não foi possível executar (${r.error.message})`)
  if (bloqueante && codigo !== 0) return false
  return true
}

console.log('')
console.log(`🇧🇷 PASSADA DO PAINEL BRASIL · ${new Date().toISOString()}`)
console.log('   orquestração apenas: nenhuma conta é feita aqui')

// ── 1/4 ────────────────────────────────────────────────────────────────────
rodar('ler-mercado', '1/4 · LEITURA AO VIVO — fresh=1 e país', process.execPath, [
  'scripts/ler-mercado.mjs',
  '--pais=br',
])

// ── 2/4 ────────────────────────────────────────────────────────────────────
if (semTrava) {
  console.log('')
  console.log(regua)
  console.log('⏭️  2/4 · TRAVA DE CAPTURA  PULADA por --sem-trava')
  console.log('   ⚠️ Os deltas do passo 4 sairão sobre a certificada ANTERIOR, e')
  console.log('      a comparação passa a ser contra ela mesma. Não publicar assim.')
  resultados.push({ id: 'trava', codigo: null, estado: 'PULADO' })
} else {
  rodar('trava', '2/4 · TRAVA DE CAPTURA — BLOQUEANTE, duas leituras a 8 minutos', 'npx', [
    'tsx',
    'scripts/capture-guard.ts',
  ])
}

// ── 3/4 ── ETAPA 1.8, e só dispara quando há o que decidir ─────────────────
console.log('')
console.log(regua)
console.log('▶️  3/4 · LIVRO BLOQUEADO — este bloqueio se resolve esperando?')
console.log(regua)

const CACHE = '.cache/capture-guard/ultima-br.json'
let bloqueados = []
let carimbo = null
if (!existsSync(CACHE)) {
  console.log(`   ⚠️ sem ${CACHE}: a trava não gravou instantâneo nesta máquina.`)
  console.log('      Não é "nenhum livro bloqueou": é que não dá para saber.')
  resultados.push({ id: 'bloqueio', codigo: null, estado: 'NAO MEDIU' })
} else {
  try {
    const s = JSON.parse(readFileSync(CACHE, 'utf8'))
    carimbo = s.fetchedAt ?? null
    bloqueados = Object.entries(s.livros ?? {})
      .filter(([, v]) => v && v.ok === false)
      .map(([k]) => k)
  } catch (e) {
    console.log(`   ⚠️ ${CACHE} ilegível: ${e.message}`)
  }

  console.log(`   certificada: ${carimbo ?? '(sem carimbo)'}`)
  if (bloqueados.length === 0) {
    console.log('   ✅ nenhum livro bloqueou nesta captura: nada a decidir aqui.')
    resultados.push({ id: 'bloqueio', codigo: 0, estado: 'ok (nada bloqueou)' })
  } else {
    console.log(`   🔒 ${bloqueados.length} livro(s) bloqueado(s): ${bloqueados.join(', ')}`)
    console.log('   Medindo a amplitude do dia de cada um, que é o que separa')
    console.log('   PASSAGEIRO (recapturar) de ESTRUTURAL (publicar COM A FAIXA).')
    let falhou = 0
    for (const livro of bloqueados) {
      const slug = SLUG_DO_LIVRO[livro]
      if (!slug) {
        console.log(`\n   ⚠️ "${livro}" bloqueou e não tem slug mapeado aqui: medir à mão.`)
        falhou++
        continue
      }
      console.log('')
      const r = spawnSync(process.execPath, ['scripts/amplitude-do-dia.mjs', `--slug=${slug}`, `--dias=${dias}`], {
        stdio: 'inherit',
      })
      if (r.error || r.status !== 0) falhou++
    }
    console.log('')
    console.log('   ⛔ O veredito acima NÃO autoriza publicar sozinho. ESTRUTURAL exige')
    console.log('      as quatro obrigações da ETAPA 1.8: a faixa e o dinheiro novo ao')
    console.log('      lado do número, a declaração da exceção, o conserto das duas')
    console.log('      frases que a página diz sobre si mesma, e o carimbo SEM a')
    console.log('      palavra "confirmada".')
    resultados.push({ id: 'bloqueio', codigo: falhou ? 1 : 0, estado: falhou ? `${falhou} sem medir` : 'ok' })
  }
}

// ── 4/4 ────────────────────────────────────────────────────────────────────
rodar('deltas', '4/4 · DELTAS — contra a certificada ANTERIOR, livro a livro', process.execPath, [
  'scripts/deltas-brz.mjs',
  '--certificado',
  '--registrar',
])

// ── o comando de tela, pronto ──────────────────────────────────────────────
console.log('')
console.log(regua)
console.log('🖥️  CONFERIDOR DE TELA — comando pronto, para rodar DEPOIS do deploy')
console.log('')
console.log('   node scripts/conferir-tela.mjs --pais=br --esperado=<4 valores>')
console.log('')
console.log('   ⚠️ Valores na convenção do INGLÊS, com ponto: ele converte sozinho')
console.log('      para vírgula no pt-BR e no ES.')
console.log('   ⚠️ A tela serve CACHE e a leitura saiu com fresh=1, então elas podem')
console.log('      discordar por minutos sem nada estar errado. Por isso ele não roda')
console.log('      aqui: portão que reprova o que está certo gasta o crédito do portão.')

// ── resumo ─────────────────────────────────────────────────────────────────
console.log('')
console.log(regua)
console.log('📋 RESUMO DA PASSADA')
console.log('')
for (const r of resultados) {
  const marca = r.estado === 'PULADO' ? '⏭️ ' : r.codigo === 0 ? '✅' : r.codigo === null ? '⚠️ ' : '⚠️ '
  const cod = r.codigo === null ? '  -' : String(r.codigo).padStart(3)
  console.log(`   ${marca} ${r.id.padEnd(12)} saída ${cod}   ${r.estado}`)
}
console.log('')
console.log('   🔑 A trava pode BLOQUEAR sem a passada ser inútil: a certificação é')
console.log('      POR LIVRO, e os aprovados publicam. Ler a linha "CERTIFICAÇÃO POR')
console.log('      LIVRO", não só o VEREDITO do conjunto.')
console.log('')
console.log('   ⛔ Nada foi escrito, traduzido, commitado nem publicado.')
console.log('      As ETAPAS 2 em diante do /atualizar-brz seguem à mão.')
console.log('')
