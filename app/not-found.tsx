import Link from 'next/link'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { isValidLocale, defaultLocale } from '../lib/i18n/config'

export const metadata: Metadata = {
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

export default async function NotFound() {
  // O middleware propaga o locale da rota via header x-pathname-locale.
  const h = await headers()
  const seg = h.get('x-pathname-locale')
  const locale = seg && isValidLocale(seg) ? seg : defaultLocale
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
            href={`/${locale}/dashboard/br`}
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
