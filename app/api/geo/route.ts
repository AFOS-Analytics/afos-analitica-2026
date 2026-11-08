import { NextResponse } from 'next/server'

/**
 * País do VISITANTE, pelo cabeçalho que a Vercel põe em toda requisição
 * (`x-vercel-ip-country`, código ISO de 2 letras). Criado 08/Nov/2026 para o
 * painel da França: o link para a página do contrato na Polymarket e na Kalshi
 * aparece para quem está FORA da França e não aparece para quem está nela (a
 * Polymarket é bloqueada lá pela ANJ, e a lei 2010-476, art. 57, pune divulgar
 * cotação de site não autorizado para promovê-lo). Decisão do André, opção B.
 *
 * 🔒 Nada é gravado: nem IP, nem país. A resposta não vai para cache (cada
 * visitante tem a sua). Sem cabeçalho (rodando fora da Vercel) devolve `null`,
 * e quem lê trata `null` como França, o lado conservador.
 */
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const pais = request.headers.get('x-vercel-ip-country')
  return NextResponse.json(
    { pais: pais && /^[A-Z]{2}$/.test(pais) ? pais : null },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
