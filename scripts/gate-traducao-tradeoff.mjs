#!/usr/bin/env node
/**
 * GATE DE TRADUÇÃO DO TRADEOFF: o multiconjunto de números com unidade tem de ser
 * idêntico em pt-BR, EN e ES.
 *
 * 🔑 POR QUE ISTO EXISTE (27/Set/2026): a daily tem `gate-traducao-daily.ts`
 *    desde 16/Set, e o Tradeoff não tinha nada. Na №18 o "gate numérico limpo,
 *    132 números" saiu de conta avulsa, e conta avulsa não protege a edição
 *    seguinte.
 *
 * Convenção do Tradeoff (diferente da daily): decimal em PONTO nos três idiomas;
 * só o separador de MILHAR muda (EN vírgula, pt-BR e ES ponto). Por isso:
 *   - valor com unidade (%, pp, M, pontos/points/puntos) é comparado como está;
 *   - amostra `n=` é comparada sem separador (2.004 = 2,004);
 *   - "USD N mil" / "USD N thousand" é comparado como N mil.
 * ⛔ E ele REPROVA vírgula decimal em qualquer idioma (`12,50%`), que é o erro
 *    que a №11 publicou 27 vezes.
 * ⚠️ Não vê valor em bilhão: nenhum dos três idiomas tem unidade para isso aqui.
 *
 * Uso: node scripts/gate-traducao-tradeoff.mjs 2026-09-28 [--pais=br]
 */
import { readFileSync, existsSync } from 'fs'
import matter from 'gray-matter'

const data = process.argv[2]
const pais = process.argv.find((a) => a.startsWith('--pais='))?.slice(7) ?? 'br'
if (!/^\d{4}-\d{2}-\d{2}$/.test(data ?? '')) {
  console.error('uso: node scripts/gate-traducao-tradeoff.mjs AAAA-MM-DD [--pais=br|us]')
  process.exit(1)
}
const dir = pais === 'br' ? 'public/afos-tradeoff' : `public/afos-tradeoff/${pais}`
const IGNORAR = new Set(['contractLink', 'printLink', 'link', 'totalLink', 'deltaDirection', 'locale', 'status', 'date', 'weekStart', 'weekEnd', 'updatedAt', 'issueNumber', 'rank', 'barWidth', 'highlight', 'paywall', 'type', 'title'])

function textos(arquivo) {
  const { data: fm, content } = matter(readFileSync(arquivo, 'utf8'))
  const out = []
  const go = (v, k) => {
    if (k && IGNORAR.has(k)) return
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach((x) => go(x))
    else if (v && typeof v === 'object') Object.entries(v).forEach(([kk, x]) => go(x, kk))
  }
  go(fm)
  const corpo = content.split(/\*\*(Aviso obrigatório|Mandatory notice|Aviso obligatorio)/i)[0]
  out.push(corpo)
  return out.join('\n').replace(/https?:\/\/\S+/g, ' ')
}

function numeros(txt, idioma) {
  const achados = []
  const unidade = /([+-]?\d+(?:\.\d+)?)\s?(%|pp\b|M\b|pontos?\b|points?\b|puntos?\b|ponto\b|punto\b)/g
  for (const m of txt.matchAll(unidade)) {
    const u = /^p(on|oi|un)/.test(m[2]) ? 'pt' : m[2]
    achados.push(`${m[1].replace(/^\+/, '')}${u}`)
  }
  for (const m of txt.matchAll(/n=(\d[\d.,]*)/g)) achados.push(`n${m[1].replace(/[.,]/g, '')}`)
  const mil = idioma === 'en' ? /USD\s?(\d+(?:\.\d+)?)\s?thousand/g : /USD\s?(\d+(?:\.\d+)?)\s?mil\b/g
  for (const m of txt.matchAll(mil)) achados.push(`${m[1]}mil`)
  return achados
}

const idiomas = { 'pt-BR': `${dir}/${data}.md`, en: `${dir}/${data}.en.md`, es: `${dir}/${data}.es.md` }
const conta = {}
let falhou = false
for (const [id, arq] of Object.entries(idiomas)) {
  if (!existsSync(arq)) {
    console.log(`❌ ${id}: arquivo ausente (${arq})`)
    falhou = true
    continue
  }
  const txt = textos(arq)
  const decVirgula = [...txt.matchAll(/\b\d+,\d+\s?(%|pp\b|M\b)/g)].map((m) => m[0])
  if (decVirgula.length) {
    console.log(`❌ ${id}: vírgula DECIMAL em valor com unidade: ${decVirgula.slice(0, 5).join(' · ')}`)
    falhou = true
  }
  const travessao = (txt.match(/[—–]/g) || []).length
  if (travessao) {
    console.log(`❌ ${id}: ${travessao} travessão(ões)`)
    falhou = true
  }
  if (id === 'en') {
    const milPonto = [...txt.matchAll(/n=\d{1,3}\.\d{3}\b/g)].map((m) => m[0])
    if (milPonto.length) {
      console.log(`❌ en: milhar em PONTO: ${milPonto.join(' · ')}`)
      falhou = true
    }
  }
  const ns = numeros(txt, id)
  conta[id] = ns
  console.log(`   ${id.padEnd(5)} ${ns.length} números com unidade · ${new Set(ns).size} distintos`)
}

const mapa = (xs) => xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map())
if (conta['pt-BR']) {
  const base = mapa(conta['pt-BR'])
  for (const id of ['en', 'es']) {
    if (!conta[id]) continue
    const outro = mapa(conta[id])
    const falta = []
    const sobra = []
    for (const [k, n] of base) if ((outro.get(k) ?? 0) < n) falta.push(`${k}×${n - (outro.get(k) ?? 0)}`)
    for (const [k, n] of outro) if ((base.get(k) ?? 0) < n) sobra.push(`${k}×${n - (base.get(k) ?? 0)}`)
    if (falta.length || sobra.length) {
      console.log(`❌ ${id} contra pt-BR: falta [${falta.join(', ')}] sobra [${sobra.join(', ')}]`)
      falhou = true
    } else console.log(`✅ ${id}: multiconjunto idêntico ao pt-BR`)
  }
}
console.log(falhou ? '\n❌ gate de tradução do Tradeoff REPROVADO' : '\n✅ gate de tradução do Tradeoff limpo')
process.exitCode = falhou ? 1 : 0
