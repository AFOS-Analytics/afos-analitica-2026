import { createHash, createHmac } from 'crypto'
import { after } from 'next/server'
import { getPrisma } from './db'

/**
 * Chave do hash de IP e de user-agent.
 *
 * 🔴 Era SHA-256 puro, sem sal. O espaço IPv4 tem 2^32 valores e se enumera
 * em minutos: o "hash" devolvia o IP a quem tivesse o banco, e IP é dado
 * pessoal. Agora é HMAC com segredo do servidor.
 *
 * Ordem: AUDIT_HASH_SALT (variável própria, a recomendada) e, na falta dela,
 * CRON_SECRET, que já existe em produção e nunca sai do servidor. Sem nenhuma
 * das duas, NÃO se grava hash nenhum: melhor perder o campo do que gravar um
 * hash reversível. Trocar o segredo desliga o vínculo com os hashes antigos,
 * o que aqui é efeito desejado e não perda.
 */
let avisouSemSegredo = false
function segredoDoHash(): string | null {
  const s = process.env.AUDIT_HASH_SALT || process.env.CRON_SECRET || ''
  if (s) return s
  if (!avisouSemSegredo) {
    avisouSemSegredo = true
    console.warn('[audit] AUDIT_HASH_SALT e CRON_SECRET ausentes: hash de IP e user-agent NAO sera gravado')
  }
  return null
}

/** HMAC-SHA256 com o segredo do servidor, truncado. `undefined` sem valor ou sem segredo. */
export function hashComSegredo(valor: string | undefined, tamanho = 16): string | undefined {
  if (!valor) return undefined
  const segredo = segredoDoHash()
  if (!segredo) return undefined
  return createHmac('sha256', segredo).update(valor).digest('hex').slice(0, tamanho)
}

const PARECE_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
// IPv4 pontilhado ou IPv6 (só hexadecimal e dois-pontos, com pelo menos dois `:`).
const PARECE_IP = /^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-f]*:[0-9a-f:]*:[0-9a-f.:]*$/i

/**
 * Forma com que um e-mail aparece no `entityId` do audit_logs. Exportada para
 * que `anonymizeUser` procure EXATAMENTE a mesma string que `audit()` gravou:
 * duas cópias da regra divergiriam em silêncio.
 */
export function entityIdDeEmail(email: string): string {
  return `sha256:${createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 32)}`
}

/**
 * Mantém a promessa viva depois da resposta, em função serverless.
 *
 * 🔴 Gravação solta (sem await) em rota da Vercel pode morrer congelada depois
 * que a resposta sai: o próprio projeto já mediu isso em polymarket/persist.ts.
 * `after()` do Next segura a instância até a promessa terminar. Fora de uma
 * requisição (script, teste) ele lança, e aí a promessa segue solta como antes.
 */
export function depoisDaResposta(p: Promise<unknown>): void {
  try {
    after(p)
  } catch {
    // fora do escopo de requisição: nada a segurar
  }
}

/**
 * Grava evento de auditoria em governance.audit_logs.
 * Nunca bloqueia a request e nunca lança: a promessa devolvida sempre resolve.
 * Dentro de uma rota, a gravação é registrada em `after()` para não se perder
 * quando a função congela depois da resposta.
 */
export function audit(
  action: string,
  entityType: string,
  entityId: string,
  detail?: { before?: unknown; after?: unknown; ip?: string; userAgent?: string; actorType?: string; actorId?: string }
): Promise<void> {
  const prisma = getPrisma()
  if (!prisma) return Promise.resolve()

  // 🔴 `entityId` NUNCA guarda e-mail em claro.
  //
  // Seis chamadas passavam o endereço cru (webhooks/resend e lib/email/subscribers),
  // e a tabela governance.audit_logs é justamente a que `anonymizeUser` NÃO
  // limpava: pedido de exclusão anonimizava Lead, User e ContactEvent e deixava
  // o endereço legível no log de auditoria, que é o oposto do que a tabela
  // existe para provar. Hashear aqui fecha as seis de uma vez, e o hash continua
  // servindo para correlacionar eventos do mesmo titular.
  //
  // E também NUNCA guarda IP em claro: o rate limit passava o IP como entityId,
  // e ele ficava ao lado do ip_hash, sem prazo. IP vira hash com segredo.
  const id = entityId.trim()
  const entityIdSeguro = PARECE_EMAIL.test(id)
    ? entityIdDeEmail(id)
    : PARECE_IP.test(id)
      ? `ip:${hashComSegredo(id) ?? 'n/a'}`
      : entityId

  const ipHash = hashComSegredo(detail?.ip)
  const uaHash = hashComSegredo(detail?.userAgent)

  let before: object | undefined
  let afterData: object | undefined
  try {
    before = detail?.before ? JSON.parse(JSON.stringify(detail.before)) : undefined
    afterData = detail?.after ? JSON.parse(JSON.stringify(detail.after)) : undefined
  } catch {
    afterData = { error: 'unserializable' }
  }

  const gravacao = prisma.auditLog
    .create({
      data: {
        actorType: detail?.actorType || 'system',
        actorId: detail?.actorId,
        action,
        entityType,
        entityId: entityIdSeguro,
        beforeData: before ?? undefined,
        afterData: afterData ?? undefined,
        ipHash,
        userAgentHash: uaHash,
      },
    })
    .then(() => undefined)
    .catch((err) => {
      console.error('[audit] Neon write failed:', action, entityType, err instanceof Error ? err.message : err)
    })

  depoisDaResposta(gravacao)
  return gravacao
}
