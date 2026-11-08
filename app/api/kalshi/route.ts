import { NextResponse } from 'next/server';

import {
  EVENTOS_KALSHI,
  PAISES_ACEITOS,
  avaliarCaptura,
  lerEventoKalshi,
  preencherUltimasNegociacoes,
  resolverPaisKalshi,
} from '@/lib/kalshi/leitura';

/**
 * Proxy de LEITURA da Kalshi, server-side na Vercel/EUA. Criado 08/Nov/2026
 * para o painel da França, o primeiro com DOIS livros de mercado.
 *
 * Existe pelo mesmo motivo de `/api/polymarket/history`: o DNS do provedor
 * local responde "domínio inexistente" para api.elections.kalshi.com (medido em
 * 08/Nov/2026), e o servidor da Vercel alcança. Os scripts locais leem ESTA
 * rota, nunca a Kalshi direto.
 *
 *   GET /api/kalshi?country=fra[&fresh=1]
 *     → { pais, fonte, winner: { eventTicker, title, contratos: [...] , avaliacao }, fetchedAt, degraded, failedCount }
 *
 * 🔒 Anti-SSRF: host e endpoint FIXOS; o único valor que vem de fora é
 * `country`, que escolhe numa LISTA FECHADA. Nada do pedido entra na URL.
 *
 * 🔴 País ausente ou fora da lista → HTTP 400. Sem país padrão: fallback
 * silencioso é o defeito que entrega o outro país.
 *
 * ⏱️ FRESCOR. A Kalshi não carimba o preço; carimba cada NEGÓCIO. Com
 * `?fresh=1` a rota lê também a hora do último negócio dos contratos acima de
 * 1 ponto (`ultimaNegociacaoEm`). O `cadastroAtualizadoEm` é do cadastro do
 * contrato, não do preço. Regras em `lib/kalshi/leitura.ts`.
 *
 * ⚠️ Volume em CONTRATOS, não em dólares.
 */

export const dynamic = 'force-dynamic';

const REVALIDATE_S = 1800;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const fresh = params.has('fresh');
  const pedido = params.get('country');
  const pais = resolverPaisKalshi(pedido);

  if (pais === null) {
    return NextResponse.json(
      { error: `informe ?country= de uma lista fechada (${PAISES_ACEITOS.join(', ')}); veio "${pedido ?? ''}"` },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const eventos = EVENTOS_KALSHI[pais];
  const agora = new Date();
  const resultados = await Promise.all(
    eventos.map(async (e) => {
      const ev = await lerEventoKalshi(e.eventTicker, { fresh, revalidateS: REVALIDATE_S });
      // A leitura de negócios é uma chamada por contrato relevante: só no
      // caminho fresco (scripts e trava), nunca no cache da tela.
      if (ev && fresh) await preencherUltimasNegociacoes(ev);
      return ev;
    }),
  );
  const data: Record<string, unknown> = {};
  eventos.forEach((e, i) => {
    const ev = resultados[i];
    data[e.key] = ev ? { ...ev, avaliacao: avaliarCaptura(ev, agora) } : null;
  });
  const failed = resultados.filter((r) => r === null).length;
  const degraded = failed > 0;

  return NextResponse.json(
    {
      pais,
      fonte: 'kalshi',
      unidadeDePreco: 'pontos (0 a 100)',
      unidadeDeVolume: 'contratos, não dólares',
      ...data,
      fetchedAt: failed < eventos.length ? agora.toISOString() : null,
      degraded,
      failedCount: failed,
    },
    {
      headers: {
        'Cache-Control': fresh
          ? 'no-store'
          : degraded
            ? 'public, max-age=0, s-maxage=60, stale-while-revalidate=600'
            : `public, max-age=0, s-maxage=${REVALIDATE_S}, stale-while-revalidate=86400`,
      },
    },
  );
}
