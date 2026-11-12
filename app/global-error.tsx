'use client'

import './globals.css'
import { PaginaDeErro, useIdiomaDaRota } from './components/layout/PaginaDeErro'

/**
 * Erro no PRÓPRIO layout raiz (app/[locale]/layout.tsx ou app/(raiz)/layout.tsx).
 * Antes de haver dois layouts raiz, o app/error.tsx ficava acima do layout de
 * /[idioma] e pegava esse caso; agora quem pega é esta fronteira, que substitui
 * o documento inteiro e por isso monta `<html>` e `<body>`.
 */
export default function GlobalError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useIdiomaDaRota()
  return (
    <html lang={locale}>
      <body className="bg-white text-dark">
        <PaginaDeErro {...props} />
      </body>
    </html>
  )
}
