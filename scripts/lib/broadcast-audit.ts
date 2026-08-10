/**
 * broadcast-audit.ts — trilha de auditoria dos broadcasts.
 *
 * POR QUE EXISTE
 * Até 09/Ago/2026 os três broadcasts (daily, tradeoff, weekly) liam os leads,
 * mandavam pelo Resend e **não gravavam nada**. A única evidência de um
 * disparo era a linha "20 enviados / 0 falhas" no terminal, que morre com a
 * sessão. Não dava para responder depois: quem recebeu, em que idioma, de que
 * edição, e o que o Resend respondeu. O modelo `ContactEvent` já existia e
 * ninguém escrevia nele.
 *
 * 🔒 DADO PESSOAL: `contactEvent` está classificado como PESSOAL em
 * `scripts/backup-neon.ts` e por isso NÃO entra no backup do repositório
 * público. Conferido antes de escrever a primeira linha aqui. O e-mail nunca
 * é gravado no payload: a ligação com a pessoa é o `leadId`, que é o que a
 * tabela já faz por desenho.
 */

import type { PrismaClient } from '@prisma/client'

export type ResultadoEnvio = {
  leadId: string
  locale: string
  ok: boolean
  /** id do Resend, quando houve envio real. É o que permite reconciliar depois. */
  messageId?: string
  erro?: string
  /** true quando o lead foi pulado antes de tentar enviar */
  pulado?: boolean
}

export type MetaBroadcast = {
  /** 'daily' | 'tradeoff' | 'weekly' */
  produto: string
  /** data da edição, YYYY-MM-DD */
  edicao: string
  pais: string
  issueNumber?: number
  /** marcar true SÓ em backfill, e dizer de onde veio o dado */
  backfill?: boolean
  fonte?: string
}

/**
 * Grava um evento por destinatário. Um `createMany` só, para não transformar
 * o broadcast em N round-trips.
 *
 * ⚠️ Falha ao gravar a trilha NÃO derruba o broadcast, porque o e-mail já
 * saiu e reverter não é possível. Mas ela GRITA, porque trilha que falha
 * calada é o mesmo que não ter trilha.
 */
export async function registrarBroadcast(
  prisma: PrismaClient,
  meta: MetaBroadcast,
  resultados: ResultadoEnvio[],
): Promise<{ gravados: number; erro?: string }> {
  if (resultados.length === 0) return { gravados: 0 }

  const linhas = resultados.map((r) => ({
    leadId: r.leadId,
    eventType: r.pulado
      ? `broadcast_${meta.produto}_skipped`
      : r.ok
        ? `broadcast_${meta.produto}_sent`
        : `broadcast_${meta.produto}_failed`,
    eventPayload: {
      produto: meta.produto,
      edicao: meta.edicao,
      pais: meta.pais,
      ...(meta.issueNumber !== undefined ? { issueNumber: meta.issueNumber } : {}),
      locale: r.locale,
      ...(r.messageId ? { messageId: r.messageId } : {}),
      ...(r.erro ? { erro: r.erro } : {}),
      ...(meta.backfill ? { backfill: true, fonte: meta.fonte ?? 'nao declarada' } : {}),
    } as object,
  }))

  try {
    const res = await prisma.contactEvent.createMany({ data: linhas })
    console.log(`🧾 trilha: ${res.count} evento(s) gravado(s) em contact_events (${meta.produto} ${meta.edicao} ${meta.pais}).`)
    return { gravados: res.count }
  } catch (e) {
    const msg = (e as Error).message
    console.error('')
    console.error('🔴 TRILHA NÃO GRAVADA. Os e-mails SAÍRAM, o registro não.')
    console.error(`   ${msg}`)
    console.error('   Não dá para reverter o envio. Registre à mão com:')
    console.error(`   npx tsx scripts/backfill-broadcast-audit.ts ${meta.produto} ${meta.edicao} --pais=${meta.pais}`)
    console.error('')
    return { gravados: 0, erro: msg }
  }
}
