/**
 * As 5 checagens obrigatórias dos JSON traduzidos do dashboard.
 *
 * Cada uma existe porque pegou defeito REAL em 24 e 25/Jul/2026, não por
 * hipótese. Varre sobre os VALORES traduzidos, nunca sobre o texto cru do
 * arquivo: no cru, nome de chave e nome próprio de instituto dão falso positivo.
 *
 *  1. gate numérico zerado                      (número alterado pela tradução)
 *  2. id de glossário existe                    (âncora morta na tela)
 *  3. link aponta para o PRÓPRIO locale         (/en/... dentro do arquivo ES)
 *  4. sem homóglifo cirílico                    (invisível, escapa de tudo)
 *  5. separador decimal coerente com o idioma   (45,9% lido como 459 no EN)
 *
 * Uso:  npx tsx scripts/check-locale-json.ts
 */
import { readFileSync, existsSync } from 'fs'
import { compararNumeros } from './lib/json-number-gate'
import { caminhosDeString } from './lib/translation-map'
import { FORA_DE_TRADUCAO } from './build-locale-json'

/**
 * Cada alvo: a origem pt-BR e o prefixo das variantes (`${prefixo}.${loc}.json`).
 * O Brasil usa `public/X.json` como origem; a França (desde 12/Nov/2026) usa
 * `public/fr/X.pt-BR.json`, e antes ficava fora de todo portão.
 */
const ALVOS: { origem: string; prefixo: string; franca?: boolean }[] = [
  ...(['analysis-data', 'analysis-criteriosa', 'polls-data'] as const).map((a) => ({ origem: `public/${a}.json`, prefixo: `public/${a}` })),
  ...(['analise', 'candidatos'] as const).map((a) => ({ origem: `public/fr/${a}.pt-BR.json`, prefixo: `public/fr/${a}`, franca: true })),
]
const LOCALES = ['en', 'es'] as const

const LINK = /\[([^\][\n]+)\]\((\/(?:pt-BR|en|es)\/glossary#([a-z0-9-]+))\)/g
const CIRILICO = /[Ѐ-ӿ]/
const INVISIVEL = /[­​‌‍﻿]/

/** Decimal do idioma: EN usa ponto, ES mantém vírgula como o português. */
const DECIMAL_ERRADO = {
  // No inglês, dígito-vírgula-2dígitos-fim é decimal não convertido (45,9% / 1,00pp).
  en: /\d,\d{1,2}(?![\d])/,
  // No espanhol, ponto decimal indevido (45.9%). Milhar com ponto é correto e
  // tem 3 dígitos, então exige-se 1 ou 2 para não acusar 1.234.
  es: /\d\.\d{1,2}(?![\d])/,
} as const

const glossario = JSON.parse(readFileSync('public/glossary/entries.json', 'utf-8'))
const IDS = new Set(Object.keys(glossario))

let problemas = 0
const acusa = (msg: string) => { console.error('   ' + msg); problemas++ }

/** Chaves de um objeto, ordenadas, para comparar conjuntos. */
const chaves = (o: unknown) => (o && typeof o === 'object' ? Object.keys(o as object).sort().join('|') : '')

for (const { origem, prefixo, franca } of ALVOS) {
  if (franca && !existsSync(origem)) continue
  const pt = JSON.parse(readFileSync(origem, 'utf-8'))

  for (const loc of LOCALES) {
    const caminho = `${prefixo}.${loc}.json`
    if (!existsSync(caminho)) {
      console.error(`❌ ${caminho} NÃO existe — o locale cairá para pt-BR.`)
      problemas++
      continue
    }
    const trad = JSON.parse(readFileSync(caminho, 'utf-8'))
    const antes = problemas

    // 1. gate numérico
    const div = compararNumeros(pt, trad, loc)
    for (const d of div.slice(0, 5)) acusa(`[gate] ${d.caminho}: pt [${d.original.join(', ')}] x ${loc} [${d.traduzido.join(', ')}]`)
    if (div.length > 5) acusa(`[gate] ... e mais ${div.length - 5}`)

    // França: o painel só serve a variante da MESMA rodada do pt-BR, e a
    // estrutura tem de bater (mesmos perfis, mesmo número de parágrafos).
    if (franca) {
      if (pt.updatedAt !== trad.updatedAt) acusa(`[carimbo] updatedAt pt ${pt.updatedAt} x ${loc} ${trad.updatedAt}: a tela em ${loc} cairá para pt-BR`)
      if (chaves(pt.perfis) !== chaves(trad.perfis)) acusa(`[perfis] conjunto de perfis difere do pt-BR`)
      if (Array.isArray(pt.paragrafos) && pt.paragrafos.length !== trad.paragrafos?.length) acusa(`[parágrafos] pt ${pt.paragrafos.length} x ${loc} ${trad.paragrafos?.length}`)
    }

    for (const c of caminhosDeString(trad, '', FORA_DE_TRADUCAO)) {
      const partes = c.match(/[^.[\]]+/g)!
      let v: any = trad
      for (const p of partes) v = v?.[p]
      if (typeof v !== 'string' || v === '') continue

      // 2 e 3. glossário
      for (const m of v.matchAll(LINK)) {
        const [, , url, id] = m
        if (!IDS.has(id)) acusa(`[âncora morta] ${c}: #${id} não existe em entries.json`)
        if (!url.startsWith(`/${loc}/`)) acusa(`[locale cruzado] ${c}: ${url} dentro do arquivo ${loc}`)
      }

      // 4. caracteres que não deveriam existir
      if (CIRILICO.test(v)) acusa(`[cirílico] ${c}: homóglifo em "${v.slice(0, 60)}"`)
      if (INVISIVEL.test(v)) acusa(`[invisível] ${c}: caractere invisível em "${v.slice(0, 60)}"`)

      // 5. separador decimal
      const re = DECIMAL_ERRADO[loc]
      if (re.test(v)) {
        const trecho = v.match(new RegExp(`.{0,28}${re.source}.{0,18}`))?.[0] ?? ''
        acusa(`[decimal ${loc}] ${c}: "${trecho.trim()}"`)
      }
    }

    if (problemas === antes) console.log(`✅ ${caminho}`)
  }
}

if (problemas > 0) {
  console.error(`\n❌ ${problemas} problema(s). Corrigir ANTES do build: o arquivo já está no disco e iria ao deploy.`)
  process.exit(1)
}
console.log(`\n✅ checagens limpas nos ${ALVOS.length * LOCALES.length} arquivos traduzidos (Brasil e França).`)
