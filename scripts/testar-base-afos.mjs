/**
 * testar-base-afos.mjs — a base de leitura e o veredito de rede, com casos plantados.
 *
 * 🔑 O caso que mais importa é o que NÃO pode acontecer: host fora da lista cair
 * calado para o canônico, ou aceitar um preview como se fosse produção.
 *
 * Uso: node scripts/testar-base-afos.mjs
 */

import { normalizarBase, baseDeLeitura, DOMINIO_CANONICO, ALIAS_PRODUCAO } from './lib/base-afos.mjs'
import { vereditoDeRede } from './lib/rede-afos.mjs'

let passou = 0
let falhou = 0
const ok = (nome, cond, det = '') => {
  if (cond) passou++
  else falhou++
  console.log(`${cond ? '✅' : '❌'} ${nome}${cond || !det ? '' : `  ${det}`}`)
}
const lanca = (fn) => {
  try {
    fn()
    return false
  } catch {
    return true
  }
}

console.log('\n🧪 BASE DE LEITURA E REDE\n')

ok('sem AFOS_BASE, o canônico', normalizarBase(undefined) === DOMINIO_CANONICO)
ok('AFOS_BASE vazia, o canônico', normalizarBase('  ') === DOMINIO_CANONICO)
ok('alias de produção aceito', normalizarBase('https://afos-analitica-2026.vercel.app') === ALIAS_PRODUCAO)
ok('barra final normalizada', normalizarBase('https://afos-analitica-2026.vercel.app/') === ALIAS_PRODUCAO)
ok('PREVIEW recusado, nunca vira produção', lanca(() => normalizarBase('https://afos-analitica-2026-kwk4d3w5t-andre-felipes-projects-6b6d4469.vercel.app')))
ok('host estranho recusado', lanca(() => normalizarBase('https://afos-analytics.com.evil.example')))
ok('http recusado', lanca(() => normalizarBase('http://afos-analitica-2026.vercel.app')))
ok('base com caminho recusada', lanca(() => normalizarBase('https://afos-analitica-2026.vercel.app/api')))
ok('lixo recusado, não cai calado no canônico', lanca(() => normalizarBase('afos')))
ok('baseDeLeitura lê do env injetado', baseDeLeitura({ AFOS_BASE: 'https://afos-analitica-2026.vercel.app' }) === ALIAS_PRODUCAO)
ok('baseDeLeitura com env inválido LANÇA', lanca(() => baseDeLeitura({ AFOS_BASE: 'https://preview.vercel.app' })))

const v1 = vereditoDeRede({ canonico: { ok: true }, alias: { ok: true } })
ok('rede limpa: 0 e sem base alternativa', v1.veredito === 'LIMPA' && v1.codigo === 0 && v1.base === null)
const v2 = vereditoDeRede({ canonico: { ok: false, erro: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' }, alias: { ok: true } })
ok('domínio interceptado: 2 e manda o alias', v2.veredito === 'DOMINIO_INTERCEPTADO' && v2.codigo === 2 && v2.base === ALIAS_PRODUCAO)
const v3 = vereditoDeRede({ canonico: { ok: false }, alias: { ok: false } })
ok('nada passa: 1 e nenhuma base oferecida', v3.veredito === 'SEM_ACESSO' && v3.codigo === 1 && v3.base === null)
const v4 = vereditoDeRede({ canonico: { ok: true }, alias: { ok: false } })
ok('canônico ok com alias fora: segue LIMPA', v4.veredito === 'LIMPA')
ok('entrada incompleta lança', lanca(() => vereditoDeRede({ canonico: { ok: true } })))

console.log(`\n${falhou === 0 ? '✅' : '❌'} ${passou} passaram, ${falhou} falharam\n`)
process.exit(falhou === 0 ? 0 : 1)
