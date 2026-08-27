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
import { getPrisma, getPrismaInitError } from '../../../lib/db';

export const revalidate = 0; // Nunca cachear health checks

export async function GET() {
  const cronHealth = await checkCronHealth();
  const circuit = getCircuitStatus();
  const redisOk = isKvAvailable();
  const subscriberCount = await countSubscribers();

  // Ping Neon — mantém conexão quente (mitigação cold start).
  // 🔴 `getPrisma()`, não a constante: a constante é a leitura do momento do
  // import e, se ela falhou, ficava nula para sempre naquela instância. O
  // getter REPETE a criação. Ver o comentário em lib/db.ts, de 27/Ago/2026.
  const db = getPrisma();
  let neonOk = false;
  if (db) {
    try {
      await db.$queryRaw`SELECT 1`;
      neonOk = true;
    } catch {}
  }
  // 📌 O MOTIVO da falha existia gravado e ninguém lia. Um usuário passou por
  // "Serviço temporariamente indisponível" e não havia como saber por quê.
  // Só aparece quando há falha: em operação normal o campo nem existe.
  const initError = db ? null : getPrismaInitError();

  const allHealthy = cronHealth.healthy && circuit.state === 'CLOSED' && redisOk && neonOk;

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      subscribers: { ok: subscriberCount >= 0 },
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
        neon: initError ? { ok: neonOk, initError } : { ok: neonOk },
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
