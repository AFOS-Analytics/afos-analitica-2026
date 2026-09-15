#!/usr/bin/env node
/**
 * ÍNDICE x MUNDO — o campo mais recente declarado pelos agregadores, contra o
 * da nossa base.  [USO INTERNO, nao publicar]
 *
 * Responde a pergunta que o "atraso da fonte" do coletor não sabe responder:
 * a base está parada porque ninguém mediu nada, ou porque o índice não recebeu?
 *
 * Toda a regra vive em `lib/us-polls/agregadores.mjs`. Este arquivo só lê a
 * base, faz a requisição e imprime.
 *
 * ⛔ Lê SÓ a data de campo dos agregadores, nunca o percentual, e não mexe na
 *    média. Não é portão: sai 0 em todo veredito, inclusive INCONCLUSIVO.
 *
 * Uso:
 *   node scripts/agregadores-us-polls.mjs
 *   node scripts/agregadores-us-polls.mjs --arquivo=public/us-polls-data.json
 *   node scripts/agregadores-us-polls.mjs --wikitext=caminho.txt   (sem rede)
 */

import { readFileSync } from 'node:fs'
import { medirAtraso } from '../lib/us-polls/atraso.mjs'
import {
  buscarAgregadores,
  compararComBase,
  lerAgregadores,
  URL_AGREGADORES_RAW,
  VEREDITOS,
} from '../lib/us-polls/agregadores.mjs'

const valorDe = (nome) => {
  const a = process.argv.slice(2).find((x) => x.startsWith(`--${nome}=`))
  return a ? a.slice(nome.length + 3) : null
}

const ARQUIVO = valorDe('arquivo') || 'public/us-polls-data.json'
const WIKITEXT = valorDe('wikitext')

const dados = JSON.parse(readFileSync(ARQUIVO, 'utf8'))
const agora = new Date()
const hoje = agora.toISOString().slice(0, 10)
const { campoMaisRecente } = medirAtraso(dados, agora)

const leitura = WIKITEXT
  ? { ...lerAgregadores(readFileSync(WIKITEXT, 'utf8')), erro: null }
  : await buscarAgregadores()

const r = compararComBase(leitura, campoMaisRecente, hoje)

console.log('ÍNDICE x MUNDO — campo declarado pelos agregadores  [USO INTERNO, nao publicar]')
console.log(`   fonte ${WIKITEXT ? WIKITEXT : URL_AGREGADORES_RAW}`)
console.log(`   nossa base: campo mais recente ${campoMaisRecente ?? '-'} (${ARQUIVO})`)
if (leitura.erro) console.log(`   ⚠️ leitura: ${leitura.erro}`)
console.log('')

for (const a of leitura.agregadores) {
  const fim = a.campoFim ?? 'ILEGÍVEL'
  const atual = a.atualizadoEm ?? '-'
  console.log(`   ${a.nome.padEnd(22)} campo até ${fim.padEnd(10)} · atualizado ${atual}   ("${a.campoTexto}")`)
}
if (leitura.agregadores.length) console.log('')

const marca = {
  [VEREDITOS.ATRASADO]: '🔴',
  [VEREDITOS.COMPASSO]: '✅',
  [VEREDITOS.A_FRENTE]: '🔵',
  [VEREDITOS.INCONCLUSIVO]: '⚪',
}[r.veredito]

console.log(`   ${marca} VEREDITO: ${r.veredito}`)
console.log(`      ${r.motivo}`)
if (r.referencia) {
  console.log(`      referência ${r.referencia} (sustentada por ${r.lidos >= 2 ? 'pelo menos 2' : r.lidos} de ${r.lidos} legíveis) · tabela atualizada em ${r.ultimaAtualizacao ?? '-'}`)
}
console.log('')

if (r.veredito === VEREDITOS.ATRASADO) {
  console.log('   🔑 Existem pesquisas com campo depois da nossa base, e o índice não as tem.')
  console.log('      A leitura prova EXISTÊNCIA, não diz quais são nem de que casa.')
  console.log('      ⛔ Não autoriza ingerir: ler rodada no instituto muda a procedência')
  console.log('         da média e é decisão do André, por casa.')
  console.log('      ⛔ E não se publica: é fato sobre a nossa coleta, não sobre a eleição.')
} else if (r.veredito === VEREDITOS.COMPASSO || r.veredito === VEREDITOS.A_FRENTE) {
  console.log('   📌 O alcance é a PONTA, não a CONTAGEM: compara só a data de campo mais recente.')
  console.log('      Rodada do MEIO da janela que o índice não recebeu não aparece aqui.')
  console.log('      Quem responde isso é o passo 1 do polls:usa: listagens das casas e exposição da média.')
} else if (r.veredito === VEREDITOS.INCONCLUSIVO) {
  console.log('   INCONCLUSIVO não é "em compasso": é o medidor dizendo que não enxergou.')
}
