/**
 * rede-afos.mjs — esta rede deixa ler www.afos-analytics.com com certificado válido?
 *
 * Uso:  npm run rede:afos
 *
 * Saída 0 LIMPA: nada a fazer.
 * Saída 2 DOMINIO_INTERCEPTADO: o domínio chega com certificado que não fecha,
 *         e o alias de produção passa. Imprime o `export AFOS_BASE=` pronto.
 * Saída 1 SEM_ACESSO: nenhum dos dois passa. Não publicar daqui.
 *
 * 🔴 Criado em 17/Set/2026, numa rede externa com FortiGate reassinando só o
 * nosso domínio. O diagnóstico levou quatro comandos à mão.
 * ⛔ A conexão é SEMPRE verificada. O emissor do certificado recusado é lido numa
 * segunda conexão só para NOMEAR quem interceptou, e nada dela é usado como dado.
 */

import tls from 'node:tls'
import { vereditoDeRede } from './lib/rede-afos.mjs'

function sondar(host) {
  return new Promise((resolve) => {
    const s = tls.connect(443, host, { servername: host }, () => {
      const c = s.getPeerCertificate()
      s.end()
      resolve({ ok: true, emissor: c?.issuer?.O ?? '?' })
    })
    s.setTimeout(10000, () => {
      s.destroy()
      resolve({ ok: false, erro: 'TIMEOUT' })
    })
    s.on('error', (e) => resolve({ ok: false, erro: e.code ?? e.message }))
  })
}

function emissorRecusado(host) {
  return new Promise((resolve) => {
    const s = tls.connect(443, host, { servername: host, rejectUnauthorized: false }, () => {
      const c = s.getPeerCertificate()
      s.end()
      resolve(`${c?.issuer?.O ?? '?'} · ${c?.issuer?.CN ?? '?'}`)
    })
    s.setTimeout(10000, () => {
      s.destroy()
      resolve('?')
    })
    s.on('error', () => resolve('?'))
  })
}

const canonico = await sondar('www.afos-analytics.com')
const alias = await sondar('afos-analitica-2026.vercel.app')
const r = vereditoDeRede({ canonico, alias })

console.log('\n🌐 REDE x AFOS')
console.log(`   www.afos-analytics.com          ${canonico.ok ? `✅ cadeia válida (${canonico.emissor})` : `❌ ${canonico.erro}`}`)
if (!canonico.ok) console.log(`      emissor apresentado: ${await emissorRecusado('www.afos-analytics.com')}`)
console.log(`   afos-analitica-2026.vercel.app  ${alias.ok ? `✅ cadeia válida (${alias.emissor})` : `❌ ${alias.erro}`}`)
console.log(`\n   VEREDITO: ${r.veredito}`)
if (r.veredito === 'DOMINIO_INTERCEPTADO') {
  console.log('   A rede intercepta o nosso domínio. Leitura pelo alias de produção, mesma versão:')
  console.log(`\n   export AFOS_BASE=${r.base}\n`)
  console.log('   ⛔ Não desligar verificação de certificado. Links públicos seguem no domínio canônico.')
} else if (r.veredito === 'SEM_ACESSO') {
  console.log('   Nenhum nome da produção passa com certificado válido. Não publicar desta rede.')
}
process.exit(r.codigo)
