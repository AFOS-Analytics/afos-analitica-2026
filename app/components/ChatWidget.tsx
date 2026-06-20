'use client'

/**
 * Bolha flutuante do chat AFOS-Analytics — presente em TODAS as páginas
 * (montada no layout [locale]). Clicar abre o chat num overlay, sem sair da
 * página. Esconde-se na própria rota /chat (que já é o chat em tela cheia).
 *
 * Performance: o núcleo ChatConversation (+ react-markdown) é carregado LAZY,
 * só quando a bolha é aberta pela primeira vez — não pesa o bundle das demais
 * páginas. SSR off (componente puramente interativo).
 */

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { Locale } from '../../lib/i18n/config'

const ChatConversation = dynamic(() => import('./ChatConversation').then((m) => m.ChatConversation), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
      <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
      </svg>
    </div>
  ),
})

const LABELS: Record<Locale, { open: string; close: string; title: string; tagline: string }> = {
  'pt-BR': { open: 'Abrir o chat', close: 'Fechar', title: 'Chat AFOS-Analytics', tagline: 'Agente eleitoral · dados ao vivo' },
  en: { open: 'Open chat', close: 'Close', title: 'AFOS-Analytics Chat', tagline: 'Election agent · live data' },
  es: { open: 'Abrir el chat', close: 'Cerrar', title: 'Chat AFOS-Analytics', tagline: 'Agente electoral · datos en vivo' },
}

export function ChatWidget({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false) // só monta o núcleo após 1ª abertura
  const pathname = usePathname()
  const l = LABELS[locale] ?? LABELS['pt-BR']

  // Esconde na página /chat dedicada (evita chat duplicado).
  const onChatPage = pathname?.replace(/\/$/, '').endsWith('/chat')

  useEffect(() => {
    if (open && !mounted) setMounted(true)
  }, [open, mounted])

  // ESC fecha.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (onChatPage) return null

  return (
    <>
      {/* Painel overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={l.title}
          className="fixed z-[70] bottom-0 right-0 w-full h-[100dvh] sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[640px] sm:max-h-[calc(100vh-7rem)] flex flex-col bg-white dark:bg-dark sm:rounded-2xl shadow-2xl border border-light-border dark:border-dark-secondary overflow-hidden"
        >
          {/* Cabeçalho do painel */}
          <div className="flex items-center justify-between gap-3 bg-primary text-white px-4 py-3 shrink-0">
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight truncate">{l.title}</p>
              <p className="text-[11px] text-blue-100 leading-tight truncate">{l.tagline}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={l.close}
              className="shrink-0 rounded-lg p-1.5 hover:bg-white/15 focus:outline-2 focus:outline-offset-2 focus:outline-white transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Conversa (lazy) */}
          <div className="flex-1 min-h-0 flex flex-col">
            {mounted && <ChatConversation locale={locale} compact />}
          </div>
        </div>
      )}

      {/* Bolha */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? l.close : l.open}
        aria-expanded={open}
        className={`fixed z-[60] bottom-5 right-5 h-14 w-14 rounded-full bg-orange-50 hover:bg-orange-100 text-primary border border-orange-200 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-primary ${open ? 'hidden sm:flex' : 'flex'}`}
      >
        {open ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.04 2 11c0 2.6 1.23 4.94 3.2 6.56-.13 1.2-.6 2.3-1.36 3.22-.2.24-.25.57-.13.86.12.29.4.48.71.48 1.9 0 3.65-.66 5.04-1.77C10.4 20.79 11.18 21 12 21c5.52 0 10-4.04 10-9s-4.48-10-10-10z" />
          </svg>
        )}
      </button>
    </>
  )
}
