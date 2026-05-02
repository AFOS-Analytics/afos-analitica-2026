'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">Erro</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
          Algo deu errado
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          Encontramos um problema ao carregar esta página. Tente novamente em
          alguns segundos. Se o erro persistir, volte à página inicial.
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
            Tentar novamente
          </button>
          <Link
            href="/pt-BR"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-dark text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Página inicial
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-12">
          AFOS Analytics — Inteligência Eleitoral Open-Source
        </p>
      </div>
    </main>
  )
}
