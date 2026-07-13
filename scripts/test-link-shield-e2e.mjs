/**
 * E2E: chama o MODELO DE VERDADE com o texto que ele sequestrou em 12/Jul,
 * e confere que o link-shield entrega URLs idênticas às do original.
 *
 * Uso: npx tsx scripts/test-link-shield-e2e.mjs
 */
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })
import { translate } from '../lib/ai/translate.ts'

const TSE = 'https://divulgacandcontas.tse.jus.br/divulga/'
const PM = 'https://polymarket.com/event/brazil-presidential-election'
const GNEWS = 'https://news.google.com/rss/articles/CBMixgFBVV95cUxNQ1FJaEF5andhUWZUOEphM0c4X2NKbnAwdG5HZlJRdU85U2N4eFlFa2JkVWZaZW5Xek1qMHVVV1Bs?oc=5'

// Texto desenhado para provocar os 4 defeitos ao mesmo tempo:
//  - [TSE](externo) -> o modelo quer trocar por /xx/glossary#tse (sequestro)
//  - token base64 do Google News -> corrupção de caractere
//  - STF em texto puro -> glossário legítimo (tem de continuar funcionando)
//  - STF DENTRO de um link -> aninhamento
const SRC = [
  `O AFOS cruza três sinais: [Polymarket](${PM}) e as pesquisas registradas no [TSE](${TSE}).`,
  `O ministro do STF decidiu sobre as emendas nesta semana.`,
  `Segundo a [CartaCapital, que detalhou a decisão do STF](${GNEWS}), o caso avançou.`,
].join('\n\n')

const originais = [PM, TSE, GNEWS]

for (const locale of ['en', 'es']) {
  console.log(`\n${'='.repeat(70)}\n=== ${locale.toUpperCase()} (modelo real) ===`)
  const r = await translate({
    sourceText: SRC,
    sourceLocale: 'pt-BR',
    targetLocale: locale,
    type: 'afos-daily',
    glossaryEntries: [
      { term: 'TSE', id: 'tse' },
      { term: 'STF', id: 'stf' },
      { term: 'Polymarket', id: 'polymarket' },
    ],
  })
  const out = r.translatedText
  console.log('\n--- saída ---')
  console.log(out.slice(0, 700))

  console.log('\n--- auditoria ---')
  let ok = true
  for (const u of originais) {
    const n = out.split(u).length - 1
    const bom = n === 1
    if (!bom) ok = false
    console.log(`  ${bom ? 'OK   ' : 'FALHA'} URL preservada ${n}x: ${u.slice(0, 58)}`)
  }
  const inventadas = (out.match(/https?:\/\/[^\s)\]<>"']+/g) ?? []).filter((u) => !originais.includes(u))
  if (inventadas.length) { ok = false; console.log(`  FALHA URLs inventadas: ${inventadas.join(', ')}`) }
  else console.log('  OK    zero URL inventada')

  const tokens = (out.match(/⟦U\d+⟧/g) ?? []).length
  if (tokens) { ok = false; console.log(`  FALHA ${tokens} token(s) não restaurado(s)`) }
  else console.log('  OK    zero token vazado')

  const glossPuro = /\[STF\]\(\/(en|es)\/glossary#stf\)/.test(out)
  console.log(`  ${glossPuro ? 'OK   ' : 'aviso'} glossário em texto puro ${glossPuro ? 'preservado (recurso funcionando)' : 'não aplicado neste run'}`)

  const aninhado = /\[[^\]]*\[[^\]]*\]\([^)]*\)[^\]]*\]\(/.test(out)
  if (aninhado) { ok = false; console.log('  FALHA link aninhado presente') }
  else console.log('  OK    zero link aninhado')

  console.log(`\n  ${ok ? '✅ SHIELD SEGUROU' : '❌ SHIELD FALHOU'}`)
  if (!ok) process.exitCode = 1
}
