'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isValidLocale, defaultLocale } from '../../../lib/i18n/config'

/**
 * Corpo da página de erro, comum a app/[locale]/error.tsx, app/(raiz)/error.tsx e
 * app/global-error.tsx. Cada layout raiz precisa da sua fronteira de erro desde
 * que o site passou a ter dois layouts raiz (12/Nov/2026).
 */

// Textos por locale. pt-BR = cópia original preservada; en/es adicionados (aditivo).
const T = {
  'pt-BR': {
    eyebrow: 'Erro',
    title: 'Algo deu errado',
    body: 'Encontramos um problema ao carregar esta página. Tente novamente em alguns segundos. Se o erro persistir, volte à página inicial.',
    retry: 'Tentar novamente',
    home: 'Página inicial',
    assinatura: 'AFOS Analytics, Inteligência de Risco Político Eleitoral Global, Open-Source',
  },
  en: {
    eyebrow: 'Error',
    title: 'Something went wrong',
    body: 'We hit a problem loading this page. Try again in a few seconds. If the error persists, return to the home page.',
    retry: 'Try again',
    home: 'Home',
    assinatura: 'AFOS Analytics, Global Electoral Political Risk Intelligence, Open-Source',
  },
  es: {
    eyebrow: 'Error',
    title: 'Algo salió mal',
    body: 'Tuvimos un problema al cargar esta página. Inténtalo de nuevo en unos segundos. Si el error persiste, vuelve a la página de inicio.',
    retry: 'Intentar de nuevo',
    home: 'Inicio',
    assinatura: 'AFOS Analytics, Inteligencia de Riesgo Político Electoral Global, Open-Source',
  },
}

/** Idioma da rota pelo 1º segmento do caminho; fora de /[idioma], o padrão da casa. */
export function useIdiomaDaRota() {
  const pathname = usePathname()
  const seg = (pathname || '').split('/')[1]
  return isValidLocale(seg) ? seg : defaultLocale
}

export function PaginaDeErro({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Production error logging hook (Vercel deploy logs catch console.error)
    console.error('[afos-error-boundary]', error)
  }, [error])

  const locale = useIdiomaDaRota()
  const t = T[locale]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">{t.eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
          {t.title}
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          {t.body}
        </p>
        {error.digest && (
          <p className="text-[10px] text-gray-400 font-mono mb-6">
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.retry}
          </button>
          <Link
            href={`/${locale}`}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-dark text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            {t.home}
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-12">
          {t.assinatura}
        </p>
      </div>
    </main>
  )
}
