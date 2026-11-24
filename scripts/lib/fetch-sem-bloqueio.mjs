/**
 * ATALHO DE REDE (24/Nov/2026): GET de JSON em host que o DNS desta máquina não
 * resolve. No Brasil, o DNS local não resolve api.elections.kalshi.com, nem
 * gamma-api.polymarket.com, nem data-api.polymarket.com ("Could not resolve
 * host"); a Vercel, que roda nos EUA, resolve. Aqui o endereço sai do DNS da
 * Cloudflare por HTTPS (DoH) e o `curl --resolve` conecta direto, com o
 * certificado do próprio host (TLS conferido como sempre).
 *
 * Só leitura de API pública. Primeiro tenta o caminho normal; o desvio só entra
 * quando o host não resolve.
 *
 *   import { getJson } from './lib/fetch-sem-bloqueio.mjs'
 *   const j = getJson('https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=KXFRENCHPRES-27')
 */
import { execFileSync } from 'node:child_process'

const cacheIp = new Map()

function curl(args) {
  return execFileSync('curl', ['-sS', '-m', '40', '--fail-with-body', ...args], { encoding: 'utf8', maxBuffer: 128e6, stdio: ['ignore', 'pipe', 'pipe'] })
}

export function ipPorDoh(host) {
  if (cacheIp.has(host)) return cacheIp.get(host)
  const j = JSON.parse(curl(['-H', 'accept: application/dns-json', `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`]))
  const ip = (j.Answer ?? []).find((a) => a.type === 1)?.data
  if (!ip) throw new Error(`DoH não resolveu ${host}`)
  cacheIp.set(host, ip)
  return ip
}

export function getJson(url) {
  const host = new URL(url).hostname
  if (!cacheIp.has(host)) {
    try {
      return JSON.parse(curl([url]))
    } catch (e) {
      if (!/Could not resolve host/.test(String(e.stderr ?? e.message))) throw e
    }
  }
  const ip = ipPorDoh(host)
  return JSON.parse(curl(['--resolve', `${host}:443:${ip}`, url]))
}
