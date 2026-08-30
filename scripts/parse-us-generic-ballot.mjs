/**
 * Gera `public/us-polls-data.json` a partir do generic ballot dos EUA.
 *
 * ⚠️ A LÓGICA NÃO MORA MAIS AQUI. Ela está em `lib/us-polls/collect.mjs`, que o
 * cron `/api/cron/refresh-us-polls` também usa. Duas cópias da mesma regra é o
 * defeito que já custou os rótulos de faixa do mercado em 29/Jul: elas convivem
 * sem incidente até o dia em que uma é corrigida e a outra não.
 *
 * Este script continua existindo para a rodada manual e para versionar o
 * arquivo no repositório, que é o que o painel lê quando o Neon não responde.
 *
 * Uso:  node scripts/parse-us-generic-ballot.mjs [--dias=30] [--out=arquivo] [--sem-rede]
 *
 * `--sem-rede` pula a consulta às listagens dos institutos. A coleta em si
 * continua indo à rede: quem é pulado é só o segundo leitor.
 */

import { writeFileSync } from 'fs'
import { coletarGenericBallot } from '../lib/us-polls/collect.mjs'
import { medirAtraso, medirCadencia } from '../lib/us-polls/atraso.mjs'
import { verificarCasasAtrasadas, buracosNoRegistro } from '../lib/us-polls/fora-do-indice.mjs'
import { medirExposicao } from '../lib/us-polls/exposicao.mjs'

const arg = (n, padrao) => {
  const m = process.argv.find((a) => a.startsWith(`--${n}=`))
  return m ? m.split('=')[1] : padrao
}

const dias = Number(arg('dias', '30'))
const saidaPath = arg('out', 'public/us-polls-data.json')
const semRede = process.argv.includes('--sem-rede')

const saida = await coletarGenericBallot({ dias })
writeFileSync(saidaPath, JSON.stringify(saida, null, 2) + '\n', 'utf-8')

console.log(`✅ ${saidaPath}`)
console.log(`   ${saida.qualidade.publicadas} publicadas de ${saida.qualidade.linhasLidas} lidas · ${saida.qualidade.descartadasPorForma} descartada(s) por forma`)
if (saida.mediaAfos) {
  console.log(`   média: Dem ${saida.mediaAfos.dem}% x Rep ${saida.mediaAfos.rep}% (D+${saida.mediaAfos.vantagemDem}) sobre ${saida.mediaAfos.nPesquisas} pesquisas de ${saida.mediaAfos.nInstitutos} institutos`)
}

// ⚠️ ATRASO DA FONTE: medido e IMPRESSO, nunca gravado no arquivo.
// O `saida` acima vira `public/us-polls-data.json`, que é SERVIDO publicamente.
// O atraso é diagnóstico de operador. A regra que isto serve: nunca publicar
// frase que atribui ao MUNDO o que é propriedade da NOSSA coleta.
// Ver lib/us-polls/atraso.mjs e
// memory/feedback_descrever_o_metodo_sim_relatar_a_falha_nao.md
const at = medirAtraso(saida)
if (at.atrasoDias !== null) {
  const sinal = at.atrasoDias >= 14 ? '🔴' : at.atrasoDias >= 7 ? '⚠️' : '·'
  console.log(`   ${sinal} atraso da fonte: ${at.atrasoDias} dia(s), campo mais recente ${at.campoMaisRecente}  [USO INTERNO, nao publicar]`)
}

// ⚠️ CADÊNCIA POR CASA: mesmo regime do atraso acima. Medida, impressa e NUNCA
// gravada no arquivo, que é servido publicamente.
//
// Por que não basta o atraso global: ele mede a PONTA da base e fica verde
// assim que um lote entra, mesmo que o lote tenha pulado a rodada de uma casa.
// Em 24/Ago/2026 entraram 16 linhas de uma vez, o atraso caiu, e a onda de
// 14 a 17/Ago da The Economist/YouGov nunca entrou. Buraco no MEIO da janela
// não mexe na data mais recente, mas mexe na média.
const cad = medirCadencia(saida)
if (cad.atrasadas.length) {
  console.log(`   🔴 ${cad.atrasadas.length} casa(s) fora da própria cadência  [USO INTERNO, nao publicar]`)
  for (const c of cad.atrasadas) {
    console.log(
      `      ${c.instituto}: publica a cada ~${c.cadenciaDias}d, calada há ${c.silencioDias}d (${c.ciclosPerdidos} ciclos), último campo ${c.ultimoCampo}`,
    )
  }
} else if (cad.avaliadas.length) {
  console.log(`   · cadência: ${cad.avaliadas.length} casa(s) avaliada(s), nenhuma fora do próprio ritmo`)
}

// ─── SEGUNDO LEITOR: a rodada existe lá fora? ───────────────────────────────
//
// 🔑 A linha que este bloco substitui era "conferir no site do instituto se a
// rodada existe e ficou fora do índice", isto é, uma instrução para uma pessoa.
// Instrução para pessoa é o mesmo que dizer "confira as que você reparar", e
// conferir só quem eu reparei troca uma amostra sistemática por uma escolhida.
// Quem decide a lista agora é o PORTÃO.
// Ver memory/feedback_ingerir_so_quem_eu_notei_troca_amostra_por_escolha.md
//
// ⛔ Ele DETECTA, não ingere. Nada daqui entra no arquivo servido.
if (cad.atrasadas.length && !semRede) {
  const ver = await verificarCasasAtrasadas(saida, cad)
  console.log(`   🔎 listagem própria das ${cad.atrasadas.length} casa(s) sinalizada(s)  [USO INTERNO, nao publicar]`)
  for (const r of ver.resultados) {
    const marca = r.veredito === 'RODADA_FORA_DO_INDICE' ? '🔴' : r.veredito === 'SEM_RODADA_NOVA' ? '✅' : '⚠️'
    console.log(`      ${marca} ${r.instituto}: ${r.veredito} — ${r.detalhe}`)
    for (const f of r.rodadasFora ?? []) console.log(`           campo ${f.iso}  «${f.evidencia}»`)
    if (r.url) console.log(`           ${r.url}`)
  }
  if (ver.comRodadaFora.length) {
    console.log(`      📌 o buraco é do ÍNDICE, não das casas: ${ver.comRodadaFora.length} casa(s) publicou rodada que a Wikipédia não recebeu`)
  }
}

// ─── EXPOSIÇÃO: o buraco muda a frase que a gente publica? ──────────────────
//
// Sem esta conta, "duas casas caladas" é um susto sem tamanho. Com ela, dá
// para decidir se o buraco tira a manchete ou não.
// Ver memory/feedback_o_atraso_global_e_cego_a_buraco_no_meio.md
if (cad.atrasadas.length) {
  const ex = medirExposicao(saida, cad)
  if (ex && ex.rodadasFaltando) {
    const sinal = (v) => (v >= 0 ? `D+${v.toFixed(2)}` : `R+${Math.abs(v).toFixed(2)}`)
    console.log(`   📏 exposição da média: ${ex.rodadasFaltando} rodada(s) faltando dentro da janela de ${ex.janelaDias}d  [USO INTERNO, nao publicar]`)
    for (const c of ex.porCasa) {
      console.log(
        `      ${c.instituto}: deve ${c.rodadasEsperadasNaJanela} rodada(s) (${c.datasEsperadasNaJanela.join(', ')}), efeito de casa ${c.efeitoDeCasaPp >= 0 ? '+' : ''}${c.efeitoDeCasaPp}pp em ${c.rodadasComEfeitoMedido} rodadas`,
      )
    }
    for (const s of ex.semEfeitoMedivel) console.log(`      ⚠️ ${s.instituto}: ${s.motivo}, exposição NÃO cercada`)
    console.log(
      `      servida ${sinal(ex.atual.vantagemDem)} (n=${ex.atual.nPesquisas}) · com as que faltam ${sinal(ex.central.vantagemDem)} (n=${ex.central.nPesquisas}) · faixa ${sinal(ex.faixa.min)} a ${sinal(ex.faixa.max)}`,
    )
    console.log(`      deslocamento ${ex.deslocamentoCentralPp >= 0 ? '+' : ''}${ex.deslocamentoCentralPp}pp, amplitude ${ex.amplitudePp}pp`)
    // A linha de base é recomputada agora. Se ela já difere da gravada, quem
    // se moveu foi a JANELA, não a intenção de voto, e o número tem de sair
    // separado para ninguém somar as duas causas.
    if (ex.rolagemDaJanelaPp !== 0) {
      console.log(`      ⚠️ o arquivo trazia ${sinal(ex.arquivo.vantagemDem)}: ${ex.rolagemDaJanelaPp >= 0 ? '+' : ''}${ex.rolagemDaJanelaPp}pp disso é ROLAGEM DA JANELA, não pesquisa nova`)
    }
  }
}

// ─── BURACO DO REGISTRO ─────────────────────────────────────────────────────
//
// Impresso mesmo quando ninguém está atrasado. Um registro incompleto só
// aparece no dia em que a casa que falta é a que atrasa, e nesse dia já é
// tarde: o verificador devolveria SEM_LISTAGEM_REGISTRADA e a suspeita ficaria
// aberta sem ninguém ter escolhido isso.
const buracos = buracosNoRegistro(cad)
if (buracos.length) {
  console.log(`   🗂️ ${buracos.length} de ${cad.avaliadas.length} casa(s) avaliada(s) sem listagem utilizável  [USO INTERNO, nao publicar]`)
  for (const b of buracos) console.log(`      ${b.instituto}: ${b.nota}`)
}
