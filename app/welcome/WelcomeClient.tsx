'use client'

import { useState } from 'react'

interface Props {
  email: string
}

const LOCALES = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const

export default function WelcomeClient({ email }: Props) {
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLocaleClick = async (locale: string) => {
    if (submitting) return
    setSubmitting(locale)
    setError(null)
    try {
      const res = await fetch('/api/lead/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ locale }),
      })
      if (!res.ok) {
        setError('Could not save preference — redirecting anyway.')
      }
    } catch {
      setError('Network error — redirecting anyway.')
    }
    // Redirect regardless: preference is best-effort, dashboard access is the priority.
    window.location.href = `/${locale}/dashboard/br`
  }

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        backgroundColor: '#0F52BA',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 8vw, 3rem) clamp(0.75rem, 4vw, 1.5rem)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 8vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 0.75rem',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          AFOS Analytics
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.125rem', margin: '0 0 0.35rem', lineHeight: 1.5, fontWeight: 500 }}>
          Global Electoral Political Risk Intelligence
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', margin: '0 0 3rem', lineHeight: 1.4, fontWeight: 400, letterSpacing: '0.02em' }}>
          Open-Source
        </p>

        <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.15rem', margin: '0 0 0.35rem', lineHeight: 1.5, fontWeight: 600 }}>
          Welcome — choose your language to receive AFOS Daily
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: '0 0 1.5rem', lineHeight: 1.4 }}>
          Escolha seu idioma · Choose your language · Elija su idioma
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleLocaleClick(loc.code)}
              disabled={submitting !== null}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: submitting === loc.code ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.12)',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting && submitting !== loc.code ? 0.5 : 1,
                transition: 'background-color 120ms, opacity 120ms',
              }}
            >
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{loc.flag}</span>
              <span>{loc.label}</span>
            </button>
          ))}
        </div>

        {error && (
          <p style={{ color: 'rgba(255,200,200,0.95)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
            {error}
          </p>
        )}

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '2rem 0 0' }}>
          Signed up as: {email}
        </p>
      </div>
    </main>
  )
}
