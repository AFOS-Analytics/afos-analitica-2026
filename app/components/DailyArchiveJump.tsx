'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

// Client-side "jump to a specific date" control for the AFOS Daily archive.
// Native date input keeps it accessible and browser-localized; min/max bound it
// to the available range. Editions are consecutive (no gaps), so any in-range
// date resolves; if a gap ever appears, the [date] page 404s gracefully.
export function DailyArchiveJump({
  locale,
  min,
  max,
  label,
  isBlue = false,
}: {
  locale: string
  min: string
  max: string
  label: string
  isBlue?: boolean
}) {
  const router = useRouter()
  // Teclado: cada seta ou dígito que fecha um segmento válido dispara change, e
  // navegar ali trocava de página a cada tecla. Por isso, quando a mudança vem
  // do teclado, só navega no Enter ou ao sair do campo. Escolha no calendário
  // (mouse ou toque) segue navegando na hora, como antes.
  const teclando = useRef(false)
  const ultimo = useRef(max)
  const ir = (v: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || v < min || v > max || v === ultimo.current) return
    ultimo.current = v
    router.push(`/${locale}/daily/${v}`)
  }
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <label htmlFor="daily-jump" className={`text-sm font-medium ${isBlue ? 'text-blue-100' : 'text-gray-600'}`}>
        {label}
      </label>
      <input
        id="daily-jump"
        type="date"
        min={min}
        max={max}
        defaultValue={max}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            ir(e.currentTarget.value)
          } else if (e.key !== 'Tab') {
            teclando.current = true
          }
        }}
        onPointerDown={() => {
          teclando.current = false
        }}
        onChange={(e) => {
          if (!teclando.current) ir(e.target.value)
        }}
        onBlur={(e) => {
          if (teclando.current) ir(e.target.value)
          teclando.current = false
        }}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}
