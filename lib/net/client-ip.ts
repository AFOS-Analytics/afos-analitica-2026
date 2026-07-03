/**
 * IP do cliente para rate-limit / auditoria (trust boundary — fonte de verdade única).
 *
 * Prioriza `x-real-ip`, que a edge da Vercel seta a partir do socket TCP e o cliente
 * NÃO consegue forjar. Só então cai para o ÚLTIMO segmento não-vazio do
 * `x-forwarded-for` (o hop de confiança mais próximo do proxy), nunca o primeiro
 * (que o cliente pode injetar para rotacionar o "IP" e furar limites). Filtra
 * segmentos vazios/em-branco ("1.2.3.4, " → "1.2.3.4", não ""). Em dev local, onde
 * nenhum dos headers existe, retorna 'unknown'.
 *
 * Edge-safe: só faz parsing de Headers, sem APIs de Node — pode ser usado no
 * middleware (Edge runtime) e nas rotas server.
 */
export function clientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim()
  if (real) return real
  const fwd = headers.get('x-forwarded-for')
  if (fwd) {
    const parts = fwd.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return 'unknown'
}
