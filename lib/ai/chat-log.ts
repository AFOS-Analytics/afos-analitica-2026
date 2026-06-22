/**
 * Arquivo ANÔNIMO de conversas do chatbot.
 *
 * Princípio (decidido 21/Jun/2026): NÃO guardamos quem perguntou. Sem IP, sem
 * user-agent, sem fingerprint, sem vínculo de identidade. O `sessionId` é um UUID
 * efêmero gerado no cliente, que só agrupa os turnos de uma mesma conversa.
 * Por não haver identificador vinculável, o conteúdo é dado anonimizado (fora do
 * escopo da LGPD, Art. 12). Retenção: 12 meses (purga via scripts/purge-chat-logs.ts).
 *
 * Tudo aqui é fail-open: qualquer erro de persistência é engolido e jamais quebra
 * a resposta do chat ao usuário.
 */

import { prisma } from '../db'

interface LogTurnInput {
  sessionId: string
  locale: string
  userText: string
  assistantText: string
  tools?: string[]
}

/**
 * Scrub leve de PII que o PRÓPRIO usuário possa ter digitado (não é coleta nossa):
 * e-mails, CPF formatado e sequências longas de dígitos (telefone/CPF). Conservador
 * de propósito para não destruir percentuais, anos e protocolos TSE da análise.
 */
export function scrubPII(text: string): string {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[email]')
    .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '[doc]')
    .replace(/[\d()+\s.-]{10,}/g, (m) => {
      const digits = m.replace(/\D/g, '')
      return digits.length >= 10 && digits.length <= 14 ? ' [num] ' : m
    })
}

export async function logChatTurn(input: LogTurnInput): Promise<void> {
  if (!prisma) return
  const sessionId = (input.sessionId || '').trim().slice(0, 64)
  if (!sessionId) return
  const userText = (input.userText || '').trim()
  if (!userText) return

  try {
    let convo = await prisma.chatConversation.findFirst({
      where: { sessionId },
      orderBy: { startedAt: 'desc' },
    })
    if (!convo) {
      convo = await prisma.chatConversation.create({
        data: { sessionId, locale: input.locale },
      })
    }

    const baseSeq = convo.messageCount
    const rows: Array<{
      conversationId: string
      role: string
      content: string
      sequence: number
      tools?: string[]
    }> = [
      {
        conversationId: convo.id,
        role: 'user',
        content: scrubPII(userText).slice(0, 6000),
        sequence: baseSeq + 1,
      },
    ]
    const assistantText = (input.assistantText || '').trim()
    if (assistantText) {
      rows.push({
        conversationId: convo.id,
        role: 'assistant',
        content: scrubPII(assistantText).slice(0, 12000),
        sequence: baseSeq + 2,
        ...(input.tools && input.tools.length ? { tools: input.tools } : {}),
      })
    }

    await prisma.chatMessage.createMany({ data: rows })
    await prisma.chatConversation.update({
      where: { id: convo.id },
      data: { messageCount: baseSeq + rows.length, lastMessageAt: new Date(), locale: input.locale },
    })
  } catch (err) {
    console.warn('[chat-log] persist falhou (fail-open):', err instanceof Error ? err.message : err)
  }
}
