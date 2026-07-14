/**
 * Teste do link-shield contra os defeitos REAIS observados em 12-13/Jul/2026.
 * Simula o que o modelo fez e verifica que o shield neutraliza ou detecta cada um.
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
const PM2 = 'https://polymarket.com/event/brazil-presidential-election-first-round-2nd-place'

console.log('=== 1. O modelo não vê URL NEM âncora ===')
{
  const src = `Segundo a [CartaCapital](${GNEWS}), o caso avançou.`
  const { masked, links } = shieldLinks(src)
  t('URL não vai ao modelo', !masked.includes('http'), masked)
  t('âncora não vai ao modelo', !masked.includes('CartaCapital'), masked)
  t('link virou 1 token opaco', /⟦L0⟧/.test(masked) && links.length === 1)
}

console.log('\n=== 2. CORRUPÇÃO DE TOKEN base64 (12/Jul) ===')
{
  const src = `Segundo a [CartaCapital](${GNEWS}), o caso avançou.`
  const { masked, links } = shieldLinks(src)
  const modelo = masked.replace('Segundo a', 'According to') // token intacto
  const { text, report } = unshieldLinks(modelo, links, ['CartaCapital'])
  t('URL restaurada byte a byte', text.includes(GNEWS))
  t('zero alucinação', report.hallucinated.length === 0)
  t('zero perda', report.lost.length === 0)
}

console.log('\n=== 3. SEQUESTRO de link externo para glossário (12/Jul) ===')
{
  const src = `pesquisas registradas no [TSE](${TSE})`
  const { links } = shieldLinks(src)
  // agora o modelo NAO TEM COMO sequestrar: nao ve a ancora nem a URL.
  // Se ele apagar o token, isso vira PERDA detectada, nao link errado publicado.
  const modeloBom = 'surveys registered with ⟦L0⟧'
  const r1 = unshieldLinks(modeloBom, links, ['TSE'])
  t('link externo do TSE preservado', r1.text.includes(TSE), r1.text)
  t('glossário NÃO sobrescreve o link externo', !r1.text.includes('/en/glossary#tse'))

  const modeloRuim = 'surveys registered with the [TSE](/en/glossary#tse)'
  const r2 = unshieldLinks(modeloRuim, links, ['TSE'])
  t('se o modelo destruir o link, isso é DETECTADO', r2.report.lost.length === 1, JSON.stringify(r2.report))
}

console.log('\n=== 4. O BUG DE 13/Jul: âncora com termo de glossário ===')
{
  // entrada: [2º lugar do 1º turno](url). O modelo v1 destruiu o link E trocou
  // "2º lugar" (colocação) por "2º turno" (returno). Erro FACTUAL.
  const src = `no sub-mercado de [2º lugar do 1º turno](${PM2}), para 83,50%`
  const { masked, links } = shieldLinks(src)
  t('âncora com termo de glossário fica OPACA', !masked.includes('turno'), masked)
  t('modelo não pode aplicar glossário dentro da âncora', /⟦L0⟧/.test(masked))
  // a âncora é traduzida na passada dedicada, sem regra de glossário
  const { text, report } = unshieldLinks('in the ⟦L0⟧ sub-market, to 83.50%', links, ['2nd place in the first round'])
  t('link remontado com URL original', text.includes(PM2), text)
  t('âncora traduzida corretamente (place, não runoff)', text.includes('2nd place in the first round'), text)
  t('zero perda', report.lost.length === 0)
}

console.log('\n=== 5. LINK DERRUBADO vira erro explícito ===')
{
  const { links } = shieldLinks(`o [mercado presidencial](https://polymarket.com/event/brazil-presidential-election) abriu`)
  const { report } = unshieldLinks('the presidential market opened', links, [])
  t('perda detectada, não silenciosa', report.lost.length === 1, JSON.stringify(report))
}

console.log('\n=== 6. URL INVENTADA pelo modelo ===')
{
  const { links } = shieldLinks('sem links aqui')
  const { report } = unshieldLinks('no links here, see https://exemplo-inventado.com/fake', links, [])
  t('alucinação detectada', report.hallucinated.length === 1, JSON.stringify(report.hallucinated))
}

console.log('\n=== 7. Glossário em TEXTO PURO continua funcionando (é o recurso) ===')
{
  const src = `o ministro do STF decidiu, e o [mercado](https://polymarket.com/event/brazil-presidential-election) reagiu`
  const { masked, links } = shieldLinks(src)
  const modelo = masked.replace('STF', '[STF](/en/glossary#stf)')
  const { text, report } = unshieldLinks(modelo, links, ['market'])
  t('glossário novo em texto puro preservado', text.includes('/en/glossary#stf'), text)
  t('link externo preservado', text.includes('brazil-presidential-election'))
  t('zero perda', report.lost.length === 0)
}

console.log('\n=== 8. ANINHAMENTO (parser quebra) ===')
{
  const ruim = `- [O Globo - [STF](/en/glossary#stf) e [PL](/en/glossary#pl) decidem](${TSE})`
  const limpo = stripNestedGlossaryLinks(ruim)
  t('glossário aninhado removido (2 no mesmo link)', !limpo.includes('/en/glossary#'), limpo)
  t('link externo preservado', limpo.includes(TSE))
  t('texto dos termos mantido', limpo.includes('STF') && limpo.includes('PL'))
}

console.log('\n=== 9. Ordem e contagem com múltiplos links ===')
{
  const src = `[a](${TSE}) e [b](${PM2}) e [c](${GNEWS})`
  const { masked, links } = shieldLinks(src)
  t('3 links mascarados', links.length === 3)
  t('tokens distintos', /⟦L0⟧/.test(masked) && /⟦L1⟧/.test(masked) && /⟦L2⟧/.test(masked))
  const { text, report } = unshieldLinks(masked, links, ['a', 'b', 'c'])
  t('todos restaurados na posição certa', text === src, text)
  t('report limpo', report.restored === 3 && report.lost.length === 0 && report.hallucinated.length === 0)
}

console.log('\n=== 10. Fallback: passada de âncoras falhou ===')
{
  const src = `veja o [mercado presidencial](https://polymarket.com/event/brazil-presidential-election)`
  const { masked, links } = shieldLinks(src)
  // sem âncoras traduzidas: cai na âncora original (link intacto, rótulo em PT)
  const { text, report } = unshieldLinks(masked, links, [])
  t('link intacto mesmo sem tradução da âncora', text.includes('brazil-presidential-election'))
  t('âncora original preservada (degrada rótulo, não o link)', text.includes('mercado presidencial'), text)
  t('zero perda', report.lost.length === 0)
}

console.log(`\n${ok} OK, ${fail} FALHA`)
process.exit(fail ? 1 : 0)
