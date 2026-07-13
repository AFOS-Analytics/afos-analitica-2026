/**
 * Teste do link-shield contra os 4 defeitos REAIS observados em 12/Jul/2026.
 * Simula o que o modelo fez, e verifica que o shield neutraliza ou detecta cada um.
 *
 * Uso: npx tsx scripts/test-link-shield.mjs
 */
import { shieldLinks, unshieldLinks, stripNestedGlossaryLinks } from '../lib/ai/link-shield.ts'

let ok = 0, fail = 0
const t = (nome, cond, detalhe = '') => {
  if (cond) { ok++; console.log(`  OK    ${nome}`) }
  else { fail++; console.log(`  FALHA ${nome}${detalhe ? '\n          ' + detalhe : ''}`) }
}

const GNEWS = 'https://news.google.com/rss/articles/CBMixgFBVV95cUxNQ1FJaEF5andhUWZUOEphM0c4X2NKbnAwdG5HZlJRdU85U2N4eFlFa2Jk?oc=5'
const TSE = 'https://divulgacandcontas.tse.jus.br/divulga/'
const PM = 'https://polymarket.com/event/brazil-presidential-election'

console.log('=== 1. CORRUPÇÃO DE TOKEN (dU85 -> dU81) ===')
{
  const src = `Segundo a [CartaCapital](${GNEWS}), o caso avançou.`
  const { masked, links } = shieldLinks(src)
  t('URL não é enviada ao modelo', !masked.includes('http'), `masked: ${masked}`)
  t('âncora continua visível (contexto p/ tradução)', masked.includes('[CartaCapital]'))
  // o modelo devolve o token intacto (não tem como corromper o que não viu)
  const modelo = masked.replace('CartaCapital', 'CartaCapital').replace('Segundo a', 'According to')
  const { text, report } = unshieldLinks(modelo, links)
  t('URL restaurada byte a byte', text.includes(GNEWS))
  t('zero alucinação', report.hallucinated.length === 0)
}

console.log('\n=== 2. SEQUESTRO DE LINK EXTERNO (o bug de hoje) ===')
{
  const src = `pesquisas registradas no [TSE](${TSE}) (intenção declarada)`
  const { masked, links } = shieldLinks(src)
  // o modelo obedece a regra 5 e SEQUESTRA o link, trocando o destino por glossário
  const modelo = 'surveys registered with the [TSE](/en/glossary#tse) (stated intent)'
  const { text, report } = unshieldLinks(modelo, links)
  t('sequestro DETECTADO e reparado', report.repaired.length === 1, JSON.stringify(report))
  t('link externo do TSE restaurado', text.includes(TSE), text)
  t('glossário não sobrevive no lugar do link externo', !text.includes('/en/glossary#tse'), text)
  t('nada irreparável', report.unrecoverable.length === 0)
}

console.log('\n=== 3. LINK DERRUBADO (perda silenciosa) ===')
{
  const src = `o [mercado presidencial](${PM}) abriu`
  const { links } = shieldLinks(src)
  const modelo = 'the presidential market opened' // modelo sumiu com o link
  const { report } = unshieldLinks(modelo, links)
  t('perda vira ERRO explícito, não silêncio', report.unrecoverable.length === 1, JSON.stringify(report))
}

console.log('\n=== 4. LINK ANINHADO (parser quebra) ===')
{
  const ruim = `- [O Globo - [STF](/en/glossary#stf) decide sobre emendas](${TSE})`
  const limpo = stripNestedGlossaryLinks(ruim)
  t('glossário aninhado removido', !limpo.includes('/en/glossary#stf'), limpo)
  t('link externo preservado', limpo.includes(TSE))
  t('texto do termo mantido', limpo.includes('STF'))
}

console.log('\n=== 5. GLOSSÁRIO EM TEXTO PURO CONTINUA FUNCIONANDO (é o recurso) ===')
{
  const src = `o ministro do STF decidiu, e o [mercado](${PM}) reagiu`
  const { masked, links } = shieldLinks(src)
  // modelo linka o STF (texto puro) e preserva o token do link existente
  const modelo = masked.replace('STF', '[STF](/en/glossary#stf)')
  const { text, report } = unshieldLinks(modelo, links)
  t('glossário novo em texto puro é preservado', text.includes('/en/glossary#stf'), text)
  t('link externo preservado', text.includes(PM))
  t('nenhum falso reparo', report.repaired.length === 0)
}

console.log('\n=== 6. URL INVENTADA PELO MODELO ===')
{
  const src = `sem links aqui`
  const { links } = shieldLinks(src)
  const modelo = 'no links here, see https://exemplo-inventado.com/fake'
  const { report } = unshieldLinks(modelo, links)
  t('alucinação de URL detectada', report.hallucinated.length === 1, JSON.stringify(report.hallucinated))
}

console.log('\n=== 7. MÚLTIPLOS LINKS, ORDEM E CONTAGEM ===')
{
  const src = `[a](${TSE}) e [b](${PM}) e [c](${GNEWS})`
  const { masked, links } = shieldLinks(src)
  t('3 links mascarados', links.length === 3)
  t('tokens distintos', masked.includes('⟦U0⟧') && masked.includes('⟦U1⟧') && masked.includes('⟦U2⟧'))
  const { text, report } = unshieldLinks(masked, links)
  t('todos restaurados na posição certa', text === src, text)
  t('report limpo', report.restored === 3 && report.repaired.length === 0 && report.unrecoverable.length === 0)
}

console.log(`\n${ok} OK, ${fail} FALHA`)
process.exit(fail ? 1 : 0)
