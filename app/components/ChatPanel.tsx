'use client'

/**
 * Página /chat, casca de largura/altura em torno do núcleo ChatConversation.
 * A lógica de conversa/stream vive em ChatConversation (compartilhada com a
 * bolha flutuante ChatWidget).
 */

import type { Locale } from '../../lib/i18n/config'
import { ChatConversation } from './ChatConversation'

export function ChatPanel({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-3xl mx-auto w-full">
      <ChatConversation locale={locale} />
    </div>
  )
}
