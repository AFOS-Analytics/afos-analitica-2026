'use client'

/**
 * Carrega o namespace `about` (seções about + metas, ~10KB) de forma lazy e só
 * onde é necessário, os modais Sobre/Metas do dashboard. Esse namespace foi
 * removido do carregamento global (lib/i18n/get-messages.ts) para não pesar o
 * payload de TODA página com texto que ~ninguém abre.
 *
 * Mergeia o JSON carregado nas mensagens atuais e provê um I18nProvider aninhado,
 * então os modais seguem usando t('about.*') / t('metas.*') sem alteração. Como
 * os modais só renderizam quando abertos, o chunk (carregado no mount) já chegou
 * antes do clique, sem flash de chaves.
 */

import { useEffect, useState, type ReactNode } from 'react'
import { I18nProvider, useTranslation } from '../i18n/context'

type Msgs = Record<string, Record<string, string | string[]>>

export function LazyAboutMessages({ children }: { children: ReactNode }) {
  const { locale, messages } = useTranslation()
  const [extra, setExtra] = useState<Msgs | null>(null)

  useEffect(() => {
    let active = true
    import(`../../messages/${locale}/about.json`)
      .then((m) => { if (active) setExtra((m.default || m) as Msgs) })
      .catch(() => { /* fallback: modais mostram chaves; aceitável e raro */ })
    return () => { active = false }
  }, [locale])

  if (!extra) return <>{children}</>

  const merged: Msgs = { ...messages }
  for (const [section, values] of Object.entries(extra)) {
    merged[section] = { ...merged[section], ...values }
  }
  return <I18nProvider initialLocale={locale} initialMessages={merged}>{children}</I18nProvider>
}
