import { Fragment } from 'react'

/**
 * Markdown INLINE mínimo do Weekly: só negrito `**x**` e link `[t](url)`.
 *
 * 🔒 POR QUE NÃO USAR UM RENDERIZADOR COMPLETO AQUI: o conteúdo vem de
 * frontmatter YAML, e um renderizador com HTML cru transformaria qualquer
 * `<script>` que entrasse no arquivo em execução na página. Este parser não
 * interpreta HTML: o que não casar com os dois padrões abaixo sai como TEXTO,
 * visível e inofensivo. Defeito visível é melhor que defeito executado.
 *
 * ⛔ Link externo sempre com `rel="noopener noreferrer"`, e só http(s): outros
 * esquemas (`javascript:`, `data:`) são renderizados como texto puro.
 */

const PADRAO = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g

function urlSegura(u: string): boolean {
  return /^https?:\/\//i.test(u)
}

export function WeeklyMarkdown({ text }: { text: string }) {
  if (!text) return null
  const partes = text.split(PADRAO)

  return (
    <>
      {partes.map((p, i) => {
        if (!p) return null

        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold">
              {p.slice(2, -2)}
            </strong>
          )
        }

        const link = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (link) {
          const [, rotulo, href] = link
          if (!urlSegura(href)) return <Fragment key={i}>{p}</Fragment>
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {rotulo}
            </a>
          )
        }

        return <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}
