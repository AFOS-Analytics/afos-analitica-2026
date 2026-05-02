import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página não encontrada — AFOS Analytics',
  description: 'A página solicitada não existe.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
          Página não encontrada
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          O endereço que você acessou não existe ou foi movido. Confira o link
          ou volte para a página inicial.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pt-BR"
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Página inicial
          </Link>
          <Link
            href="/pt-BR/dashboard"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-dark text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-12">
          AFOS Analytics — Inteligência Eleitoral Open-Source
        </p>
      </div>
    </main>
  )
}
