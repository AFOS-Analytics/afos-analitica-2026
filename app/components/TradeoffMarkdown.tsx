/* eslint-disable react/no-unescaped-entities */
/**
 * Renderização SERVER-SIDE do markdown do AFOS Tradeoff.
 *
 * Mesmo princípio do DailyMarkdown: isolar react-markdown + remark-gfm aqui
 * (componente server) mantém ~50KB fora do bundle client de /tradeoff/[date].
 * O AfosTradeoffTemplate (client, dono do toggle de tema) recebe estes nós já
 * renderizados via o bundle `md` e os distribui pelos sub-componentes.
 *
 * Cor: o <p>/<span> NÃO leva cor (herda do bloco-pai chrome, que segue client com
 * isBlue); apenas strong/link levam classe-marcador (amd-*) tematizada por
 * [data-theme] no CSS (app/globals.css). Tokens idênticos aos do MarkdownInline.
 */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Markdown inline em parágrafos (equivale ao antigo MarkdownInline). */
export function Inline({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-3.5 last:mb-0 leading-relaxed">{children}</p>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline-offset-2 border-b border-current/40 amd-link">{children}</a>
        ),
        strong: ({ children }) => <strong className="amd-inline-strong">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

/** Variante inline sem parágrafo (p→span), usada nos rightDetails do bloco anti-média. */
export function InlineSpan({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <span>{children}</span>,
        strong: ({ children }) => <strong className="amd-inline-strong">{children}</strong>,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

/** Corpo-fallback (placeholder Fase 1): markdown padrão; o tema vem do wrapper prose/prose-invert. */
export function Body({ text }: { text: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
}
