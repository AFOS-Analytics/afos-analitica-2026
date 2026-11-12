import { caminhoDashboard } from '../../../lib/paineis.mjs'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Locale } from '../../../lib/i18n/config'

/**
 * Corpo da página 404, comum aos dois lugares que a servem:
 *   - app/[locale]/not-found.tsx, para `notFound()` chamado por página de /[idioma];
 *   - app/global-not-found.tsx, para endereço que não casa com rota nenhuma.
 * O idioma vem de quem chama, para que nenhum dos dois precise ler cabeçalho
 * dentro da árvore de /[idioma] (ler cabeçalho ali deixava o site todo dinâmico).
 */
export const metadataNaoEncontrada: Metadata = {
  title: 'Página não encontrada — AFOS Analytics',
  description: 'A página solicitada não existe.',
  robots: { index: false, follow: true },
}

// Textos por locale. pt-BR = cópia original preservada; en/es adicionados (aditivo).
const T = {
  'pt-BR': {
    title: 'Página não encontrada',
    body: 'O endereço que você acessou não existe ou foi movido. Confira o link ou volte para a página inicial.',
    home: 'Página inicial',
    dash: 'Dashboard',
  },
  en: {
    title: 'Page not found',
    body: 'The address you visited does not exist or was moved. Check the link or return to the home page.',
    home: 'Home',
    dash: 'Dashboard',
  },
  es: {
    title: 'Página no encontrada',
    body: 'La dirección que visitaste no existe o fue movida. Revisa el enlace o vuelve a la página de inicio.',
    home: 'Inicio',
    dash: 'Dashboard',
  },
}

export function PaginaNaoEncontrada({ locale }: { locale: Locale }) {
  const t = T[locale]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
          {t.title}
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          {t.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}`}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.home}
          </Link>
          <Link
            href={caminhoDashboard(locale)}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-dark text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            {t.dash}
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-12">
          AFOS Analytics — Inteligência de Risco Político Eleitoral Global — Open-Source
        </p>
      </div>
    </main>
  )
}
