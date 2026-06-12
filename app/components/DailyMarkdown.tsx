/* eslint-disable react/no-unescaped-entities */
/**
 * Renderização SERVER-SIDE do markdown do AFOS Daily (TL;DR, lede, corpo).
 *
 * Isolar react-markdown + remark-gfm AQUI (componente server, sem 'use client')
 * mantém ~50KB fora do bundle client de /daily/[date]. O AfosDailyTemplate (client,
 * dono do toggle de tema) recebe estes nós já renderizados como props.
 *
 * As cores NÃO são decididas aqui: cada elemento leva uma classe-marcador (amd-*)
 * cujo tom vem do CSS escopado por [data-theme] (app/globals.css), setado pelo
 * toggle. As classes de layout/tipografia (estáticas) ficam inline, idênticas às
 * que o template usava antes.
 */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Um bullet do TL;DR: markdown inline (p→span) com strong/link tematizados via CSS. */
export function DailyTldr({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <span>{children}</span>,
        strong: ({ children }) => <strong className="amd-tldr-strong">{children}</strong>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="amd-link">{children}</a>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}

/** Lede (box amarelo): texto slate-900 invariante; só o link é tematizado. */
export function DailyLede({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-900">{children}</p>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="amd-link">{children}</a>
        ),
        strong: ({ children }) => <strong>{children}</strong>,
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}

/** Corpo do Daily. Mapeamentos idênticos ao template anterior; cor via amd-* + [data-theme]. */
export function DailyBody({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: () => null,
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b-2 amd-h2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold mt-8 mb-3 amd-strong">{children}</h3>
        ),
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b-2 amd-thead">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b last:border-b-0 amd-tr">{children}</tr>,
        th: ({ children }) => (
          <th className="text-left px-3 py-2 font-semibold amd-strong">{children}</th>
        ),
        td: ({ children }) => <td className="px-3 py-2 align-top amd-body">{children}</td>,
        p: ({ children }) => <p className="mb-4 leading-relaxed amd-body">{children}</p>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="amd-link">{children}</a>
        ),
        strong: ({ children }) => <strong className="font-bold amd-strong">{children}</strong>,
        ul: ({ children }) => <ul className="space-y-3 leading-relaxed mb-6 list-none pl-0 amd-body">{children}</ul>,
        ol: ({ children }) => <ol className="space-y-3 leading-relaxed mb-6 list-decimal pl-6 amd-body">{children}</ol>,
        li: ({ children }) => <li className="flex gap-3"><span>{children}</span></li>,
        blockquote: ({ children }) => (
          <div className="border-l-4 pl-5 py-4 my-4 rounded-r [&_p]:mb-3 [&_p:last-child]:mb-0 amd-bq">
            {children}
          </div>
        ),
        hr: () => <hr className="my-10 amd-hr" />,
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}
