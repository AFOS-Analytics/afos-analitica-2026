'use client'

/**
 * Núcleo do chat AFOS-Analytics (lógica + UI da conversa).
 *
 * Preenche o container pai (`h-full`). Usado tanto pela página /chat
 * (ChatPanel) quanto pela bolha flutuante (ChatWidget). Conversa com
 * POST /api/chat (SSE): mostra atividade de ferramenta, faz stream da
 * resposta e renderiza markdown. Strings trilíngues inline.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Locale } from '../../lib/i18n/config'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

type UIStrings = {
  subtitle: string
  placeholder: string
  send: string
  disclaimer: string
  thinking: string
  consulting: string
  errorGeneric: string
  suggestionsLabel: string
  suggestions: string[]
  toolNames: Record<string, string>
}

const STRINGS: Record<Locale, UIStrings> = {
  'pt-BR': {
    subtitle: 'Converse com o agente sobre mercados, pesquisas e os casos validados.',
    placeholder: 'Pergunte sobre as odds de 2026, pesquisas, divergência…',
    send: 'Enviar',
    disclaimer:
      'O agente consulta dados reais do AFOS (Polymarket, pesquisas TSE, casos validados, notícias). Mercados de previsão são probabilidades implícitas, não previsões oficiais. Pode conter erros, verifique dados críticos.',
    thinking: 'Pensando…',
    consulting: 'Consultando',
    errorGeneric: 'Não foi possível concluir a resposta. Tente novamente.',
    suggestionsLabel: 'Sugestões',
    suggestions: [
      'Quais as odds atuais da eleição presidencial de 2026?',
      'O que as pesquisas recentes do TSE mostram?',
      'Explique a tese de divergência do AFOS com um caso validado.',
      'Qual a edição mais recente do AFOS Daily?',
    ],
    toolNames: {
      get_live_market_odds: 'odds do Polymarket',
      search_brazil_polls: 'pesquisas TSE',
      get_validated_cases: 'casos validados',
      get_latest_news: 'notícias',
      get_afos_daily_latest: 'AFOS Daily',
    },
  },
  en: {
    subtitle: 'Talk to the agent about markets, polls and the validated cases.',
    placeholder: 'Ask about 2026 odds, polls, divergence…',
    send: 'Send',
    disclaimer:
      'The agent queries real AFOS data (Polymarket, TSE polls, validated cases, news). Prediction markets are implied probabilities, not official forecasts. May contain errors, verify critical data.',
    thinking: 'Thinking…',
    consulting: 'Querying',
    errorGeneric: 'Could not complete the answer. Please try again.',
    suggestionsLabel: 'Suggestions',
    suggestions: [
      'What are the current odds for the 2026 presidential election?',
      'What do recent TSE polls show?',
      'Explain the AFOS divergence thesis with a validated case.',
      'What is the latest AFOS Daily edition?',
    ],
    toolNames: {
      get_live_market_odds: 'Polymarket odds',
      search_brazil_polls: 'TSE polls',
      get_validated_cases: 'validated cases',
      get_latest_news: 'news',
      get_afos_daily_latest: 'AFOS Daily',
    },
  },
  es: {
    subtitle: 'Habla con el agente sobre mercados, encuestas y los casos validados.',
    placeholder: 'Pregunta por las odds de 2026, encuestas, divergencia…',
    send: 'Enviar',
    disclaimer:
      'El agente consulta datos reales del AFOS (Polymarket, encuestas TSE, casos validados, noticias). Los mercados de predicción son probabilidades implícitas, no pronósticos oficiales. Puede contener errores, verifica datos críticos.',
    thinking: 'Pensando…',
    consulting: 'Consultando',
    errorGeneric: 'No se pudo completar la respuesta. Inténtalo de nuevo.',
    suggestionsLabel: 'Sugerencias',
    suggestions: [
      '¿Cuáles son las odds actuales de la elección presidencial de 2026?',
      '¿Qué muestran las encuestas recientes del TSE?',
      'Explica la tesis de divergencia del AFOS con un caso validado.',
      '¿Cuál es la última edición del AFOS Daily?',
    ],
    toolNames: {
      get_live_market_odds: 'odds de Polymarket',
      search_brazil_polls: 'encuestas TSE',
      get_validated_cases: 'casos validados',
      get_latest_news: 'noticias',
      get_afos_daily_latest: 'AFOS Daily',
    },
  },
}

export function ChatConversation({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const s = STRINGS[locale] ?? STRINGS['pt-BR']
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  // ID efêmero de sessão: só agrupa os turnos da conversa no arquivo anônimo do servidor.
  // Não é cookie, não persiste entre recargas, não identifica o usuário.
  const sessionIdRef = useRef<string>('')

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, activeTool])

  useEffect(() => () => abortRef.current?.abort(), [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || busy) return

      const nextMessages: Msg[] = [...messages, { role: 'user', content: trimmed }]
      setMessages(nextMessages)
      setInput('')
      setBusy(true)
      setActiveTool(null)

      const controller = new AbortController()
      abortRef.current = controller

      setMessages((m) => [...m, { role: 'assistant', content: '' }])

      try {
        if (!sessionIdRef.current) {
          sessionIdRef.current =
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
        }
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: nextMessages, locale, sessionId: sessionIdRef.current }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.message || s.errorGeneric)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let gotText = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            const t = line.trim()
            if (!t.startsWith('data:')) continue
            let evt: { type: string; text?: string; name?: string; message?: string }
            try {
              evt = JSON.parse(t.slice(5).trim())
            } catch {
              continue
            }
            if (evt.type === 'tool') {
              setActiveTool(evt.name ?? null)
            } else if (evt.type === 'delta' && evt.text) {
              gotText = true
              setActiveTool(null)
              setMessages((m) => {
                const copy = [...m]
                copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1].content + evt.text }
                return copy
              })
            } else if (evt.type === 'error') {
              throw new Error(evt.message || s.errorGeneric)
            }
          }
        }

        if (!gotText) {
          setMessages((m) => {
            const copy = [...m]
            copy[copy.length - 1] = { role: 'assistant', content: s.errorGeneric }
            return copy
          })
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return
        const message = err instanceof Error ? err.message : s.errorGeneric
        setMessages((m) => {
          const copy = [...m]
          const last = copy[copy.length - 1]
          if (last?.role === 'assistant' && !last.content) {
            copy[copy.length - 1] = { role: 'assistant', content: `⚠️ ${message}` }
          } else {
            copy.push({ role: 'assistant', content: `⚠️ ${message}` })
          }
          return copy
        })
      } finally {
        setBusy(false)
        setActiveTool(null)
        abortRef.current = null
      }
    },
    [busy, messages, locale, s],
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void sendMessage(input)
  }

  const shownSuggestions = compact ? s.suggestions.slice(0, 3) : s.suggestions

  return (
    <div className="flex flex-col h-full min-h-0 w-full">
      {/* Histórico */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-4 px-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-2">
            <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm">{s.subtitle}</p>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">{s.suggestionsLabel}</p>
            <div className={compact ? 'grid gap-2' : 'grid sm:grid-cols-2 gap-2'}>
              {shownSuggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => void sendMessage(q)}
                  className="text-left text-sm border border-light-border dark:border-dark-secondary rounded-lg px-3 py-2 hover:border-primary hover:bg-primary/5 transition-colors text-gray-700 dark:text-gray-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            {m.role === 'user' ? (
              <div className="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%] whitespace-pre-wrap break-words text-sm">
                {m.content}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-dark-secondary text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%] overflow-hidden">
                {m.content ? (
                  <div className="afos-chat-md text-sm leading-relaxed break-words">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
                            {children}
                          </a>
                        ),
                        table: ({ children }) => (
                          <div className="my-3 overflow-x-auto">
                            <table className="w-full border-collapse text-xs">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => <th className="text-left px-2 py-1 font-semibold border-b border-gray-300 dark:border-gray-600">{children}</th>,
                        td: ({ children }) => <td className="px-2 py-1 align-top border-b border-gray-200 dark:border-gray-700">{children}</td>,
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-[0.85em]">{children}</code>,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-2 text-gray-500 text-sm">
                    <Spinner />
                    {activeTool ? `${s.consulting}: ${s.toolNames[activeTool] ?? activeTool}` : s.thinking}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="border-t border-light-border dark:border-dark-secondary pt-3 pb-3 px-4 shrink-0">
        <form onSubmit={onSubmit} className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void sendMessage(input)
              }
            }}
            rows={1}
            placeholder={s.placeholder}
            disabled={busy}
            className="flex-1 resize-none rounded-xl border border-light-border dark:border-dark-secondary bg-white dark:bg-dark px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-32"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="shrink-0 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-colors"
          >
            {s.send}
          </button>
        </form>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 leading-snug">{s.disclaimer}</p>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
    </svg>
  )
}
