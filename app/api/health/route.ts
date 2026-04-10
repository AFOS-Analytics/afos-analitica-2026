/**
 * Health Check: /api/health
 *
 * Retorna o status de cada componente do sistema.
 * Útil para monitoramento externo (UptimeRobot, Better Uptime, etc).
 */

import { NextResponse } from 'next/server';
import { isKvAvailable, checkCronHealth } from '../../lib/kv';
import { getCircuitStatus } from '../../lib/polymarket/client';
import { countSubscribers } from '../../lib/email/subscribers';
import { prisma } from '../../../lib/db';

export const revalidate = 0; // Nunca cachear health checks

export async function GET() {
  const cronHealth = await checkCronHealth();
  const circuit = getCircuitStatus();
  const redisOk = isKvAvailable();
  const subscriberCount = await countSubscribers();

  // Ping Neon — mantém conexão quente (mitigação cold start)
  let neonOk = false;
  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      neonOk = true;
    } catch {}
  }

  const allHealthy = cronHealth.healthy && circuit.state === 'CLOSED' && redisOk && neonOk;

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      subscribers: { total: subscriberCount },
      components: {
        redis: { ok: redisOk },
        cron: {
          ok: cronHealth.healthy,
          lastUpdate: cronHealth.lastUpdate,
          ageSeconds: cronHealth.ageMs > 0 ? Math.round(cronHealth.ageMs / 1000) : null,
        },
        polymarket: {
          circuit: circuit.state,
          failures: circuit.failures,
        },
        neon: { ok: neonOk },
      },
    },
    {
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
